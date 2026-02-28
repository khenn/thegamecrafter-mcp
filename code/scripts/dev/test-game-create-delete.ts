import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function extractItems(result: Record<string, unknown>): Record<string, unknown>[] {
  const items = result.items;
  if (!Array.isArray(items)) {
    throw new Error("Designer list response did not include an items array.");
  }
  return items.filter((item): item is Record<string, unknown> => !!item && typeof item === "object");
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
    const items = extractItems(designers);
    if (items.length === 0) {
      throw new Error("No designers found for authenticated user.");
    }
    const designerId = items[0].id;
    if (typeof designerId !== "string" || designerId.length === 0) {
      throw new Error("Designer list item missing string id.");
    }

    const name = `tgcmcp-integration-${new Date().toISOString()}`;
    const created = await tgc.createGame({ name, designerId });
    const gameId = created.id;
    if (typeof gameId !== "string" || gameId.length === 0) {
      throw new Error("Create game response missing string id.");
    }
    createdGameId = gameId;
    console.log(`Created test game ${gameId} (${name})`);
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
