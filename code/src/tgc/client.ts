import type { EnvConfig } from "../config/env.js";

type Primitive = string | number | boolean;

export type WingSuccess = {
  result: Record<string, unknown>;
};

export type WingFailure = {
  error: {
    code?: number | string;
    message?: string;
    data?: unknown;
  };
};

export type WingResponse = WingSuccess | WingFailure;

export class TgcApiError extends Error {
  public readonly code: string;
  public readonly details: Record<string, unknown> | null;

  public constructor(code: string, message: string, details: Record<string, unknown> | null = null) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

type FormValue = Primitive | Blob | { blob: Blob; filename?: string };

type RequestOptions = {
  query?: Record<string, Primitive | undefined>;
  form?: Record<string, FormValue | undefined>;
  sessionId?: string;
};

class RequestPacer {
  private readonly minIntervalMs: number;
  private lastRequestAt = 0;

  public constructor(requestsPerSecond: number) {
    this.minIntervalMs = Math.ceil(1000 / requestsPerSecond);
  }

  public async waitTurn(): Promise<void> {
    const now = Date.now();
    const wait = this.lastRequestAt + this.minIntervalMs - now;
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    this.lastRequestAt = Date.now();
  }
}

export class TgcClient {
  private readonly baseUrl: string;
  private readonly pacer: RequestPacer;
  private readonly requestTimeoutMs: number;
  private readonly getRetryCount: number;
  private readonly retryBaseDelayMs: number;

  public constructor(env: EnvConfig) {
    this.baseUrl = env.TGC_API_BASE_URL.replace(/\/+$/, "");
    this.pacer = new RequestPacer(env.TGC_REQUESTS_PER_SECOND);
    this.requestTimeoutMs = env.TGC_REQUEST_TIMEOUT_MS;
    this.getRetryCount = env.TGC_GET_RETRY_COUNT;
    this.retryBaseDelayMs = env.TGC_RETRY_BASE_DELAY_MS;
  }

  public async get(path: string, options: RequestOptions = {}): Promise<Record<string, unknown>> {
    return this.request("GET", path, options);
  }

  public async post(path: string, options: RequestOptions = {}): Promise<Record<string, unknown>> {
    return this.request("POST", path, options);
  }

  public async put(path: string, options: RequestOptions = {}): Promise<Record<string, unknown>> {
    return this.request("PUT", path, options);
  }

  public async delete(path: string, options: RequestOptions = {}): Promise<Record<string, unknown>> {
    return this.request("DELETE", path, options);
  }

  private async request(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options: RequestOptions,
  ): Promise<Record<string, unknown>> {
    await this.pacer.waitTurn();

    const query = new URLSearchParams();
    if (options.sessionId) {
      query.set("session_id", options.sessionId);
    }
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);
    const queryText = query.toString();
    if (queryText) {
      url.search = queryText;
    }

    const init: RequestInit = { method };
    if (method !== "GET" && options.form) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(options.form)) {
        if (value !== undefined) {
          if (typeof value === "object") {
            if (value instanceof Blob) {
              formData.set(key, value);
              continue;
            }
            if ("blob" in value && value.blob instanceof Blob) {
              formData.set(key, value.blob, value.filename);
              continue;
            }
          }
          formData.set(key, String(value));
        }
      }
      init.body = formData;
    }

    const totalAttempts = method === "GET" ? this.getRetryCount + 1 : 1;
    let lastError: TgcApiError | null = null;

    for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
      try {
        const response = await this.fetchWithTimeout(url, init, method, normalizedPath);
        return await this.parseResponse(response);
      } catch (error: unknown) {
        const normalized = this.normalizeError(error, method, normalizedPath, attempt, totalAttempts);
        lastError = normalized;
        if (attempt >= totalAttempts || !this.shouldRetry(method, normalized)) {
          throw normalized;
        }
        const delayMs = this.retryBaseDelayMs * 2 ** (attempt - 1);
        if (delayMs > 0) {
          await sleep(delayMs);
        }
      }
    }

    throw lastError ?? new TgcApiError("UNEXPECTED_ERROR", "TGC request failed without an explicit error.");
  }

  private async fetchWithTimeout(
    url: URL,
    init: RequestInit,
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
  ): Promise<Response> {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.requestTimeoutMs);

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (error: unknown) {
      if (timedOut || isAbortError(error)) {
        throw new TgcApiError("TIMEOUT", "TGC API request timed out.", {
          timeoutMs: this.requestTimeoutMs,
          method,
          path,
        });
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new TgcApiError("NETWORK_ERROR", "Failed to reach The Game Crafter API.", {
        message,
        method,
        path,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async parseResponse(response: Response): Promise<Record<string, unknown>> {
    let payload: unknown;
    try {
      payload = (await response.json()) as WingResponse;
    } catch {
      if (isTransientStatus(response.status)) {
        throw new TgcApiError("HTTP_STATUS", `TGC API returned HTTP ${response.status}.`, {
          status: response.status,
          statusText: response.statusText,
        });
      }
      throw new TgcApiError("INVALID_RESPONSE", "TGC API returned non-JSON response.", {
        status: response.status,
        statusText: response.statusText,
      });
    }

    if (!payload || typeof payload !== "object") {
      throw new TgcApiError("INVALID_RESPONSE", "TGC API response had an unexpected shape.", {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const asWing = payload as WingResponse;
    if ("error" in asWing && asWing.error) {
      const code = asWing.error.code !== undefined ? String(asWing.error.code) : "API_ERROR";
      const message = asWing.error.message ?? "TGC API returned an error.";
      const details =
        asWing.error.data && typeof asWing.error.data === "object"
          ? (asWing.error.data as Record<string, unknown>)
          : asWing.error.data === null || asWing.error.data === undefined
            ? null
            : { data: asWing.error.data };
      throw new TgcApiError(code, message, mergeDetails(details, {
        status: response.status,
        statusText: response.statusText,
      }));
    }

    if (!("result" in asWing) || !asWing.result || typeof asWing.result !== "object") {
      throw new TgcApiError("INVALID_RESPONSE", "TGC API did not return a valid result object.", {
        status: response.status,
        statusText: response.statusText,
      });
    }

    return asWing.result;
  }

  private normalizeError(
    error: unknown,
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    attempt: number,
    totalAttempts: number,
  ): TgcApiError {
    if (error instanceof TgcApiError) {
      return new TgcApiError(
        error.code,
        error.message,
        mergeDetails(error.details, {
          method,
          path,
          attempt,
          attempts: totalAttempts,
          retryable: this.shouldRetry(method, error),
        }),
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return new TgcApiError("UNEXPECTED_ERROR", message, {
      method,
      path,
      attempt,
      attempts: totalAttempts,
      retryable: false,
    });
  }

  private shouldRetry(method: "GET" | "POST" | "PUT" | "DELETE", error: TgcApiError): boolean {
    if (method !== "GET") {
      return false;
    }
    if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT" || error.code === "HTTP_STATUS") {
      return true;
    }

    const numericCode = Number.parseInt(error.code, 10);
    if (Number.isFinite(numericCode) && isTransientStatus(numericCode)) {
      return true;
    }

    const status = typeof error.details?.status === "number" ? error.details.status : null;
    return status !== null && isTransientStatus(status);
  }
}

function isTransientStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function isAbortError(error: unknown): boolean {
  return !!error && typeof error === "object" && "name" in error && error.name === "AbortError";
}

function mergeDetails(
  details: Record<string, unknown> | null,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...(details ?? {}),
    ...extra,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
