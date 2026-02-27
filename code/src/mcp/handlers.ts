import { z } from "zod";
import type { TgcService } from "../tgc/service.js";
import { TgcApiError } from "../tgc/client.js";
import { TOOL_NAMES } from "./contract.js";
import { fail, ok, type ToolResultEnvelope } from "./response.js";

type JsonObject = Record<string, unknown>;
type ToolContext = { tgc: TgcService };

const CUSTOM_DICE_RULES: Record<
  string,
  {
    identity: string;
    requiredSideFields: string[];
  }
> = {
  customcolord4: {
    identity: "CustomColorD4",
    requiredSideFields: ["side1FileId", "side2FileId", "side3FileId", "side4FileId"],
  },
  customcolord6: {
    identity: "CustomColorD6",
    requiredSideFields: [
      "side1FileId",
      "side2FileId",
      "side3FileId",
      "side4FileId",
      "side5FileId",
      "side6FileId",
    ],
  },
  customcolord8: {
    identity: "CustomColorD8",
    requiredSideFields: [
      "side1FileId",
      "side2FileId",
      "side3FileId",
      "side4FileId",
      "side5FileId",
      "side6FileId",
      "side7FileId",
      "side8FileId",
    ],
  },
};

function asObject(value: unknown): JsonObject {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonObject;
  }
  return {};
}

const loginSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  apiKeyId: z.string().min(1).optional(),
});

const designerListSchema = z.object({
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const gameListSchema = z.object({
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  designerId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
});

const gameCreateSchema = z.object({
  name: z.string().min(1),
  designerId: z.string().min(1),
  description: z.string().optional(),
  minPlayers: z.number().int().min(1).optional(),
  maxPlayers: z.number().int().min(1).optional(),
  playTimeMinutes: z.number().int().min(1).optional(),
});

const gameUpdateSchema = z.object({
  gameId: z.string().min(1),
  patch: z.record(z.unknown()),
});

const gameGetSchema = z.object({
  gameId: z.string().min(1),
  include: z.array(z.string().min(1)).optional(),
  includeRelationships: z.array(z.string().min(1)).optional(),
});

const gameDeleteSchema = z.object({
  gameId: z.string().min(1),
});

const gamePublishSchema = z.object({
  gameId: z.string().min(1),
});

const gameSurfacingGetSchema = z.object({
  gameId: z.string().min(1),
});

const gameSurfacingSetSchema = z.object({
  gameId: z.string().min(1),
  enableUvCoating: z.boolean().optional(),
  enableLinenTexture: z.boolean().optional(),
});

const gameTestReportsGetSchema = z.object({
  gameId: z.string().min(1),
  limitPerType: z.number().int().min(1).max(100).default(20),
});

const makeReadinessCheckSchema = z.object({
  gameId: z.string().min(1),
});

const deckGetSchema = z.object({
  deckId: z.string().min(1),
});

const gameDecksListSchema = z.object({
  gameId: z.string().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const deckCardsListSchema = z.object({
  deckId: z.string().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const gameGamepartsListSchema = z.object({
  gameId: z.string().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const gameComponentsListSchema = z.object({
  gameId: z.string().min(1),
  relationship: z.string().trim().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const componentItemsListSchema = z.object({
  componentType: z.string().trim().min(1),
  componentId: z.string().min(1),
  relationship: z.string().trim().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const cardGetSchema = z.object({
  cardId: z.string().min(1),
});

const partGetSchema = z.object({
  partId: z.string().min(1),
});

const fileGetSchema = z.object({
  fileId: z.string().min(1),
});

const fileReferencesGetSchema = z.object({
  fileId: z.string().min(1),
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const tgcProductsListSchema = z.object({
  page: z.number().int().min(1).max(200).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  activeOnly: z.boolean().default(true),
});

const deckCreateSchema = z.object({
  gameId: z.string().min(1),
  name: z.string().min(1),
  identity: z.string().min(1).default("PokerDeck"),
  quantity: z.number().int().min(1).max(99).optional(),
  backFileId: z.string().min(1).optional(),
  hasProofedBack: z.boolean().optional(),
  cardCount: z.number().int().min(1).optional(),
});

const cardCreateSchema = z.object({
  deckId: z.string().min(1),
  name: z.string().min(1),
  frontFileId: z.string().min(1),
  backFileId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(99).optional(),
});

const bulkCardSchema = z
  .object({
    name: z.string().min(1),
    frontFileId: z.string().min(1).optional(),
    faceFileId: z.string().min(1).optional(),
    face_id: z.string().min(1).optional(),
    backFileId: z.string().min(1).optional(),
    back_id: z.string().min(1).optional(),
    quantity: z.number().int().min(1).max(99).optional(),
    classNumber: z.number().int().min(1).max(5).optional(),
    class_number: z.number().int().min(1).max(5).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.frontFileId && !value.faceFileId && !value.face_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["frontFileId"],
        message: "Each card must include frontFileId (or faceFileId/face_id).",
      });
    }
  });

const deckBulkCreateCardsSchema = z.object({
  deckId: z.string().min(1),
  cards: z.array(bulkCardSchema).min(1).max(100),
});

const partCreateSchema = z.object({
  gameId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1),
});

const gamepartUpsertSchema = z.object({
  gameId: z.string().min(1),
  partId: z.string().min(1),
  componentType: z.string().min(1),
  componentId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const componentCreateSchema = z.object({
  componentType: z.string().trim().min(1),
  gameId: z.string().min(1),
  name: z.string().min(1),
  identity: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(9999).optional(),
  backFileId: z.string().min(1).optional(),
  faceFileId: z.string().min(1).optional(),
  frontFileId: z.string().min(1).optional(),
  outsideFileId: z.string().min(1).optional(),
  insideFileId: z.string().min(1).optional(),
  innerFileId: z.string().min(1).optional(),
  topFileId: z.string().min(1).optional(),
  bottomFileId: z.string().min(1).optional(),
  spotGlossFileId: z.string().min(1).optional(),
  spotGlossBottomFileId: z.string().min(1).optional(),
  dieColor: z.string().min(1).optional(),
  side1FileId: z.string().min(1).optional(),
  side2FileId: z.string().min(1).optional(),
  side3FileId: z.string().min(1).optional(),
  side4FileId: z.string().min(1).optional(),
  side5FileId: z.string().min(1).optional(),
  side6FileId: z.string().min(1).optional(),
  side7FileId: z.string().min(1).optional(),
  side8FileId: z.string().min(1).optional(),
  hasProofedFace: z.boolean().optional(),
  hasProofedBack: z.boolean().optional(),
  hasProofedOutside: z.boolean().optional(),
  hasProofedInside: z.boolean().optional(),
  hasProofedTop: z.boolean().optional(),
  hasProofedBottom: z.boolean().optional(),
  hasProofedSpotGloss: z.boolean().optional(),
  hasProofedSpotGlossBottom: z.boolean().optional(),
});

const componentUpdateSchema = z
  .object({
    componentType: z.string().trim().min(1),
    componentId: z.string().min(1),
    name: z.string().min(1).optional(),
    identity: z.string().min(1).optional(),
    quantity: z.number().int().min(1).max(9999).optional(),
    backFileId: z.string().min(1).optional(),
    faceFileId: z.string().min(1).optional(),
    frontFileId: z.string().min(1).optional(),
    outsideFileId: z.string().min(1).optional(),
    insideFileId: z.string().min(1).optional(),
    innerFileId: z.string().min(1).optional(),
    topFileId: z.string().min(1).optional(),
    bottomFileId: z.string().min(1).optional(),
    spotGlossFileId: z.string().min(1).optional(),
    spotGlossBottomFileId: z.string().min(1).optional(),
    dieColor: z.string().min(1).optional(),
    diecolor: z.string().min(1).optional(),
    side1FileId: z.string().min(1).optional(),
    side2FileId: z.string().min(1).optional(),
    side3FileId: z.string().min(1).optional(),
    side4FileId: z.string().min(1).optional(),
    side5FileId: z.string().min(1).optional(),
    side6FileId: z.string().min(1).optional(),
    side7FileId: z.string().min(1).optional(),
    side8FileId: z.string().min(1).optional(),
    hasProofedFace: z.boolean().optional(),
    hasProofedBack: z.boolean().optional(),
    hasProofedOutside: z.boolean().optional(),
    hasProofedInside: z.boolean().optional(),
    hasProofedTop: z.boolean().optional(),
    hasProofedBottom: z.boolean().optional(),
    hasProofedSpotGloss: z.boolean().optional(),
    hasProofedSpotGlossBottom: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    const hasMutableField = Object.entries(value).some(
      ([key, fieldValue]) => key !== "componentType" && key !== "componentId" && fieldValue !== undefined,
    );
    if (!hasMutableField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["componentId"],
        message: "Provide at least one mutable field to update.",
      });
    }
  });

function applyCustomDiceCreateRules(
  input: z.infer<typeof componentCreateSchema>,
): z.infer<typeof componentCreateSchema> {
  const componentType = input.componentType.toLowerCase();
  const rule = CUSTOM_DICE_RULES[componentType];
  if (!rule) {
    return input;
  }

  if (!input.identity) {
    input.identity = rule.identity;
  } else if (input.identity !== rule.identity) {
    throw new TgcApiError(
      "INVALID_INPUT",
      `identity must be ${rule.identity} for componentType ${input.componentType}.`,
    );
  }

  const missingSides = rule.requiredSideFields.filter((field) => !input[field as keyof typeof input]);
  if (missingSides.length > 0) {
    throw new TgcApiError(
      "INVALID_INPUT",
      `Missing required side image fields for ${input.componentType}: ${missingSides.join(", ")}.`,
    );
  }

  return input;
}

const componentItemCreateSchema = z.object({
  componentType: z.string().trim().min(1),
  setId: z.string().min(1),
  name: z.string().min(1),
  frontFileId: z.string().min(1),
  backFileId: z.string().min(1).optional(),
  innerFileId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(9999).optional(),
  hasProofedFace: z.boolean().optional(),
  hasProofedBack: z.boolean().optional(),
});

const componentPageCreateSchema = z.object({
  componentType: z.enum(["bookletpage", "coilbookpage", "perfectboundbookpage"]),
  parentId: z.string().min(1),
  name: z.string().min(1),
  frontFileId: z.string().min(1),
  backFileId: z.string().min(1).optional(),
  quantity: z.number().int().min(1).max(9999).optional(),
  sequenceNumber: z.number().int().min(1).max(5000).optional(),
});

const folderCreateSchema = z.object({
  name: z.string().min(1),
  parentFolderId: z.string().min(1).optional(),
});

const fileUploadSchema = z.object({
  path: z.string().min(1),
  folderId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

const gamedownloadCreateSchema = z.object({
  gameId: z.string().min(1),
  fileId: z.string().min(1),
  name: z.string().min(1),
  free: z.boolean().optional(),
});

const gameBulkPricingGetSchema = z.object({
  gameIds: z.array(z.string().min(1)).min(1).max(50),
});

const gameCostBreakdownGetSchema = z.object({
  gameId: z.string().min(1),
});

export async function executeTool(name: string, args: unknown, context: ToolContext): Promise<ToolResultEnvelope> {
  if (!TOOL_NAMES.has(name)) {
    return fail("TOOL_NOT_FOUND", `Unknown tool: ${name}`);
  }

  const safeArgs = asObject(args);

  try {
    switch (name) {
      case "tgc_auth_login": {
        const input = loginSchema.parse(safeArgs);
        const session = await context.tgc.login(input);
        return ok({ sessionId: session.id, userId: session.userId });
      }
      case "tgc_auth_logout": {
        const loggedOut = await context.tgc.logout();
        return ok({ loggedOut });
      }
      case "tgc_me": {
        const user = await context.tgc.me();
        return ok({ user });
      }
      case "tgc_designer_list": {
        const input = designerListSchema.parse(safeArgs);
        const result = await context.tgc.listDesigners(input.page, input.limit);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_game_get": {
        const input = gameGetSchema.parse(safeArgs);
        const game = await context.tgc.getGame(input.gameId, input.include, input.includeRelationships);
        return ok({ game });
      }
      case "tgc_deck_get": {
        const input = deckGetSchema.parse(safeArgs);
        const deck = await context.tgc.getDeck(input.deckId);
        return ok({ deck });
      }
      case "tgc_game_decks_list": {
        const input = gameDecksListSchema.parse(safeArgs);
        const result = await context.tgc.listGameDecks(input.gameId, input.page, input.limit);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_deck_cards_list": {
        const input = deckCardsListSchema.parse(safeArgs);
        const result = await context.tgc.listDeckCards(input.deckId, input.page, input.limit);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_game_gameparts_list": {
        const input = gameGamepartsListSchema.parse(safeArgs);
        const result = await context.tgc.listGameGameparts(input.gameId, input.page, input.limit);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_game_components_list": {
        const input = gameComponentsListSchema.parse(safeArgs);
        const result = await context.tgc.listGameComponents(
          input.gameId,
          input.relationship,
          input.page,
          input.limit,
        );
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ relationship: input.relationship, items, page, limit, raw: result });
      }
      case "tgc_component_items_list": {
        const input = componentItemsListSchema.parse(safeArgs);
        const result = await context.tgc.listComponentItems(
          input.componentType,
          input.componentId,
          input.relationship,
          input.page,
          input.limit,
        );
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({
          componentType: input.componentType,
          componentId: input.componentId,
          relationship: input.relationship,
          items,
          page,
          limit,
          raw: result,
        });
      }
      case "tgc_card_get": {
        const input = cardGetSchema.parse(safeArgs);
        const card = await context.tgc.getCard(input.cardId);
        return ok({ card });
      }
      case "tgc_part_get": {
        const input = partGetSchema.parse(safeArgs);
        const part = await context.tgc.getPart(input.partId);
        return ok({ part });
      }
      case "tgc_file_get": {
        const input = fileGetSchema.parse(safeArgs);
        const file = await context.tgc.getFile(input.fileId);
        return ok({ file });
      }
      case "tgc_file_references_get": {
        const input = fileReferencesGetSchema.parse(safeArgs);
        const result = await context.tgc.getFileReferences(input.fileId, input.page, input.limit);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_tgc_products_list": {
        const input = tgcProductsListSchema.parse(safeArgs);
        const result = await context.tgc.listTgcProducts(input.activeOnly);
        let items = Array.isArray(result.items) ? result.items : [];

        // TGC products endpoint does not consistently expose paging; emulate local paging for stability.
        const totalItems = items.length;
        const start = (input.page - 1) * input.limit;
        const end = start + input.limit;
        items = items.slice(start, end);
        return ok({
          items,
          page: input.page,
          limit: input.limit,
          totalItems,
          pagingMode: "local",
          raw: result,
        });
      }
      case "tgc_game_list": {
        const input = gameListSchema.parse(safeArgs);
        const result = await context.tgc.listGames(input);
        const items = Array.isArray(result.items) ? result.items : [];
        const paging =
          result.paging && typeof result.paging === "object" ? (result.paging as JsonObject) : {};
        const pageRaw = paging.page_number;
        const limitRaw = paging.items_per_page;
        const page =
          typeof pageRaw === "number"
            ? pageRaw
            : typeof pageRaw === "string"
              ? Number.parseInt(pageRaw, 10)
              : input.page;
        const limit =
          typeof limitRaw === "number"
            ? limitRaw
            : typeof limitRaw === "string"
              ? Number.parseInt(limitRaw, 10)
              : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_game_create": {
        const input = gameCreateSchema.parse(safeArgs);
        const game = await context.tgc.createGame(input);
        return ok({ game });
      }
      case "tgc_game_update": {
        const input = gameUpdateSchema.parse(safeArgs);
        const game = await context.tgc.updateGame(input.gameId, input.patch);
        return ok({ game });
      }
      case "tgc_game_surfacing_get": {
        const input = gameSurfacingGetSchema.parse(safeArgs);
        const game = await context.tgc.getGame(input.gameId, undefined, undefined);
        const surfacing = readSurfacingState(game);
        return ok({
          gameId: input.gameId,
          surfacing,
          helper: {
            prompt:
              "Choose whether to enable UV coating and linen texture. If you are unsure, start with both disabled and enable only after proofing confirms your needs.",
            options: [
              "enableUvCoating: true|false",
              "enableLinenTexture: true|false",
            ],
            note:
              "Surcharges and availability are product/sheet dependent. Confirm current pricing in TGC Production Cost after updates.",
          },
        });
      }
      case "tgc_game_surfacing_set": {
        const input = gameSurfacingSetSchema.parse(safeArgs);
        if (input.enableUvCoating === undefined && input.enableLinenTexture === undefined) {
          return fail(
            "INVALID_INPUT",
            "Provide at least one setting: enableUvCoating and/or enableLinenTexture.",
            {
              prompt:
                "Please choose one or both options: enableUvCoating (true/false), enableLinenTexture (true/false).",
            },
          );
        }

        const patch: Record<string, unknown> = {};
        if (input.enableUvCoating !== undefined) {
          patch.enableUvCoating = input.enableUvCoating;
        }
        if (input.enableLinenTexture !== undefined) {
          patch.enableLinenTexture = input.enableLinenTexture;
        }

        const game = await context.tgc.updateGame(input.gameId, patch);
        const surfacing = readSurfacingState(game);
        return ok({
          gameId: input.gameId,
          surfacing,
          updated: {
            enableUvCoating: input.enableUvCoating,
            enableLinenTexture: input.enableLinenTexture,
          },
        });
      }
      case "tgc_game_test_reports_get": {
        const input = gameTestReportsGetSchema.parse(safeArgs);
        const [sanity, art, cv] = await Promise.all([
          context.tgc.listGameComponents(input.gameId, "sanitytests", 1, input.limitPerType),
          context.tgc.listGameComponents(input.gameId, "arttests", 1, input.limitPerType),
          context.tgc.listGameComponents(input.gameId, "cvtests", 1, input.limitPerType),
        ]);

        const sanityItems = Array.isArray(sanity.items) ? sanity.items : [];
        const artItems = Array.isArray(art.items) ? art.items : [];
        const cvItems = Array.isArray(cv.items) ? cv.items : [];
        const interpreted = interpretTestReports(sanityItems, artItems, cvItems);
        return ok({
          gameId: input.gameId,
          reports: {
            sanitytests: { count: sanityItems.length, items: sanityItems },
            arttests: { count: artItems.length, items: artItems },
            cvtests: { count: cvItems.length, items: cvItems },
          },
          interpreted,
        });
      }
      case "tgc_make_readiness_check": {
        const input = makeReadinessCheckSchema.parse(safeArgs);
        const [game, gameparts, sanity, art, cv] = await Promise.all([
          context.tgc.getGame(input.gameId, undefined, undefined),
          context.tgc.listGameGameparts(input.gameId, 1, 200),
          context.tgc.listGameComponents(input.gameId, "sanitytests", 1, 50),
          context.tgc.listGameComponents(input.gameId, "arttests", 1, 50),
          context.tgc.listGameComponents(input.gameId, "cvtests", 1, 50),
        ]);

        const gamepartsItems = Array.isArray(gameparts.items) ? gameparts.items : [];
        const sanityItems = Array.isArray(sanity.items) ? sanity.items : [];
        const artItems = Array.isArray(art.items) ? art.items : [];
        const cvItems = Array.isArray(cv.items) ? cv.items : [];

        const blockers: string[] = [];
        const warnings: string[] = [];
        const suggestions: string[] = [];

        if (gamepartsItems.length === 0) {
          blockers.push("Game has no linked parts/components. Prototype order is not meaningful until components are added.");
          suggestions.push("Add at least one component and link quantities before ordering.");
        }

        const archived = coerceBooleanish(game.archived);
        if (archived) {
          warnings.push("Game is archived. You can still edit, but this can hide it in list workflows.");
          suggestions.push("Set archived=false in Organization if this is an active prototype.");
        }

        const unproofedCount = countUnproofedGameparts(gamepartsItems);
        if (unproofedCount > 0) {
          warnings.push(`${unproofedCount} linked component(s) appear unproofed or not fully proofed.`);
          suggestions.push("Proof all component art in TGC before placing prototype orders.");
        }

        if (sanityItems.length === 0) {
          warnings.push("No sanity test records were found.");
          suggestions.push("Run sanity tests in TGC Test tab and resolve any failures.");
        }
        if (artItems.length === 0) {
          warnings.push("No art test records were found.");
          suggestions.push("Run art tests in TGC Test tab to catch image/print issues.");
        }
        if (cvItems.length === 0) {
          warnings.push("No CV test records were found.");
          suggestions.push("Run CV tests in TGC Test tab before ordering prototypes.");
        }

        const readiness = blockers.length === 0 ? (warnings.length === 0 ? "ready" : "ready_with_warnings") : "blocked";
        return ok({
          gameId: input.gameId,
          readiness,
          blockers,
          warnings,
          suggestions: Array.from(new Set(suggestions)),
          signals: {
            gamepartsCount: gamepartsItems.length,
            unproofedGamepartsCount: unproofedCount,
            testReports: {
              sanitytests: sanityItems.length,
              arttests: artItems.length,
              cvtests: cvItems.length,
            },
          },
        });
      }
      case "tgc_game_delete": {
        const input = gameDeleteSchema.parse(safeArgs);
        const deleted = await context.tgc.deleteGame(input.gameId);
        return ok({ deleted });
      }
      case "tgc_game_publish": {
        const input = gamePublishSchema.parse(safeArgs);
        const published = await context.tgc.publishGame(input.gameId);
        return ok({ published });
      }
      case "tgc_game_unpublish": {
        const input = gamePublishSchema.parse(safeArgs);
        const unpublished = await context.tgc.unpublishGame(input.gameId);
        return ok({ unpublished });
      }
      case "tgc_deck_create": {
        const input = deckCreateSchema.parse(safeArgs);
        const deck = await context.tgc.createDeck({
          gameId: input.gameId,
          name: input.name,
          identity: input.identity,
          quantity: input.quantity ?? input.cardCount,
          backFileId: input.backFileId,
          hasProofedBack: input.hasProofedBack,
        });
        return ok({ deck });
      }
      case "tgc_card_create": {
        const input = cardCreateSchema.parse(safeArgs);
        const card = await context.tgc.createCard({
          deckId: input.deckId,
          name: input.name,
          faceFileId: input.frontFileId,
          backFileId: input.backFileId,
          quantity: input.quantity,
        });
        return ok({ card });
      }
      case "tgc_deck_bulk_create_cards": {
        const input = deckBulkCreateCardsSchema.parse(safeArgs);
        const normalizedCards = input.cards.map((card) => ({
          name: card.name,
          face_id: card.frontFileId ?? card.faceFileId ?? card.face_id!,
          back_id: card.backFileId ?? card.back_id,
          quantity: card.quantity,
          class_number: card.classNumber ?? card.class_number,
        }));
        const result = await context.tgc.bulkCreateCards(input.deckId, normalizedCards);
        const cards = Array.isArray(result.cards) ? result.cards : [];
        return ok({ createdCount: cards.length, cards, raw: result });
      }
      case "tgc_part_create": {
        const input = partCreateSchema.parse(safeArgs);
        const part = await context.tgc.createPart({
          gameId: input.gameId,
          name: input.name,
          quantity: input.quantity,
        });
        return ok({ part });
      }
      case "tgc_gamepart_upsert": {
        const input = gamepartUpsertSchema.parse(safeArgs);
        const gamePart = await context.tgc.upsertGamepart({
          gameId: input.gameId,
          partId: input.partId,
          componentType: input.componentType,
          componentId: input.componentId,
          quantity: input.quantity,
        });
        return ok({ gamePart });
      }
      case "tgc_component_create": {
        const input = applyCustomDiceCreateRules(componentCreateSchema.parse(safeArgs));
        const component = await context.tgc.createComponent({
          componentType: input.componentType,
          gameId: input.gameId,
          name: input.name,
          identity: input.identity,
          quantity: input.quantity,
          backFileId: input.backFileId,
          faceFileId: input.faceFileId,
          frontFileId: input.frontFileId,
          outsideFileId: input.outsideFileId,
          insideFileId: input.insideFileId,
          innerFileId: input.innerFileId,
          topFileId: input.topFileId,
          bottomFileId: input.bottomFileId,
          spotGlossFileId: input.spotGlossFileId,
          spotGlossBottomFileId: input.spotGlossBottomFileId,
          dieColor: input.dieColor,
          side1FileId: input.side1FileId,
          side2FileId: input.side2FileId,
          side3FileId: input.side3FileId,
          side4FileId: input.side4FileId,
          side5FileId: input.side5FileId,
          side6FileId: input.side6FileId,
          side7FileId: input.side7FileId,
          side8FileId: input.side8FileId,
          hasProofedFace: input.hasProofedFace,
          hasProofedBack: input.hasProofedBack,
          hasProofedOutside: input.hasProofedOutside,
          hasProofedInside: input.hasProofedInside,
          hasProofedTop: input.hasProofedTop,
          hasProofedBottom: input.hasProofedBottom,
          hasProofedSpotGloss: input.hasProofedSpotGloss,
          hasProofedSpotGlossBottom: input.hasProofedSpotGlossBottom,
        });
        return ok({ component });
      }
      case "tgc_component_update": {
        const input = componentUpdateSchema.parse(safeArgs);
        const component = await context.tgc.updateComponent({
          componentType: input.componentType,
          componentId: input.componentId,
          name: input.name,
          identity: input.identity,
          quantity: input.quantity,
          backFileId: input.backFileId,
          faceFileId: input.faceFileId,
          frontFileId: input.frontFileId,
          outsideFileId: input.outsideFileId,
          insideFileId: input.insideFileId,
          innerFileId: input.innerFileId,
          topFileId: input.topFileId,
          bottomFileId: input.bottomFileId,
          spotGlossFileId: input.spotGlossFileId,
          spotGlossBottomFileId: input.spotGlossBottomFileId,
          dieColor: input.dieColor ?? input.diecolor,
          side1FileId: input.side1FileId,
          side2FileId: input.side2FileId,
          side3FileId: input.side3FileId,
          side4FileId: input.side4FileId,
          side5FileId: input.side5FileId,
          side6FileId: input.side6FileId,
          side7FileId: input.side7FileId,
          side8FileId: input.side8FileId,
          hasProofedFace: input.hasProofedFace,
          hasProofedBack: input.hasProofedBack,
          hasProofedOutside: input.hasProofedOutside,
          hasProofedInside: input.hasProofedInside,
          hasProofedTop: input.hasProofedTop,
          hasProofedBottom: input.hasProofedBottom,
          hasProofedSpotGloss: input.hasProofedSpotGloss,
          hasProofedSpotGlossBottom: input.hasProofedSpotGlossBottom,
        });
        return ok({ component });
      }
      case "tgc_component_item_create": {
        const input = componentItemCreateSchema.parse(safeArgs);
        const item = await context.tgc.createComponentItem({
          componentType: input.componentType,
          setId: input.setId,
          name: input.name,
          frontFileId: input.frontFileId,
          backFileId: input.backFileId,
          innerFileId: input.innerFileId,
          quantity: input.quantity,
          hasProofedFace: input.hasProofedFace,
          hasProofedBack: input.hasProofedBack,
        });
        return ok({ item });
      }
      case "tgc_component_page_create": {
        const input = componentPageCreateSchema.parse(safeArgs);
        const page = await context.tgc.createComponentPage({
          componentType: input.componentType,
          parentId: input.parentId,
          name: input.name,
          frontFileId: input.frontFileId,
          backFileId: input.backFileId,
          quantity: input.quantity,
          sequenceNumber: input.sequenceNumber,
        });
        return ok({ page });
      }
      case "tgc_folder_create": {
        const input = folderCreateSchema.parse(safeArgs);
        const folder = await context.tgc.createFolder({
          name: input.name,
          parentFolderId: input.parentFolderId,
        });
        return ok({ folder });
      }
      case "tgc_file_upload": {
        const input = fileUploadSchema.parse(safeArgs);
        const file = await context.tgc.uploadFile({
          path: input.path,
          folderId: input.folderId,
          name: input.name,
        });
        return ok({ file });
      }
      case "tgc_gamedownload_create": {
        const input = gamedownloadCreateSchema.parse(safeArgs);
        const gameDownload = await context.tgc.createGameDownload({
          gameId: input.gameId,
          fileId: input.fileId,
          name: input.name,
          free: input.free,
        });
        return ok({ gameDownload });
      }
      case "tgc_game_bulk_pricing_get": {
        const input = gameBulkPricingGetSchema.parse(safeArgs);
        const pricing = [];
        const errors = [];
        for (const gameId of input.gameIds) {
          try {
            const result = await context.tgc.getGameBulkPricing(gameId);
            pricing.push({ gameId, pricing: result });
          } catch (error: unknown) {
            if (error instanceof TgcApiError) {
              errors.push({ gameId, code: error.code, message: error.message, details: error.details });
              continue;
            }
            throw error;
          }
        }
        return ok({
          requested: input.gameIds.length,
          successCount: pricing.length,
          errorCount: errors.length,
          pricing,
          errors,
        });
      }
      case "tgc_game_cost_breakdown_get": {
        const input = gameCostBreakdownGetSchema.parse(safeArgs);
        const result = await context.tgc.getGameCostBreakdown(input.gameId);
        const items = Array.isArray(result.items)
          ? result.items
          : Array.isArray(result.gameledgerentries)
            ? result.gameledgerentries
            : [];
        const total = typeof result.total === "number" ? result.total : undefined;
        return ok({ gameId: input.gameId, items, total, raw: result });
      }
      default:
        return ok({
          tool: name,
          implemented: false,
          message: "Tool contract is registered. Endpoint implementation is queued in the next phase.",
          args: safeArgs,
        });
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_INPUT", "Tool input failed schema validation.", {
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    if (error instanceof TgcApiError) {
      return fail(error.code, error.message, error.details);
    }
    const message = error instanceof Error ? error.message : String(error);
    return fail("UNEXPECTED_ERROR", message);
  }
}

function readSurfacingState(game: Record<string, unknown>): {
  enableUvCoating: boolean | null;
  enableLinenTexture: boolean | null;
} {
  const uvRaw = game.enable_uv_coating;
  const linenRaw = game.enable_linen_texture;
  return {
    enableUvCoating: coerceBooleanish(uvRaw),
    enableLinenTexture: coerceBooleanish(linenRaw),
  };
}

function coerceBooleanish(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "1" || trimmed === "true" || trimmed === "yes") {
      return true;
    }
    if (trimmed === "0" || trimmed === "false" || trimmed === "no") {
      return false;
    }
  }
  return null;
}

function countUnproofedGameparts(items: unknown[]): number {
  let count = 0;
  for (const raw of items) {
    if (!raw || typeof raw !== "object") {
      continue;
    }
    const item = raw as Record<string, unknown>;
    const proofFields = [
      "has_proofed_face",
      "has_proofed_back",
      "has_proofed_outside",
      "has_proofed_inside",
      "has_proofed_top",
      "has_proofed_bottom",
      "has_proofed_spot_gloss",
      "has_proofed_spot_gloss_bottom",
    ];
    const known = proofFields
      .map((field) => coerceBooleanish(item[field]))
      .filter((v): v is boolean => v !== null);
    if (known.length > 0 && known.some((v) => v === false)) {
      count += 1;
    }
  }
  return count;
}

function interpretTestReports(
  sanityItems: unknown[],
  artItems: unknown[],
  cvItems: unknown[],
): {
  summary: string;
  status: "missing_tests" | "tests_present";
  recommendations: string[];
} {
  const total = sanityItems.length + artItems.length + cvItems.length;
  if (total === 0) {
    return {
      summary: "No test records found in sanitytests, arttests, or cvtests.",
      status: "missing_tests",
      recommendations: [
        "Run TGC Test tab checks before ordering prototypes.",
        "Capture and resolve sanity/art/CV test issues before publishing.",
      ],
    };
  }
  return {
    summary: `Found ${sanityItems.length} sanitytest, ${artItems.length} arttest, and ${cvItems.length} cvtest record(s).`,
    status: "tests_present",
    recommendations: [
      "Review each test record for failed/warning states in TGC.",
      "Re-run tests after major component or artwork changes.",
    ],
  };
}
