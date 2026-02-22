import { z } from "zod";
import type { TgcService } from "../tgc/service.js";
import { TgcApiError } from "../tgc/client.js";
import { TOOL_NAMES } from "./contract.js";
import { fail, ok, type ToolResultEnvelope } from "./response.js";

type JsonObject = Record<string, unknown>;
type ToolContext = { tgc: TgcService };

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
  topFileId: z.string().min(1).optional(),
  bottomFileId: z.string().min(1).optional(),
  spotGlossFileId: z.string().min(1).optional(),
  spotGlossBottomFileId: z.string().min(1).optional(),
  hasProofedFace: z.boolean().optional(),
  hasProofedBack: z.boolean().optional(),
  hasProofedOutside: z.boolean().optional(),
  hasProofedInside: z.boolean().optional(),
  hasProofedTop: z.boolean().optional(),
  hasProofedBottom: z.boolean().optional(),
  hasProofedSpotGloss: z.boolean().optional(),
  hasProofedSpotGlossBottom: z.boolean().optional(),
});

const componentItemCreateSchema = z.object({
  componentType: z.string().trim().min(1),
  setId: z.string().min(1),
  name: z.string().min(1),
  frontFileId: z.string().min(1),
  backFileId: z.string().min(1).optional(),
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
      case "tgc_game_delete": {
        const input = gameDeleteSchema.parse(safeArgs);
        const deleted = await context.tgc.deleteGame(input.gameId);
        return ok({ deleted });
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
        const input = componentCreateSchema.parse(safeArgs);
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
          topFileId: input.topFileId,
          bottomFileId: input.bottomFileId,
          spotGlossFileId: input.spotGlossFileId,
          spotGlossBottomFileId: input.spotGlossBottomFileId,
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
