import type { EnvConfig } from "../config/env.js";
import { TgcApiError, TgcClient } from "./client.js";
import { basename } from "node:path";
import { readFile } from "node:fs/promises";

export type ActiveSession = {
  id: string;
  userId: string;
};

type Primitive = string | number | boolean;
type BulkCardCreateInput = {
  name: string;
  face_id: string;
  back_id?: string;
  quantity?: number;
  class_number?: number;
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
    const apiKeyId = input.apiKeyId ?? this.env.TGC_PUBLIC_API_KEY_ID;

    if (!username || !password || !apiKeyId) {
      throw new TgcApiError(
        "AUTH_INPUT_REQUIRED",
        "Login requires username, password, and public api key id (apiKeyId or TGC_PUBLIC_API_KEY_ID).",
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
    return this.client.get(`/api/user/${session.userId}/designers`, {
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
    includeRelationships?: string[] | undefined,
  ): Promise<Record<string, unknown>> {
    const session = this.getSession();
    const includeValue = include && include.length > 0 ? include.join(",") : undefined;
    const includeRelationshipsValue =
      includeRelationships && includeRelationships.length > 0
        ? includeRelationships.join(",")
        : undefined;
    return this.client.get(`/api/game/${gameId}`, {
      sessionId: session?.id,
      query: {
        _include_related_objects: includeValue,
        _include_relationships: includeRelationshipsValue,
      },
    });
  }

  public async getDeck(deckId: string): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/deck/${deckId}`, { sessionId: session?.id });
  }

  public async listGameDecks(gameId: string, page: number, limit: number): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/game/${gameId}/decks`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async listDeckCards(deckId: string, page: number, limit: number): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/deck/${deckId}/cards`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async listGameGameparts(gameId: string, page: number, limit: number): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/game/${gameId}/gameparts`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async listGameComponents(
    gameId: string,
    relationship: string,
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>> {
    const session = this.getSession();
    const safeRelationship = normalizePathToken(relationship, "relationship");
    return this.client.get(`/api/game/${gameId}/${safeRelationship}`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async listComponentItems(
    componentType: string,
    componentId: string,
    relationship: string,
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>> {
    const session = this.getSession();
    const safeComponentType = normalizePathToken(componentType, "componentType");
    const safeRelationship = normalizePathToken(relationship, "relationship");
    return this.client.get(`/api/${safeComponentType}/${componentId}/${safeRelationship}`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async getCard(cardId: string): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/card/${cardId}`, { sessionId: session?.id });
  }

  public async getPart(partId: string): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/part/${partId}`, { sessionId: session?.id });
  }

  public async getFile(fileId: string): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/file/${fileId}`, { sessionId: session?.id });
  }

  public async getFileReferences(fileId: string, page: number, limit: number): Promise<Record<string, unknown>> {
    const session = this.getSession();
    return this.client.get(`/api/file/${fileId}/references`, {
      sessionId: session?.id,
      query: {
        _page_number: page,
        _items_per_page: limit,
      },
    });
  }

  public async listTgcProducts(activeOnly: boolean): Promise<Record<string, unknown>> {
    const session = this.getSession();
    const result = await this.client.get("/api/tgc/products", {
      sessionId: session?.id,
      query: {
        active_only: activeOnly ? 1 : 0,
      },
    });

    // Some TGC endpoints return the array directly in result, unlike typical { items, paging } format.
    if (Array.isArray(result)) {
      return { items: result, paging: {} };
    }

    const items =
      Array.isArray((result as Record<string, unknown>).items)
        ? ((result as Record<string, unknown>).items as unknown[])
        : [];
    const paging =
      (result as Record<string, unknown>).paging &&
      typeof (result as Record<string, unknown>).paging === "object"
        ? ((result as Record<string, unknown>).paging as Record<string, unknown>)
        : {};
    return { items, paging, raw: result };
  }

  public async listGames(input: {
    page: number;
    limit: number;
    designerId?: string;
    userId?: string;
  }): Promise<Record<string, unknown>> {
    const session = this.getSession();
    if (input.designerId) {
      return this.client.get(`/api/designer/${input.designerId}/games`, {
        sessionId: session?.id,
        query: {
          _page_number: input.page,
          _items_per_page: input.limit,
        },
      });
    }

    return this.client.get("/api/game", {
      sessionId: session?.id,
      query: {
        _page_number: input.page,
        _items_per_page: input.limit,
        designer_id: input.designerId,
        user_id: input.userId,
      },
    });
  }

  public async createGame(input: {
    name: string;
    designerId: string;
    description?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playTimeMinutes?: number;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const playTime = toPlayTimeBucket(input.playTimeMinutes);
    return this.client.post("/api/game", {
      sessionId: session.id,
      form: {
        name: input.name,
        designer_id: input.designerId,
        description: input.description,
        min_players: input.minPlayers,
        max_players: input.maxPlayers,
        play_time: playTime,
      },
    });
  }

  public async updateGame(gameId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const form = toGameUpdateForm(patch);
    return this.client.put(`/api/game/${gameId}`, {
      sessionId: session.id,
      form,
    });
  }

  public async createDeck(input: {
    gameId: string;
    name: string;
    identity: string;
    quantity?: number;
    backFileId?: string;
    hasProofedBack?: boolean;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post("/api/deck", {
      sessionId: session.id,
      form: {
        game_id: input.gameId,
        name: input.name,
        identity: input.identity,
        quantity: input.quantity,
        back_id: input.backFileId,
        has_proofed_back:
          input.hasProofedBack === undefined ? undefined : input.hasProofedBack ? 1 : 0,
      },
    });
  }

  public async createCard(input: {
    deckId: string;
    name: string;
    faceFileId: string;
    backFileId?: string;
    quantity?: number;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post("/api/card", {
      sessionId: session.id,
      form: {
        deck_id: input.deckId,
        name: input.name,
        face_id: input.faceFileId,
        back_id: input.backFileId,
        quantity: input.quantity,
      },
    });
  }

  public async bulkCreateCards(deckId: string, cards: BulkCardCreateInput[]): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post(`/api/deck/${deckId}/bulk-cards`, {
      sessionId: session.id,
      form: {
        cards: JSON.stringify(cards),
      },
    });
  }

  public async createPart(input: {
    gameId: string;
    name: string;
    quantity: number;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post("/api/part", {
      sessionId: session.id,
      form: {
        game_id: input.gameId,
        name: input.name,
        quantity: input.quantity,
      },
    });
  }

  public async upsertGamepart(input: {
    gameId: string;
    partId: string;
    componentType: string;
    componentId: string;
    quantity: number;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post("/api/gamepart", {
      sessionId: session.id,
      form: {
        game_id: input.gameId,
        part_id: input.partId,
        component_type: input.componentType,
        component_id: input.componentId,
        quantity: input.quantity,
      },
    });
  }

  public async createComponent(input: {
    componentType: string;
    gameId: string;
    name: string;
    identity?: string;
    quantity?: number;
    backFileId?: string;
    faceFileId?: string;
    frontFileId?: string;
    outsideFileId?: string;
    insideFileId?: string;
    innerFileId?: string;
    topFileId?: string;
    bottomFileId?: string;
    spotGlossFileId?: string;
    spotGlossBottomFileId?: string;
    dieColor?: string;
    side1FileId?: string;
    side2FileId?: string;
    side3FileId?: string;
    side4FileId?: string;
    side5FileId?: string;
    side6FileId?: string;
    side7FileId?: string;
    side8FileId?: string;
    hasProofedFace?: boolean;
    hasProofedBack?: boolean;
    hasProofedOutside?: boolean;
    hasProofedInside?: boolean;
    hasProofedTop?: boolean;
    hasProofedBottom?: boolean;
    hasProofedSpotGloss?: boolean;
    hasProofedSpotGlossBottom?: boolean;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const safeComponentType = normalizePathToken(input.componentType, "componentType");
    return this.client.post(`/api/${safeComponentType}`, {
      sessionId: session.id,
      form: {
        game_id: input.gameId,
        name: input.name,
        identity: input.identity,
        quantity: input.quantity,
        back_id: input.backFileId,
        face_id: input.faceFileId,
        front_id: input.frontFileId,
        outside_id: input.outsideFileId,
        inside_id: input.insideFileId,
        inner_id: input.innerFileId,
        top_id: input.topFileId,
        bottom_id: input.bottomFileId,
        spot_gloss_id: input.spotGlossFileId,
        spot_gloss_bottom_id: input.spotGlossBottomFileId,
        diecolor: input.dieColor,
        side1_id: input.side1FileId,
        side2_id: input.side2FileId,
        side3_id: input.side3FileId,
        side4_id: input.side4FileId,
        side5_id: input.side5FileId,
        side6_id: input.side6FileId,
        side7_id: input.side7FileId,
        side8_id: input.side8FileId,
        has_proofed_face:
          input.hasProofedFace === undefined ? undefined : input.hasProofedFace ? 1 : 0,
        has_proofed_back:
          input.hasProofedBack === undefined ? undefined : input.hasProofedBack ? 1 : 0,
        has_proofed_outside:
          input.hasProofedOutside === undefined ? undefined : input.hasProofedOutside ? 1 : 0,
        has_proofed_inside:
          input.hasProofedInside === undefined ? undefined : input.hasProofedInside ? 1 : 0,
        has_proofed_top:
          input.hasProofedTop === undefined ? undefined : input.hasProofedTop ? 1 : 0,
        has_proofed_bottom:
          input.hasProofedBottom === undefined ? undefined : input.hasProofedBottom ? 1 : 0,
        has_proofed_spot_gloss:
          input.hasProofedSpotGloss === undefined ? undefined : input.hasProofedSpotGloss ? 1 : 0,
        has_proofed_spot_gloss_bottom:
          input.hasProofedSpotGlossBottom === undefined
            ? undefined
            : input.hasProofedSpotGlossBottom
              ? 1
              : 0,
      },
    });
  }

  public async updateComponent(input: {
    componentType: string;
    componentId: string;
    name?: string;
    identity?: string;
    quantity?: number;
    backFileId?: string;
    faceFileId?: string;
    frontFileId?: string;
    outsideFileId?: string;
    insideFileId?: string;
    innerFileId?: string;
    topFileId?: string;
    bottomFileId?: string;
    spotGlossFileId?: string;
    spotGlossBottomFileId?: string;
    dieColor?: string;
    side1FileId?: string;
    side2FileId?: string;
    side3FileId?: string;
    side4FileId?: string;
    side5FileId?: string;
    side6FileId?: string;
    side7FileId?: string;
    side8FileId?: string;
    hasProofedFace?: boolean;
    hasProofedBack?: boolean;
    hasProofedOutside?: boolean;
    hasProofedInside?: boolean;
    hasProofedTop?: boolean;
    hasProofedBottom?: boolean;
    hasProofedSpotGloss?: boolean;
    hasProofedSpotGlossBottom?: boolean;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const safeComponentType = normalizePathToken(input.componentType, "componentType");
    return this.client.put(`/api/${safeComponentType}/${input.componentId}`, {
      sessionId: session.id,
      form: {
        name: input.name,
        identity: input.identity,
        quantity: input.quantity,
        back_id: input.backFileId,
        face_id: input.faceFileId,
        front_id: input.frontFileId,
        outside_id: input.outsideFileId,
        inside_id: input.insideFileId,
        inner_id: input.innerFileId,
        top_id: input.topFileId,
        bottom_id: input.bottomFileId,
        spot_gloss_id: input.spotGlossFileId,
        spot_gloss_bottom_id: input.spotGlossBottomFileId,
        diecolor: input.dieColor,
        side1_id: input.side1FileId,
        side2_id: input.side2FileId,
        side3_id: input.side3FileId,
        side4_id: input.side4FileId,
        side5_id: input.side5FileId,
        side6_id: input.side6FileId,
        side7_id: input.side7FileId,
        side8_id: input.side8FileId,
        has_proofed_face:
          input.hasProofedFace === undefined ? undefined : input.hasProofedFace ? 1 : 0,
        has_proofed_back:
          input.hasProofedBack === undefined ? undefined : input.hasProofedBack ? 1 : 0,
        has_proofed_outside:
          input.hasProofedOutside === undefined ? undefined : input.hasProofedOutside ? 1 : 0,
        has_proofed_inside:
          input.hasProofedInside === undefined ? undefined : input.hasProofedInside ? 1 : 0,
        has_proofed_top:
          input.hasProofedTop === undefined ? undefined : input.hasProofedTop ? 1 : 0,
        has_proofed_bottom:
          input.hasProofedBottom === undefined ? undefined : input.hasProofedBottom ? 1 : 0,
        has_proofed_spot_gloss:
          input.hasProofedSpotGloss === undefined ? undefined : input.hasProofedSpotGloss ? 1 : 0,
        has_proofed_spot_gloss_bottom:
          input.hasProofedSpotGlossBottom === undefined
            ? undefined
            : input.hasProofedSpotGlossBottom
              ? 1
              : 0,
      },
    });
  }

  public async createFolder(input: { name: string; parentFolderId?: string }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    return this.client.post("/api/folder", {
      sessionId: session.id,
      form: {
        name: input.name,
        parent_id: input.parentFolderId,
      },
    });
  }

  public async uploadFile(input: {
    path: string;
    folderId?: string;
    name?: string;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const fileBuffer = await readFile(input.path);
    const fileBaseName = basename(input.path);
    const logicalName = input.name ?? fileBaseName;

    return this.client.post("/api/file", {
      sessionId: session.id,
      form: {
        name: logicalName,
        folder_id: input.folderId,
        file: {
          blob: new Blob([fileBuffer]),
          filename: fileBaseName,
        },
      },
    });
  }

  public async createComponentItem(input: {
    componentType: string;
    setId: string;
    name: string;
    frontFileId: string;
    backFileId?: string;
    innerFileId?: string;
    quantity?: number;
    hasProofedFace?: boolean;
    hasProofedBack?: boolean;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const safeComponentType = normalizePathToken(input.componentType, "componentType");
    return this.client.post(`/api/${safeComponentType}`, {
      sessionId: session.id,
      form: {
        set_id: input.setId,
        name: input.name,
        face_id: input.frontFileId,
        back_id: input.backFileId,
        inner_id: input.innerFileId,
        quantity: input.quantity,
        has_proofed_face:
          input.hasProofedFace === undefined ? undefined : input.hasProofedFace ? 1 : 0,
        has_proofed_back:
          input.hasProofedBack === undefined ? undefined : input.hasProofedBack ? 1 : 0,
      },
    });
  }

  public async createComponentPage(input: {
    componentType: string;
    parentId: string;
    name: string;
    frontFileId: string;
    backFileId?: string;
    quantity?: number;
    sequenceNumber?: number;
  }): Promise<Record<string, unknown>> {
    const session = this.requireSession();
    const safeComponentType = normalizePathToken(input.componentType, "componentType");
    const parentField =
      safeComponentType === "bookletpage"
        ? "booklet_id"
        : safeComponentType === "coilbookpage" || safeComponentType === "perfectboundbookpage"
          ? "book_id"
          : null;
    if (!parentField) {
      throw new TgcApiError(
        "INVALID_INPUT",
        "componentType must be one of: bookletpage, coilbookpage, perfectboundbookpage.",
      );
    }

    return this.client.post(`/api/${safeComponentType}`, {
      sessionId: session.id,
      form: {
        [parentField]: input.parentId,
        name: input.name,
        image_id: input.frontFileId,
        back_id: input.backFileId,
        quantity: input.quantity,
        sequence_number: input.sequenceNumber,
      },
    });
  }

  public async deleteGame(gameId: string): Promise<boolean> {
    const session = this.requireSession();
    await this.client.delete(`/api/game/${gameId}`, { sessionId: session.id });
    return true;
  }

  public async publishGame(gameId: string): Promise<boolean> {
    const session = this.requireSession();
    await this.client.post(`/api/game/${gameId}/public`, { sessionId: session.id, form: {} });
    return true;
  }

  public async unpublishGame(gameId: string): Promise<boolean> {
    const session = this.requireSession();
    await this.client.delete(`/api/game/${gameId}/public`, { sessionId: session.id });
    return true;
  }

  private requireSession(): ActiveSession {
    if (!this.session) {
      throw new TgcApiError("NOT_AUTHENTICATED", "No active TGC session. Call tgc_auth_login first.");
    }
    return this.session;
  }
}

function toPlayTimeBucket(minutes: number | undefined): string | undefined {
  if (minutes === undefined) {
    return undefined;
  }
  if (minutes < 30) {
    return "<30";
  }
  if (minutes <= 60) {
    return "30-60";
  }
  if (minutes <= 90) {
    return "60-90";
  }
  if (minutes <= 120) {
    return "90-120";
  }
  return ">120";
}

function toGameUpdateForm(patch: Record<string, unknown>): Record<string, Primitive | undefined> {
  const mapped: Record<string, Primitive | undefined> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (!isPrimitive(value)) {
      continue;
    }
    const tgcKey = GAME_PATCH_KEY_MAP[key] ?? key;
    mapped[tgcKey] = value;
  }
  return mapped;
}

function isPrimitive(value: unknown): value is Primitive {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

const GAME_PATCH_KEY_MAP: Record<string, string> = {
  minPlayers: "min_players",
  maxPlayers: "max_players",
  playTime: "play_time",
  minAge: "min_age",
  shortDescription: "short_description",
  privateViewing: "private_viewing",
  privateSales: "private_sales",
  digitalDelivery: "digital_delivery",
  useAutomaticPricing: "use_automatic_pricing",
  enableUvCoating: "enable_uv_coating",
  enableLinenTexture: "enable_linen_texture",
};

function normalizePathToken(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new TgcApiError("INVALID_INPUT", `${fieldName} is required.`);
  }
  if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
    throw new TgcApiError("INVALID_INPUT", `${fieldName} contains unsupported characters.`);
  }
  return trimmed;
}
