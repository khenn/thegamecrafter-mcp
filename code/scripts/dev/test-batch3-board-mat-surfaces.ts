import { withFixtureGame } from "./lib/live-fixture.js";

type JsonObject = Record<string, unknown>;

type SurfaceProbe = {
  componentType: string;
  relationship: string;
  identity: string;
};

const SURFACE_PROBES: SurfaceProbe[] = [
  { componentType: "onesided", relationship: "mediumgamemats", identity: "MediumGameMat" },
  { componentType: "onesidedgloss", relationship: "bifoldboards", identity: "BiFoldBoard" },
];

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
  await withFixtureGame("tgcmcp-batch3-surfaces", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    for (const probe of SURFACE_PROBES) {
      const created = await tgc.createComponent({
        componentType: probe.componentType,
        gameId,
        name: `batch3-${probe.componentType}`,
        identity: probe.identity,
        quantity: 1,
      });

      const createdId = asString(created.id);
      if (!createdId) {
        throw new Error(`Create failed for ${probe.componentType}: missing id.`);
      }

      const listed = await tgc.listGameComponents(gameId, probe.relationship, 1, 100);
      const found = asItems(listed.items).some((item) => asString(item.id) === createdId);
      if (!found) {
        throw new Error(`Verification failed for ${probe.relationship} (${probe.componentType}).`);
      }

      console.log(
        `Verified ${probe.componentType} via ${probe.relationship}: ${createdId} (${probe.identity})`,
      );
    }
  });

  console.log("Batch 3 board/mat surfaces integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch3-board-mat-surfaces failed: ${message}`);
  process.exitCode = 1;
});

