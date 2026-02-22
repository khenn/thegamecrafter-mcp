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

  public constructor(env: EnvConfig) {
    this.baseUrl = env.TGC_API_BASE_URL.replace(/\/+$/, "");
    this.pacer = new RequestPacer(env.TGC_REQUESTS_PER_SECOND);
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

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new TgcApiError("NETWORK_ERROR", "Failed to reach The Game Crafter API.", { message });
    }

    let payload: unknown;
    try {
      payload = (await response.json()) as WingResponse;
    } catch {
      throw new TgcApiError("INVALID_RESPONSE", "TGC API returned non-JSON response.");
    }

    if (!payload || typeof payload !== "object") {
      throw new TgcApiError("INVALID_RESPONSE", "TGC API response had an unexpected shape.");
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
      throw new TgcApiError(code, message, details);
    }

    if (!("result" in asWing) || !asWing.result || typeof asWing.result !== "object") {
      throw new TgcApiError("INVALID_RESPONSE", "TGC API did not return a valid result object.");
    }

    return asWing.result;
  }
}
