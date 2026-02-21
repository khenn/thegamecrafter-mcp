import type { EnvConfig } from "../config/env.js";
import { TgcApiError, TgcClient } from "./client.js";

export type ActiveSession = {
  id: string;
  userId: string;
};

export class TgcService {
  private readonly client: TgcClient;
  private readonly env: EnvConfig;
  private session: ActiveSession | null = null;

  public constructor(env: EnvConfig) {
    this.env = env;
    this.client = new TgcClient(env);
  }

  public getSession(): ActiveSession | null {
    return this.session;
  }

  public async login(input: { username?: string; password?: string; apiKeyId?: string }): Promise<ActiveSession> {
    const username = input.username ?? this.env.TGC_USERNAME;
    const password = input.password ?? this.env.TGC_PASSWORD;
    const apiKeyId = input.apiKeyId ?? this.env.TGC_API_KEY_ID;

    if (!username || !password || !apiKeyId) {
      throw new TgcApiError(
        "AUTH_INPUT_REQUIRED",
        "Login requires username, password, and apiKeyId (via args or environment).",
      );
    }

    const result = await this.client.post("/api/session", {
      form: { username, password, api_key_id: apiKeyId },
    });

    const sessionId = typeof result.id === "string" ? result.id : "";
    const userId = typeof result.user_id === "string" ? result.user_id : "";
    if (!sessionId || !userId) {
      throw new TgcApiError("INVALID_RESPONSE", "Session login response did not include expected ids.");
    }

    this.session = { id: sessionId, userId };
    return this.session;
  }

  public async logout(): Promise<boolean> {
    if (!this.session) {
      return false;
    }
    const current = this.session;
    await this.client.delete(`/api/session/${current.id}`);
    this.session = null;
    return true;
  }

  public async me(): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.get(`/api/user/${session.userId}`, { sessionId: session.id });
  }

  public async listDesigners(page: number, limit: number): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.get("/api/designer", {
      sessionId: session.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async getGame(
    gameId: string,
    include: string[] | undefined,
  ): Promise<Record<string, unknown>> {
    const session = this.getSession();
    const includeValue = include && include.length > 0 ? include.join(",") : undefined;
    return this.client.get(`/api/game/${gameId}`, {
      sessionId: session?.id,
      query: {
        _include_related_objects: includeValue,
      },
    });
  }

  private requireSession(): ActiveSession {
    if (!this.session) {
      throw new TgcApiError("NOT_AUTHENTICATED", "No active TGC session. Call tgc_auth_login first.");
    }
    return this.session;
  }
}

