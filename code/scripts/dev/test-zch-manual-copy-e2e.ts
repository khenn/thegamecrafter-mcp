import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

type JsonObject = Record<string, unknown>;

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as JsonObject;
}

function asItems(value: unknown): JsonObject[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => asObject(item))
    .filter((item): item is JsonObject => item !== null);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function chunk<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < values.length; i += size) {
    chunks.push(values.slice(i, i + size));
  }
  return chunks;
}

async function listAllDeckCards(tgc: TgcService, deckId: string): Promise<JsonObject[]> {
  const out: JsonObject[] = [];
  for (let page = 1; page <= 50; page += 1) {
    const result = await tgc.listDeckCards(deckId, page, 100);
    const items = asItems(result.items);
    if (items.length === 0) {
      break;
    }
    out.push(...items);
    if (items.length < 100) {
      break;
    }
  }
  return out;
}

async function main(): Promise<void> {
  const env = readEnvConfig();
  required(env.TGC_PUBLIC_API_KEY_ID, "TGC_PUBLIC_API_KEY_ID");
  required(env.TGC_USERNAME, "TGC_USERNAME");
  required(env.TGC_PASSWORD, "TGC_PASSWORD");

  const tgc = new TgcService(env);
  let createdGameId: string | null = null;

  try {
    await tgc.login({});
    console.log("Logged in to TGC.");

    const designers = await tgc.listDesigners(1, 1);
    const designer = asItems(designers.items)[0];
    const designerId = asString(designer?.id);
    if (!designerId) {
      throw new Error("No designer found.");
    }
    console.log(`Designer: ${designerId}`);

    const sourceName = "Zombicide Character Help";
    const games = await tgc.listGames({ page: 1, limit: 100, designerId });
    const sourceGame = asItems(games.items).find((item) => asString(item.name) === sourceName);
    const sourceGameId = asString(sourceGame?.id);
    if (!sourceGameId) {
      throw new Error(`Source game not found: ${sourceName}`);
    }
    console.log(`Source game: ${sourceGameId}`);

    const sourceGameFull = await tgc.getGame(sourceGameId, undefined, ["decks", "gameparts"]);
    const targetName = `tgcmcp-zch-copy-e2e-${new Date().toISOString()}`;
    const created = await tgc.createGame({ name: targetName, designerId });
    const targetGameId = asString(created.id);
    if (!targetGameId) {
      throw new Error("Create target game returned no id.");
    }
    createdGameId = targetGameId;
    console.log(`Target game created: ${targetGameId} (${targetName})`);

    await tgc.updateGame(targetGameId, {
      min_players: asNumber(sourceGameFull.min_players),
      max_players: asNumber(sourceGameFull.max_players),
      play_time: asString(sourceGameFull.play_time) || undefined,
      enable_uv_coating: asNumber(sourceGameFull.enable_uv_coating),
      enable_linen_texture: asNumber(sourceGameFull.enable_linen_texture),
    });
    console.log("Target game metadata patched");

    const sourceDecks = asItems((await tgc.listGameDecks(sourceGameId, 1, 100)).items);
    if (sourceDecks.length === 0) {
      throw new Error("Source game has no decks.");
    }
    console.log(`Source decks: ${sourceDecks.length}`);

    for (const sourceDeck of sourceDecks) {
      const sourceDeckId = asString(sourceDeck.id);
      const sourceDeckName = asString(sourceDeck.name) || "Deck";
      const sourceIdentity = asString(sourceDeck.identity) || "PokerDeck";
      const sourceBackId = asString(sourceDeck.back_id) || undefined;
      const sourceHasProofedBack = (asNumber(sourceDeck.has_proofed_back) ?? 0) === 1;
      if (!sourceDeckId) {
        throw new Error("Encountered source deck with missing id.");
      }

      const newDeck = await tgc.createDeck({
        gameId: targetGameId,
        name: sourceDeckName,
        identity: sourceIdentity,
        backFileId: sourceBackId,
        hasProofedBack: sourceHasProofedBack,
      });
      const targetDeckId = asString(newDeck.id);
      if (!targetDeckId) {
        throw new Error(`Failed to create target deck for ${sourceDeckName}`);
      }

      const sourceCards = await listAllDeckCards(tgc, sourceDeckId);
      const bulkCards = sourceCards.map((card) => {
        const faceId = asString(card.face_id);
        if (!faceId) {
          throw new Error(`Source card missing face_id in deck ${sourceDeckName}`);
        }
        return {
          name: asString(card.name) || "Card",
          face_id: faceId,
          back_id: asString(card.back_id) || undefined,
          quantity: asNumber(card.quantity),
          class_number: asNumber(card.class_number),
        };
      });

      let createdCount = 0;
      for (const cardChunk of chunk(bulkCards, 100)) {
        const result = await tgc.bulkCreateCards(targetDeckId, cardChunk);
        const createdCards = asItems(result.cards);
        if (createdCards.length !== cardChunk.length) {
          throw new Error(
            `Bulk create count mismatch in ${sourceDeckName}: expected ${cardChunk.length}, got ${createdCards.length}`,
          );
        }
        const nullFace = createdCards.find((c) => !asString(c.face_id));
        if (nullFace) {
          throw new Error(`Bulk create returned card with null face_id in ${sourceDeckName}`);
        }
        createdCount += createdCards.length;
      }

      const targetCards = await listAllDeckCards(tgc, targetDeckId);
      if (targetCards.length !== sourceCards.length) {
        throw new Error(
          `Target deck count mismatch for ${sourceDeckName}: source=${sourceCards.length} target=${targetCards.length}`,
        );
      }
      console.log(
        `Deck copied: ${sourceDeckName} (${sourceCards.length} cards, bulk-created=${createdCount})`,
      );
    }

    console.log("E2E manual copy test passed");
  } finally {
    if (createdGameId) {
      try {
        await tgc.deleteGame(createdGameId);
        console.log(`Cleanup: deleted target game ${createdGameId}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Cleanup failed for ${createdGameId}: ${message}`);
        process.exitCode = 1;
      }
    }

    try {
      await tgc.logout();
    } catch {
      // ignore logout cleanup errors
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`E2E copy test failed: ${message}`);
  process.exitCode = 1;
});
