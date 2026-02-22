import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asItems(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => asObject(item))
    .filter((item): item is Record<string, unknown> => item !== null);
}

type SourceCard = {
  faceId: string;
  name: string;
};

type SourceDeck = {
  identity: string;
  name: string;
  backId?: string;
  card: SourceCard;
};

async function findReusableDeck(tgc: TgcService, designerId: string): Promise<SourceDeck> {
  const games = await tgc.listGames({ page: 1, limit: 100, designerId });
  for (const game of asItems(games.items)) {
    const gameId = typeof game.id === "string" ? game.id : "";
    if (!gameId) {
      continue;
    }

    const decks = await tgc.listGameDecks(gameId, 1, 100);
    for (const deck of asItems(decks.items)) {
      const deckId = typeof deck.id === "string" ? deck.id : "";
      const identity = typeof deck.identity === "string" ? deck.identity : "";
      const name = typeof deck.name === "string" ? deck.name : "Deck";
      const backId = typeof deck.back_id === "string" ? deck.back_id : undefined;
      if (!deckId || !identity) {
        continue;
      }

      const cards = await tgc.listDeckCards(deckId, 1, 1);
      const firstCard = asItems(cards.items)[0];
      if (!firstCard) {
        continue;
      }

      const faceId = typeof firstCard.face_id === "string" ? firstCard.face_id : "";
      const cardName = typeof firstCard.name === "string" ? firstCard.name : "Bulk Probe Card";
      if (!faceId) {
        continue;
      }

      return { identity, name, backId, card: { faceId, name: cardName } };
    }
  }

  throw new Error("No reusable source deck/card found with a valid face_id.");
}

async function main(): Promise<void> {
  const env = readEnvConfig();
  required(env.TGC_PUBLIC_API_KEY_ID, "TGC_PUBLIC_API_KEY_ID");
  required(env.TGC_USERNAME, "TGC_USERNAME");
  required(env.TGC_PASSWORD, "TGC_PASSWORD");

  const tgc = new TgcService(env);
  let createdGameId: string | null = null;

  try {
    const session = await tgc.login({});
    console.log(`Logged in with session ${session.id}`);

    const designers = await tgc.listDesigners(1, 1);
    const firstDesigner = asItems(designers.items)[0];
    const designerId = firstDesigner && typeof firstDesigner.id === "string" ? firstDesigner.id : "";
    if (!designerId) {
      throw new Error("No designer found for authenticated user.");
    }

    const source = await findReusableDeck(tgc, designerId);
    console.log(`Using source deck "${source.name}" (${source.identity}) for face asset probe`);

    const gameName = `tgcmcp-bulk-cards-${new Date().toISOString()}`;
    const game = await tgc.createGame({ name: gameName, designerId });
    const gameId = typeof game.id === "string" ? game.id : "";
    if (!gameId) {
      throw new Error("Create game response missing id.");
    }
    createdGameId = gameId;
    console.log(`Created test game ${gameId}`);

    const deck = await tgc.createDeck({
      gameId,
      name: `${source.name}-bulk-probe`,
      identity: source.identity,
      backFileId: source.backId,
    });
    const deckId = typeof deck.id === "string" ? deck.id : "";
    if (!deckId) {
      throw new Error("Create deck response missing id.");
    }
    console.log(`Created test deck ${deckId}`);

    const bulkResult = await tgc.bulkCreateCards(deckId, [
      {
        name: `${source.card.name}-bulk-probe`,
        face_id: source.card.faceId,
      },
    ]);
    const createdCards = asItems(bulkResult.cards);
    if (createdCards.length !== 1) {
      throw new Error(`Expected 1 created card, got ${createdCards.length}.`);
    }

    const createdFaceId = typeof createdCards[0].face_id === "string" ? createdCards[0].face_id : "";
    if (createdFaceId !== source.card.faceId) {
      throw new Error(
        `Bulk create face_id mismatch. Expected ${source.card.faceId}, got ${createdFaceId || "null"}.`,
      );
    }

    console.log(`Bulk create verified: face_id ${createdFaceId}`);
  } finally {
    if (createdGameId) {
      try {
        await tgc.deleteGame(createdGameId);
        console.log(`Deleted test game ${createdGameId}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Cleanup failed for ${createdGameId}: ${message}`);
        process.exitCode = 1;
      }
    }

    try {
      await tgc.logout();
    } catch {
      // Ignore logout errors in cleanup path.
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Integration test failed: ${message}`);
  process.exitCode = 1;
});
