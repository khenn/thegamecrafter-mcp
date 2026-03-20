import { describe, expect, it, vi } from "vitest";
import { TgcApiError } from "../tgc/client.js";
import { executeTool } from "./handlers.js";

type MockTgc = {
  login: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
  me: ReturnType<typeof vi.fn>;
  listDesigners: ReturnType<typeof vi.fn>;
  getGame: ReturnType<typeof vi.fn>;
  getDeck: ReturnType<typeof vi.fn>;
  listGameDecks: ReturnType<typeof vi.fn>;
  listDeckCards: ReturnType<typeof vi.fn>;
  listGameGameparts: ReturnType<typeof vi.fn>;
  listGameComponents: ReturnType<typeof vi.fn>;
  listComponentItems: ReturnType<typeof vi.fn>;
  getCard: ReturnType<typeof vi.fn>;
  getPart: ReturnType<typeof vi.fn>;
  getFile: ReturnType<typeof vi.fn>;
  getFileReferences: ReturnType<typeof vi.fn>;
  listTgcProducts: ReturnType<typeof vi.fn>;
  listGames: ReturnType<typeof vi.fn>;
  createGame: ReturnType<typeof vi.fn>;
  updateGame: ReturnType<typeof vi.fn>;
  copyGame: ReturnType<typeof vi.fn>;
  deleteGame: ReturnType<typeof vi.fn>;
  publishGame: ReturnType<typeof vi.fn>;
  unpublishGame: ReturnType<typeof vi.fn>;
  createDeck: ReturnType<typeof vi.fn>;
  createCard: ReturnType<typeof vi.fn>;
  bulkCreateCards: ReturnType<typeof vi.fn>;
  createPart: ReturnType<typeof vi.fn>;
  upsertGamepart: ReturnType<typeof vi.fn>;
  createComponent: ReturnType<typeof vi.fn>;
  updateComponent: ReturnType<typeof vi.fn>;
  createComponentItem: ReturnType<typeof vi.fn>;
  createComponentPage: ReturnType<typeof vi.fn>;
  createFolder: ReturnType<typeof vi.fn>;
  uploadFile: ReturnType<typeof vi.fn>;
  createGameDownload: ReturnType<typeof vi.fn>;
  getGameBulkPricing: ReturnType<typeof vi.fn>;
  getGameCostBreakdown: ReturnType<typeof vi.fn>;
};

function createMockTgc(): MockTgc {
  return {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    listDesigners: vi.fn(),
    getGame: vi.fn(),
    getDeck: vi.fn(),
    listGameDecks: vi.fn(),
    listDeckCards: vi.fn(),
    listGameGameparts: vi.fn(),
    listGameComponents: vi.fn(),
    listComponentItems: vi.fn(),
    getCard: vi.fn(),
    getPart: vi.fn(),
    getFile: vi.fn(),
    getFileReferences: vi.fn(),
    listTgcProducts: vi.fn(),
    listGames: vi.fn(),
    createGame: vi.fn(),
    updateGame: vi.fn(),
    copyGame: vi.fn(),
    deleteGame: vi.fn(),
    publishGame: vi.fn(),
    unpublishGame: vi.fn(),
    createDeck: vi.fn(),
    createCard: vi.fn(),
    bulkCreateCards: vi.fn(),
    createPart: vi.fn(),
    upsertGamepart: vi.fn(),
    createComponent: vi.fn(),
    updateComponent: vi.fn(),
    createComponentItem: vi.fn(),
    createComponentPage: vi.fn(),
    createFolder: vi.fn(),
    uploadFile: vi.fn(),
    createGameDownload: vi.fn(),
    getGameBulkPricing: vi.fn(),
    getGameCostBreakdown: vi.fn(),
  };
}

function createContext(tgc: MockTgc) {
  return { tgc } as never;
}

describe("executeTool", () => {
  it("rejects unknown tools before touching the runtime", async () => {
    const tgc = createMockTgc();
    const result = await executeTool("tgc_nope", {}, createContext(tgc));

    expect(result).toEqual({
      ok: false,
      data: null,
      error: {
        code: "TOOL_NOT_FOUND",
        message: "Unknown tool: tgc_nope",
        details: null,
      },
    });
  });

  it("routes tgc_auth_login and returns the public session envelope", async () => {
    const tgc = createMockTgc();
    tgc.login.mockResolvedValue({ id: "session-1", userId: "user-1" });

    const result = await executeTool(
      "tgc_auth_login",
      { username: "u", password: "p", apiKeyId: "k" },
      createContext(tgc),
    );

    expect(tgc.login).toHaveBeenCalledWith({ username: "u", password: "p", apiKeyId: "k" });
    expect(result).toEqual({
      ok: true,
      data: { sessionId: "session-1", userId: "user-1" },
      error: null,
    });
  });

  it("routes tgc_auth_logout", async () => {
    const tgc = createMockTgc();
    tgc.logout.mockResolvedValue(true);

    const result = await executeTool("tgc_auth_logout", {}, createContext(tgc));

    expect(tgc.logout).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      data: { loggedOut: true },
      error: null,
    });
  });

  it("routes tgc_me", async () => {
    const tgc = createMockTgc();
    tgc.me.mockResolvedValue({ id: "user-1", name: "Test User" });

    const result = await executeTool("tgc_me", {}, createContext(tgc));

    expect(tgc.me).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      ok: true,
      data: { user: { id: "user-1", name: "Test User" } },
      error: null,
    });
  });

  it("applies defaults and normalizes paging for tgc_designer_list", async () => {
    const tgc = createMockTgc();
    tgc.listDesigners.mockResolvedValue({
      items: [{ id: "designer-1" }],
      paging: { page_number: "1", items_per_page: "20" },
    });

    const result = await executeTool("tgc_designer_list", {}, createContext(tgc));

    expect(tgc.listDesigners).toHaveBeenCalledWith(1, 20);
    expect(result).toEqual({
      ok: true,
      data: {
        items: [{ id: "designer-1" }],
        page: 1,
        limit: 20,
        raw: {
          items: [{ id: "designer-1" }],
          paging: { page_number: "1", items_per_page: "20" },
        },
      },
      error: null,
    });
  });

  it("returns INVALID_INPUT for schema validation failures", async () => {
    const tgc = createMockTgc();

    const result = await executeTool("tgc_designer_list", { page: 0 }, createContext(tgc));

    expect(tgc.listDesigners).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error?.code).toBe("INVALID_INPUT");
    expect(result.error?.message).toBe("Tool input failed schema validation.");
    expect(result.error?.details).toEqual({
      issues: [{ path: "page", message: "Number must be greater than or equal to 1" }],
    });
  });

  it("routes tgc_game_list and preserves normalized paging", async () => {
    const tgc = createMockTgc();
    tgc.listGames.mockResolvedValue({
      items: [{ id: "game-1" }],
      paging: { page_number: 2, items_per_page: 5 },
    });

    const result = await executeTool(
      "tgc_game_list",
      { page: 2, limit: 5, designerId: "designer-1" },
      createContext(tgc),
    );

    expect(tgc.listGames).toHaveBeenCalledWith({ page: 2, limit: 5, designerId: "designer-1" });
    expect(result).toEqual({
      ok: true,
      data: {
        items: [{ id: "game-1" }],
        page: 2,
        limit: 5,
        raw: {
          items: [{ id: "game-1" }],
          paging: { page_number: 2, items_per_page: 5 },
        },
      },
      error: null,
    });
  });

  it("routes tgc_game_create", async () => {
    const tgc = createMockTgc();
    tgc.createGame.mockResolvedValue({ id: "game-1", name: "Prototype" });

    const result = await executeTool(
      "tgc_game_create",
      { name: "Prototype", designerId: "designer-1", minPlayers: 1, maxPlayers: 4 },
      createContext(tgc),
    );

    expect(tgc.createGame).toHaveBeenCalledWith({
      name: "Prototype",
      designerId: "designer-1",
      minPlayers: 1,
      maxPlayers: 4,
    });
    expect(result).toEqual({
      ok: true,
      data: { game: { id: "game-1", name: "Prototype" } },
      error: null,
    });
  });

  it("routes tgc_game_get", async () => {
    const tgc = createMockTgc();
    tgc.getGame.mockResolvedValue({ id: "game-1" });

    const result = await executeTool(
      "tgc_game_get",
      { gameId: "game-1", include: ["designer"], includeRelationships: ["decks"] },
      createContext(tgc),
    );

    expect(tgc.getGame).toHaveBeenCalledWith("game-1", ["designer"], ["decks"]);
    expect(result).toEqual({
      ok: true,
      data: { game: { id: "game-1" } },
      error: null,
    });
  });

  it("routes tgc_game_update", async () => {
    const tgc = createMockTgc();
    tgc.updateGame.mockResolvedValue({ id: "game-1", archived: false });

    const result = await executeTool(
      "tgc_game_update",
      { gameId: "game-1", patch: { archived: false } },
      createContext(tgc),
    );

    expect(tgc.updateGame).toHaveBeenCalledWith("game-1", { archived: false });
    expect(result).toEqual({
      ok: true,
      data: { game: { id: "game-1", archived: false } },
      error: null,
    });
  });

  it("routes tgc_game_copy", async () => {
    const tgc = createMockTgc();
    tgc.copyGame.mockResolvedValue({ id: "game-copy-1", name: "Copied Game" });

    const result = await executeTool(
      "tgc_game_copy",
      { gameId: "game-1", name: "Copied Game" },
      createContext(tgc),
    );

    expect(tgc.copyGame).toHaveBeenCalledWith("game-1", "Copied Game");
    expect(result).toEqual({
      ok: true,
      data: { game: { id: "game-copy-1", name: "Copied Game" } },
      error: null,
    });
  });

  it("routes tgc_game_delete, publish, and unpublish", async () => {
    const tgc = createMockTgc();
    tgc.deleteGame.mockResolvedValue(true);
    tgc.publishGame.mockResolvedValue(true);
    tgc.unpublishGame.mockResolvedValue(true);

    const deleted = await executeTool("tgc_game_delete", { gameId: "game-1" }, createContext(tgc));
    const published = await executeTool("tgc_game_publish", { gameId: "game-1" }, createContext(tgc));
    const unpublished = await executeTool("tgc_game_unpublish", { gameId: "game-1" }, createContext(tgc));

    expect(tgc.deleteGame).toHaveBeenCalledWith("game-1");
    expect(tgc.publishGame).toHaveBeenCalledWith("game-1");
    expect(tgc.unpublishGame).toHaveBeenCalledWith("game-1");
    expect(deleted.data).toEqual({ deleted: true });
    expect(published.data).toEqual({ published: true });
    expect(unpublished.data).toEqual({ unpublished: true });
  });

  it("reads and updates surfacing settings", async () => {
    const tgc = createMockTgc();
    tgc.getGame.mockResolvedValue({ enable_uv_coating: "1", enable_linen_texture: 0 });
    tgc.updateGame.mockResolvedValue({ enable_uv_coating: false, enable_linen_texture: true });

    const readResult = await executeTool("tgc_game_surfacing_get", { gameId: "game-1" }, createContext(tgc));
    const writeResult = await executeTool(
      "tgc_game_surfacing_set",
      { gameId: "game-1", enableLinenTexture: true },
      createContext(tgc),
    );

    expect(tgc.getGame).toHaveBeenCalledWith("game-1", undefined, undefined);
    expect(tgc.updateGame).toHaveBeenCalledWith("game-1", { enableLinenTexture: true });
    expect(readResult.data).toMatchObject({
      gameId: "game-1",
      surfacing: { enableUvCoating: true, enableLinenTexture: false },
    });
    expect(writeResult.data).toEqual({
      gameId: "game-1",
      surfacing: { enableUvCoating: false, enableLinenTexture: true },
      updated: { enableUvCoating: undefined, enableLinenTexture: true },
    });
  });

  it("rejects surfacing updates with no selected setting", async () => {
    const tgc = createMockTgc();
    const result = await executeTool("tgc_game_surfacing_set", { gameId: "game-1" }, createContext(tgc));

    expect(tgc.updateGame).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: "Provide at least one setting: enableUvCoating and/or enableLinenTexture.",
        details: {
          prompt:
            "Please choose one or both options: enableUvCoating (true/false), enableLinenTexture (true/false).",
        },
      },
    });
  });

  it("summarizes game test reports", async () => {
    const tgc = createMockTgc();
    tgc.listGameComponents
      .mockResolvedValueOnce({ items: [{ id: "s1" }, { id: "s2" }] })
      .mockResolvedValueOnce({ items: [{ id: "a1" }] })
      .mockResolvedValueOnce({ items: [] });

    const result = await executeTool(
      "tgc_game_test_reports_get",
      { gameId: "game-1", limitPerType: 10 },
      createContext(tgc),
    );

    expect(tgc.listGameComponents).toHaveBeenNthCalledWith(1, "game-1", "sanitytests", 1, 10);
    expect(tgc.listGameComponents).toHaveBeenNthCalledWith(2, "game-1", "arttests", 1, 10);
    expect(tgc.listGameComponents).toHaveBeenNthCalledWith(3, "game-1", "cvtests", 1, 10);
    expect(result.data).toEqual({
      gameId: "game-1",
      reports: {
        sanitytests: { count: 2, items: [{ id: "s1" }, { id: "s2" }] },
        arttests: { count: 1, items: [{ id: "a1" }] },
        cvtests: { count: 0, items: [] },
      },
      interpreted: {
        summary: "Found 2 sanitytest, 1 arttest, and 0 cvtest record(s).",
        status: "tests_present",
        recommendations: [
          "Review each test record for failed/warning states in TGC.",
          "Re-run tests after major component or artwork changes.",
        ],
      },
    });
  });

  it("computes readiness blockers and warnings", async () => {
    const tgc = createMockTgc();
    tgc.getGame.mockResolvedValue({ archived: "yes" });
    tgc.listGameGameparts.mockResolvedValue({ items: [] });
    tgc.listGameComponents.mockResolvedValue({ items: [] });

    const result = await executeTool("tgc_make_readiness_check", { gameId: "game-1" }, createContext(tgc));

    expect(result.data).toEqual({
      gameId: "game-1",
      readiness: "blocked",
      blockers: [
        "Game has no linked parts/components. Prototype order is not meaningful until components are added.",
      ],
      warnings: [
        "Game is archived. You can still edit, but this can hide it in list workflows.",
        "No sanity test records were found.",
        "No art test records were found.",
        "No CV test records were found.",
      ],
      suggestions: [
        "Add at least one component and link quantities before ordering.",
        "Set archived=false in Organization if this is an active prototype.",
        "Run sanity tests in TGC Test tab and resolve any failures.",
        "Run art tests in TGC Test tab to catch image/print issues.",
        "Run CV tests in TGC Test tab before ordering prototypes.",
      ],
      signals: {
        gamepartsCount: 0,
        unproofedGamepartsCount: 0,
        testReports: {
          sanitytests: 0,
          arttests: 0,
          cvtests: 0,
        },
      },
    });
  });

  it("covers deck/card read and write flows", async () => {
    const tgc = createMockTgc();
    tgc.getDeck.mockResolvedValue({ id: "deck-1" });
    tgc.listGameDecks.mockResolvedValue({ items: [{ id: "deck-1" }], paging: { page_number: 1, items_per_page: 20 } });
    tgc.listDeckCards.mockResolvedValue({ items: [{ id: "card-1" }], paging: { page_number: 1, items_per_page: 20 } });
    tgc.getCard.mockResolvedValue({ id: "card-1" });
    tgc.createDeck.mockResolvedValue({ id: "deck-2" });
    tgc.createCard.mockResolvedValue({ id: "card-2" });
    tgc.bulkCreateCards.mockResolvedValue({ cards: [{ id: "card-3" }, { id: "card-4" }] });

    const deckGet = await executeTool("tgc_deck_get", { deckId: "deck-1" }, createContext(tgc));
    const decksList = await executeTool("tgc_game_decks_list", { gameId: "game-1" }, createContext(tgc));
    const cardsList = await executeTool("tgc_deck_cards_list", { deckId: "deck-1" }, createContext(tgc));
    const cardGet = await executeTool("tgc_card_get", { cardId: "card-1" }, createContext(tgc));
    const deckCreate = await executeTool(
      "tgc_deck_create",
      { gameId: "game-1", name: "Deck", cardCount: 18, backFileId: "file-back" },
      createContext(tgc),
    );
    const cardCreate = await executeTool(
      "tgc_card_create",
      { deckId: "deck-1", name: "Card", frontFileId: "file-front", quantity: 2 },
      createContext(tgc),
    );
    const bulkCreate = await executeTool(
      "tgc_deck_bulk_create_cards",
      {
        deckId: "deck-1",
        cards: [
          { name: "Alpha", frontFileId: "face-a", classNumber: 1 },
          { name: "Beta", face_id: "face-b", back_id: "back-b", class_number: 2 },
        ],
      },
      createContext(tgc),
    );

    expect(tgc.createDeck).toHaveBeenCalledWith({
      gameId: "game-1",
      name: "Deck",
      identity: "PokerDeck",
      quantity: 18,
      backFileId: "file-back",
      hasProofedBack: undefined,
    });
    expect(tgc.createCard).toHaveBeenCalledWith({
      deckId: "deck-1",
      name: "Card",
      faceFileId: "file-front",
      backFileId: undefined,
      quantity: 2,
    });
    expect(tgc.bulkCreateCards).toHaveBeenCalledWith("deck-1", [
      { name: "Alpha", face_id: "face-a", back_id: undefined, quantity: undefined, class_number: 1 },
      { name: "Beta", face_id: "face-b", back_id: "back-b", quantity: undefined, class_number: 2 },
    ]);
    expect(deckGet.data).toEqual({ deck: { id: "deck-1" } });
    expect(decksList.data).toMatchObject({ items: [{ id: "deck-1" }], page: 1, limit: 20 });
    expect(cardsList.data).toMatchObject({ items: [{ id: "card-1" }], page: 1, limit: 20 });
    expect(cardGet.data).toEqual({ card: { id: "card-1" } });
    expect(deckCreate.data).toEqual({ deck: { id: "deck-2" }, resumed: false });
    expect(cardCreate.data).toEqual({ card: { id: "card-2" } });
    expect(bulkCreate.data).toEqual({
      requestedCount: 2,
      createdCount: 2,
      skippedExistingCount: 0,
      resumed: false,
      cards: [{ id: "card-3" }, { id: "card-4" }],
      raw: { cards: [{ id: "card-3" }, { id: "card-4" }] },
    });
  });

  it("resumes deck creation when an exact deck match already exists", async () => {
    const tgc = createMockTgc();
    tgc.listGameDecks.mockResolvedValue({
      items: [
        {
          id: "deck-existing",
          name: "Deck",
          identity: "PokerDeck",
          quantity: 18,
          back_id: "file-back",
          has_proofed_back: 1,
        },
      ],
      paging: { page_number: 1, items_per_page: 100 },
    });

    const result = await executeTool(
      "tgc_deck_create",
      {
        gameId: "game-1",
        name: "Deck",
        identity: "PokerDeck",
        cardCount: 18,
        backFileId: "file-back",
        hasProofedBack: true,
        resumeIfExists: true,
      },
      createContext(tgc),
    );

    expect(tgc.createDeck).not.toHaveBeenCalled();
    expect(result.data).toEqual({
      deck: {
        id: "deck-existing",
        name: "Deck",
        identity: "PokerDeck",
        quantity: 18,
        back_id: "file-back",
        has_proofed_back: 1,
      },
      resumed: true,
    });
  });

  it("skips already-existing cards when skipExisting is enabled", async () => {
    const tgc = createMockTgc();
    tgc.listDeckCards.mockResolvedValue({
      items: [
        {
          id: "card-existing",
          name: "Alpha",
          face_id: "face-a",
          back_id: "back-a",
          quantity: 1,
          class_number: 2,
        },
      ],
      paging: { page_number: 1, items_per_page: 100 },
    });
    tgc.bulkCreateCards.mockResolvedValue({ cards: [{ id: "card-new" }] });

    const result = await executeTool(
      "tgc_deck_bulk_create_cards",
      {
        deckId: "deck-1",
        skipExisting: true,
        cards: [
          { name: "Alpha", frontFileId: "face-a", backFileId: "back-a", quantity: 1, classNumber: 2 },
          { name: "Beta", frontFileId: "face-b" },
        ],
      },
      createContext(tgc),
    );

    expect(tgc.bulkCreateCards).toHaveBeenCalledWith("deck-1", [
      { name: "Beta", face_id: "face-b", back_id: undefined, quantity: undefined, class_number: undefined },
    ]);
    expect(result.data).toEqual({
      requestedCount: 2,
      createdCount: 1,
      skippedExistingCount: 1,
      resumed: true,
      cards: [{ id: "card-new" }],
      raw: { cards: [{ id: "card-new" }] },
    });
  });

  it("returns cleanly when all requested bulk cards already exist", async () => {
    const tgc = createMockTgc();
    tgc.listDeckCards.mockResolvedValue({
      items: [{ name: "Alpha", face_id: "face-a" }],
      paging: { page_number: 1, items_per_page: 100 },
    });

    const result = await executeTool(
      "tgc_deck_bulk_create_cards",
      {
        deckId: "deck-1",
        skipExisting: true,
        cards: [{ name: "Alpha", frontFileId: "face-a" }],
      },
      createContext(tgc),
    );

    expect(tgc.bulkCreateCards).not.toHaveBeenCalled();
    expect(result.data).toEqual({
      requestedCount: 1,
      createdCount: 0,
      skippedExistingCount: 1,
      resumed: true,
      cards: [],
      raw: null,
    });
  });

  it("covers parts, gameparts, pricing, and cost breakdown flows", async () => {
    const tgc = createMockTgc();
    tgc.listGameGameparts.mockResolvedValue({ items: [{ id: "gp-1" }], paging: { page_number: 1, items_per_page: 20 } });
    tgc.getPart.mockResolvedValue({ id: "part-1" });
    tgc.createPart.mockResolvedValue({ id: "part-2" });
    tgc.upsertGamepart.mockResolvedValue({ id: "gp-2" });
    tgc.getGameBulkPricing
      .mockResolvedValueOnce({ total: 10 })
      .mockRejectedValueOnce(new TgcApiError("API_ERROR", "Pricing failed.", { apiKey: "secret", note: "kept" }));
    tgc.getGameCostBreakdown.mockResolvedValue({ gameledgerentries: [{ id: "gle-1" }], total: 42 });

    const listResult = await executeTool("tgc_game_gameparts_list", { gameId: "game-1" }, createContext(tgc));
    const partGet = await executeTool("tgc_part_get", { partId: "part-1" }, createContext(tgc));
    const partCreate = await executeTool(
      "tgc_part_create",
      { gameId: "game-1", name: "Token", quantity: 4 },
      createContext(tgc),
    );
    const upsert = await executeTool(
      "tgc_gamepart_upsert",
      { gameId: "game-1", partId: "part-1", componentType: "deck", componentId: "deck-1", quantity: 2 },
      createContext(tgc),
    );
    const pricing = await executeTool(
      "tgc_game_bulk_pricing_get",
      { gameIds: ["game-1", "game-2"] },
      createContext(tgc),
    );
    const cost = await executeTool("tgc_game_cost_breakdown_get", { gameId: "game-1" }, createContext(tgc));

    expect(listResult.data).toMatchObject({ items: [{ id: "gp-1" }], page: 1, limit: 20 });
    expect(partGet.data).toEqual({ part: { id: "part-1" } });
    expect(partCreate.data).toEqual({ part: { id: "part-2" } });
    expect(upsert.data).toEqual({ gamePart: { id: "gp-2" } });
    expect(pricing.data).toEqual({
      requested: 2,
      successCount: 1,
      errorCount: 1,
      pricing: [{ gameId: "game-1", pricing: { total: 10 } }],
      errors: [
        {
          gameId: "game-2",
          code: "API_ERROR",
          message: "Pricing failed.",
          details: { apiKey: "[REDACTED]", note: "kept" },
        },
      ],
    });
    expect(cost.data).toEqual({
      gameId: "game-1",
      items: [{ id: "gle-1" }],
      total: 42,
      raw: { gameledgerentries: [{ id: "gle-1" }], total: 42 },
    });
  });

  it("covers component list and create/update flows including custom dice guardrails", async () => {
    const tgc = createMockTgc();
    tgc.listGameComponents.mockResolvedValue({ items: [{ id: "component-1" }], paging: { page_number: 1, items_per_page: 20 } });
    tgc.listComponentItems.mockResolvedValue({ items: [{ id: "item-1" }], paging: { page_number: 1, items_per_page: 20 } });
    tgc.createComponent.mockResolvedValue({ id: "component-2" });
    tgc.updateComponent.mockResolvedValue({ id: "component-3" });
    tgc.createComponentItem.mockResolvedValue({ id: "item-2" });
    tgc.createComponentPage.mockResolvedValue({ id: "page-1" });

    const list = await executeTool(
      "tgc_game_components_list",
      { gameId: "game-1", relationship: "tuckboxes" },
      createContext(tgc),
    );
    const items = await executeTool(
      "tgc_component_items_list",
      { componentType: "twosidedset", componentId: "set-1", relationship: "twosideds" },
      createContext(tgc),
    );
    const create = await executeTool(
      "tgc_component_create",
      {
        componentType: "customcolord6",
        gameId: "game-1",
        name: "Die",
        side1FileId: "1",
        side2FileId: "2",
        side3FileId: "3",
        side4FileId: "4",
        side5FileId: "5",
        side6FileId: "6",
      },
      createContext(tgc),
    );
    const update = await executeTool(
      "tgc_component_update",
      { componentType: "tuckbox", componentId: "component-1", diecolor: "red" },
      createContext(tgc),
    );
    const itemCreate = await executeTool(
      "tgc_component_item_create",
      { componentType: "twosided", setId: "set-1", name: "Card Face", frontFileId: "face-1" },
      createContext(tgc),
    );
    const pageCreate = await executeTool(
      "tgc_component_page_create",
      { componentType: "bookletpage", parentId: "booklet-1", name: "Page 1", frontFileId: "page-face" },
      createContext(tgc),
    );
    const invalidCustomDie = await executeTool(
      "tgc_component_create",
      { componentType: "customcolord4", gameId: "game-1", name: "Bad Die" },
      createContext(tgc),
    );

    expect(tgc.createComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "customcolord6",
        identity: "CustomColorD6",
        side6FileId: "6",
      }),
    );
    expect(tgc.updateComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "tuckbox",
        componentId: "component-1",
        dieColor: "red",
      }),
    );
    expect(list.data).toMatchObject({ relationship: "tuckboxes", items: [{ id: "component-1" }], page: 1, limit: 20 });
    expect(items.data).toMatchObject({
      componentType: "twosidedset",
      componentId: "set-1",
      relationship: "twosideds",
      items: [{ id: "item-1" }],
      page: 1,
      limit: 20,
    });
    expect(create.data).toEqual({ component: { id: "component-2" }, resumed: false });
    expect(update.data).toEqual({ component: { id: "component-3" } });
    expect(itemCreate.data).toEqual({ item: { id: "item-2" } });
    expect(pageCreate.data).toEqual({ page: { id: "page-1" } });
    expect(invalidCustomDie).toEqual({
      ok: false,
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: "Missing required side image fields for customcolord4: side1FileId, side2FileId, side3FileId, side4FileId.",
        details: null,
      },
    });
  });

  it("resumes component creation when an exact relationship-scoped match already exists", async () => {
    const tgc = createMockTgc();
    tgc.listGameComponents.mockResolvedValue({
      items: [
        {
          id: "component-existing",
          name: "Tuckbox",
          identity: "PokerTuckBox54",
          quantity: 1,
          outside_id: "outside-1",
        },
      ],
      paging: { page_number: 1, items_per_page: 100 },
    });

    const result = await executeTool(
      "tgc_component_create",
      {
        componentType: "tuckbox",
        gameId: "game-1",
        relationship: "tuckboxes",
        name: "Tuckbox",
        identity: "PokerTuckBox54",
        quantity: 1,
        outsideFileId: "outside-1",
        resumeIfExists: true,
      },
      createContext(tgc),
    );

    expect(tgc.createComponent).not.toHaveBeenCalled();
    expect(result.data).toEqual({
      component: {
        id: "component-existing",
        name: "Tuckbox",
        identity: "PokerTuckBox54",
        quantity: 1,
        outside_id: "outside-1",
      },
      resumed: true,
    });
  });

  it("rejects component resume requests that omit relationship", async () => {
    const tgc = createMockTgc();
    const result = await executeTool(
      "tgc_component_create",
      {
        componentType: "tuckbox",
        gameId: "game-1",
        name: "Tuckbox",
        resumeIfExists: true,
      },
      createContext(tgc),
    );

    expect(tgc.createComponent).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: "relationship is required when resumeIfExists=true for tgc_component_create.",
        details: {
          prompt:
            "Provide the game relationship path for this component family, for example tuckboxes, booklets, bifoldboards, or acrylicshapes.",
        },
      },
    });
  });

  it("rejects component updates that provide no mutable fields", async () => {
    const tgc = createMockTgc();
    const result = await executeTool(
      "tgc_component_update",
      { componentType: "tuckbox", componentId: "component-1" },
      createContext(tgc),
    );

    expect(tgc.updateComponent).not.toHaveBeenCalled();
    expect(result).toEqual({
      ok: false,
      data: null,
      error: {
        code: "INVALID_INPUT",
        message: "Tool input failed schema validation.",
        details: {
          issues: [{ path: "componentId", message: "Provide at least one mutable field to update." }],
        },
      },
    });
  });

  it("covers folder, file, gamedownload, and file-reference flows", async () => {
    const tgc = createMockTgc();
    tgc.createFolder.mockResolvedValue({ id: "folder-1" });
    tgc.uploadFile.mockResolvedValue({ id: "file-1" });
    tgc.createGameDownload.mockResolvedValue({ id: "download-1" });
    tgc.getFile.mockResolvedValue({ id: "file-1" });
    tgc.getFileReferences.mockResolvedValue({ items: [{ id: "ref-1" }], paging: { page_number: 1, items_per_page: 20 } });

    const folder = await executeTool("tgc_folder_create", { name: "Assets" }, createContext(tgc));
    const upload = await executeTool("tgc_file_upload", { path: "/tmp/card.png", name: "card.png" }, createContext(tgc));
    const download = await executeTool(
      "tgc_gamedownload_create",
      { gameId: "game-1", fileId: "file-1", name: "Rules", free: true },
      createContext(tgc),
    );
    const file = await executeTool("tgc_file_get", { fileId: "file-1" }, createContext(tgc));
    const refs = await executeTool("tgc_file_references_get", { fileId: "file-1" }, createContext(tgc));

    expect(folder.data).toEqual({ folder: { id: "folder-1" } });
    expect(upload.data).toEqual({ file: { id: "file-1" } });
    expect(download.data).toEqual({ gameDownload: { id: "download-1" } });
    expect(file.data).toEqual({ file: { id: "file-1" } });
    expect(refs.data).toMatchObject({ items: [{ id: "ref-1" }], page: 1, limit: 20 });
  });

  it("applies local paging for catalog listing", async () => {
    const tgc = createMockTgc();
    tgc.listTgcProducts.mockResolvedValue({
      items: [{ id: "a" }, { id: "b" }, { id: "c" }],
    });

    const result = await executeTool(
      "tgc_tgc_products_list",
      { activeOnly: true, page: 2, limit: 1 },
      createContext(tgc),
    );

    expect(tgc.listTgcProducts).toHaveBeenCalledWith(true);
    expect(result.data).toEqual({
      items: [{ id: "b" }],
      page: 2,
      limit: 1,
      totalItems: 3,
      pagingMode: "local",
      raw: {
        items: [{ id: "a" }, { id: "b" }, { id: "c" }],
      },
    });
  });

  it("sanitizes sensitive TGC error details", async () => {
    const tgc = createMockTgc();
    tgc.createGame.mockRejectedValue(
      new TgcApiError("API_ERROR", "Backend rejected request.", {
        apiKey: "secret-key",
        nested: { password: "secret-password" },
        safe: "value",
      }),
    );

    const result = await executeTool(
      "tgc_game_create",
      { name: "Prototype", designerId: "designer-1" },
      createContext(tgc),
    );

    expect(result).toEqual({
      ok: false,
      data: null,
      error: {
        code: "API_ERROR",
        message: "Backend rejected request.",
        details: {
          apiKey: "[REDACTED]",
          nested: { password: "[REDACTED]" },
          safe: "value",
        },
      },
    });
  });
});
