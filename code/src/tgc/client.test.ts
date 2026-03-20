import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { EnvConfig } from "../config/env.js";
import { TgcApiError, TgcClient } from "./client.js";

function createEnv(overrides: Partial<EnvConfig> = {}): EnvConfig {
  return {
    TGC_API_BASE_URL: "https://example.com",
    TGC_PUBLIC_API_KEY_ID: "key",
    TGC_USERNAME: "user",
    TGC_PASSWORD: "pass",
    TGC_REQUESTS_PER_SECOND: 1000,
    TGC_REQUEST_TIMEOUT_MS: 100,
    TGC_GET_RETRY_COUNT: 2,
    TGC_RETRY_BASE_DELAY_MS: 10,
    ...overrides,
  };
}

describe("TgcClient reliability policy", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retries transient GET network failures and eventually succeeds", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: { id: "game-1" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv());
    const promise = client.get("/api/game/1");
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toEqual({ id: "game-1" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-GET network failures", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("socket hang up"));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv());

    await expect(client.post("/api/game", { form: { name: "Prototype" } })).rejects.toMatchObject({
      code: "NETWORK_ERROR",
      details: expect.objectContaining({
        method: "POST",
        path: "/api/game",
        attempt: 1,
        attempts: 1,
        retryable: false,
      }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("times out requests with explicit diagnostics", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation((_url: URL, init?: RequestInit) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv({ TGC_GET_RETRY_COUNT: 0, TGC_REQUEST_TIMEOUT_MS: 25 }));
    const promise = client.get("/api/game/slow");
    const assertion = expect(promise).rejects.toMatchObject({
      code: "TIMEOUT",
      details: expect.objectContaining({
        timeoutMs: 25,
        method: "GET",
        path: "/api/game/slow",
        attempt: 1,
        attempts: 1,
        retryable: true,
      }),
    });
    await vi.runAllTimersAsync();

    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries transient HTTP status failures for GET requests", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 502, statusText: "Bad Gateway" }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: { ok: true } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv());
    const promise = client.get("/api/game/transient");
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns structured wing errors with diagnostics after retries are exhausted", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            error: {
              code: 503,
              message: "Overloaded",
              data: { queue: "busy" },
            },
          }),
          {
            status: 503,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv({ TGC_GET_RETRY_COUNT: 1 }));
    const promise = client.get("/api/game/retry-fail");
    const assertion = expect(promise).rejects.toMatchObject({
      code: "503",
      message: "Overloaded",
      details: expect.objectContaining({
        queue: "busy",
        status: 503,
        attempt: 2,
        attempts: 2,
        retryable: true,
        method: "GET",
        path: "/api/game/retry-fail",
      }),
    });
    await vi.runAllTimersAsync();

    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps invalid non-json responses as INVALID_RESPONSE for non-transient statuses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("<html>nope</html>", { status: 400, statusText: "Bad Request" }));
    vi.stubGlobal("fetch", fetchMock);

    const client = new TgcClient(createEnv());

    await expect(client.get("/api/game/bad")).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
      details: expect.objectContaining({
        status: 400,
        statusText: "Bad Request",
        attempt: 1,
        attempts: 3,
        retryable: false,
      }),
    });
  });

  it("preserves explicit network error typing", async () => {
    const error = new TgcApiError("NETWORK_ERROR", "Failed to reach The Game Crafter API.", { message: "boom" });
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.details).toEqual({ message: "boom" });
  });
});
