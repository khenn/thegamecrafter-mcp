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

const gameGetSchema = z.object({
  gameId: z.string().min(1),
  include: z.array(z.string().min(1)).optional(),
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
        const pager = result.pager && typeof result.pager === "object" ? (result.pager as JsonObject) : {};
        const page = typeof pager.page === "number" ? pager.page : input.page;
        const limit = typeof pager.items_per_page === "number" ? pager.items_per_page : input.limit;
        return ok({ items, page, limit, raw: result });
      }
      case "tgc_game_get": {
        const input = gameGetSchema.parse(safeArgs);
        const game = await context.tgc.getGame(input.gameId, input.include);
        return ok({ game });
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
