import { withFixtureGame } from "./lib/live-fixture.js";

type JsonObject = Record<string, unknown>;

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

async function main(): Promise<void> {
  await withFixtureGame("tgcmcp-batch0-smoke", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const existing = await tgc.createComponent({
      componentType: "twosidedset",
      gameId,
      name: "batch0-existing-twosidedset",
      identity: "BigMat",
      quantity: 1,
    });
    const existingId = asString(existing.id);
    if (!existingId) {
      throw new Error("Failed to create existing supported family component (twosidedset).");
    }

    const existingRead = await tgc.listGameComponents(gameId, "twosidedsets", 1, 100);
    const existingFound = asItems(existingRead.items).some((item) => asString(item.id) === existingId);
    if (!existingFound) {
      throw new Error("Verification failed for existing family (twosidedsets).");
    }
    console.log(`Verified existing family: twosidedset (${existingId})`);

    const newFamily = await tgc.createComponent({
      componentType: "tuckbox",
      gameId,
      name: "batch0-new-tuckbox",
      identity: "PokerTuckBox54",
      quantity: 1,
    });
    const newFamilyId = asString(newFamily.id);
    if (!newFamilyId) {
      throw new Error("Failed to create new family component (tuckbox).");
    }

    const newFamilyRead = await tgc.listGameComponents(gameId, "tuckboxes", 1, 100);
    const newFamilyFound = asItems(newFamilyRead.items).some((item) => asString(item.id) === newFamilyId);
    if (!newFamilyFound) {
      throw new Error("Verification failed for new family (tuckboxes).");
    }
    console.log(`Verified new family: tuckbox (${newFamilyId})`);
  });

  console.log("Batch 0 smoke harness passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch0-smoke-harness failed: ${message}`);
  process.exitCode = 1;
});

