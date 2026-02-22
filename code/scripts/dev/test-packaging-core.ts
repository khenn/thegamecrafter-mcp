import { withFixtureGame } from "./lib/live-fixture.js";

type JsonObject = Record<string, unknown>;

type PackagingProbe = {
  componentType: string;
  relationship: string;
  identity: string;
};

const PACKAGING_PROBES: PackagingProbe[] = [
  { componentType: "tuckbox", relationship: "tuckboxes", identity: "PokerTuckBox54" },
  { componentType: "hookbox", relationship: "hookboxes", identity: "PokerHookBox54" },
  { componentType: "twosidedbox", relationship: "twosidedboxes", identity: "MediumStoutBox" },
  { componentType: "boxtop", relationship: "boxtops", identity: "MediumStoutBoxTopAndSide" },
  { componentType: "boxtopgloss", relationship: "boxtopglosses", identity: "LargeStoutBoxTopAndSide" },
  { componentType: "twosidedboxgloss", relationship: "twosidedboxglosses", identity: "LargeStoutBox" },
  { componentType: "boxface", relationship: "boxfaces", identity: "PokerBooster" },
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
  await withFixtureGame("tgcmcp-packaging-core", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    for (const probe of PACKAGING_PROBES) {
      const created = await tgc.createComponent({
        componentType: probe.componentType,
        gameId,
        name: `batch1-${probe.componentType}`,
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

  console.log("Batch 1 packaging core integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-packaging-core failed: ${message}`);
  process.exitCode = 1;
});

