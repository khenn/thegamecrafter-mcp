import { readEnvConfig } from "../../../src/config/env.js";
import { TgcService } from "../../../src/tgc/service.js";

type JsonObject = Record<string, unknown>;

export type FixtureContext = {
  tgc: TgcService;
  designerId: string;
  gameId: string;
  gameName: string;
};

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonObject;
}

function asItems(value: unknown): JsonObject[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asObject(item)).filter((x): x is JsonObject => x !== null);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function createFixtureGameName(prefix: string): string {
  return `${prefix}-${new Date().toISOString()}`;
}

export async function withFixtureGame(
  prefix: string,
  run: (context: FixtureContext) => Promise<void>,
): Promise<void> {
  const tgc = new TgcService(readEnvConfig());
  let gameId = "";
  let gameName = "";

  try {
    await tgc.login({});
    const designers = await tgc.listDesigners(1, 1);
    const designerId = asString(asItems(designers.items)[0]?.id);
    if (!designerId) {
      throw new Error("No designer available for authenticated user.");
    }

    gameName = createFixtureGameName(prefix);
    const game = await tgc.createGame({
      name: gameName,
      designerId,
    });
    gameId = asString(game.id);
    if (!gameId) {
      throw new Error("Fixture game creation did not return an id.");
    }

    await run({ tgc, designerId, gameId, gameName });
  } finally {
    if (gameId) {
      await tgc.deleteGame(gameId).catch(() => {});
    }
    await tgc.logout().catch(() => {});
  }
}

