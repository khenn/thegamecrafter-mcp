import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

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

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

type ComponentProbe = {
  setRelationship: string;
  containerCreateType: string;
  itemCreateType: string;
};

const PROBES: ComponentProbe[] = [
  {
    setRelationship: "twosidedsets",
    containerCreateType: "twosidedset",
    itemCreateType: "twosided",
  },
  {
    setRelationship: "twosidedsluggedsets",
    containerCreateType: "twosidedsluggedset",
    itemCreateType: "twosidedslugged",
  },
  {
    setRelationship: "onesidedsluggedsets",
    containerCreateType: "onesidedsluggedset",
    itemCreateType: "onesidedslugged",
  },
];

async function main(): Promise<void> {
  const env = readEnvConfig();
  const tgc = new TgcService(env);
  let createdGameId: string | null = null;

  try {
    await tgc.login({});

    const designers = await tgc.listDesigners(1, 1);
    const designerId = asString(asItems(designers.items)[0]?.id);
    if (!designerId) throw new Error("No designer found");

    const sourceGameId = "64DC0B18-EE95-11E8-A07F-7EA0C1FB3B94"; // Generals-v2

    const targetGame = await tgc.createGame({
      name: `tgcmcp-component-primitives-${new Date().toISOString()}`,
      designerId,
    });
    createdGameId = asString(targetGame.id);
    if (!createdGameId) throw new Error("Failed to create target game");

    for (const probe of PROBES) {
      console.log(`Probe start: ${probe.containerCreateType}/${probe.itemCreateType}`);
      const sourceSets = await tgc.listGameComponents(sourceGameId, probe.setRelationship, 1, 100);
      const sourceSet = asItems(sourceSets.items)[0];
      if (!sourceSet) {
        console.log(`Skipping ${probe.setRelationship}: no source set found`);
        continue;
      }

      const sourceSetId = asString(sourceSet.id);
      const sourceSetName = asString(sourceSet.name) || probe.containerCreateType;
      const sourceIdentity = asString(sourceSet.identity) || undefined;
      const sourceSetQty = asNumber(sourceSet.quantity);
      const sourceBackId = asString(sourceSet.back_id) || undefined;
      console.log(
        `Source set: relationship=${probe.setRelationship} id=${sourceSetId} name=${sourceSetName}`,
      );

      const createdSet = await tgc.createComponent({
        componentType: probe.containerCreateType,
        gameId: createdGameId,
        name: `${sourceSetName}-probe`,
        identity: sourceIdentity,
        quantity: sourceSetQty,
        backFileId: sourceBackId,
      });
      const targetSetId = asString(createdSet.id);
      if (!targetSetId) {
        throw new Error(`Failed creating ${probe.containerCreateType}`);
      }
      console.log(`Created set: type=${probe.containerCreateType} id=${targetSetId}`);

      const sourceItems = await tgc.listComponentItems(
        probe.containerCreateType,
        sourceSetId,
        "members",
        1,
        100,
      );
      const sourceItem = asItems(sourceItems.items)[0];
      if (!sourceItem) {
        console.log(`No source members found under ${probe.setRelationship}`);
        continue;
      }
      console.log("Found source member");

      const sourceItemName = asString(sourceItem.name) || `${probe.itemCreateType}-probe`;
      const sourceFaceId = asString(sourceItem.face_id);
      const sourceBackItemId = asString(sourceItem.back_id) || undefined;
      const sourceItemQty = asNumber(sourceItem.quantity);

      if (!sourceFaceId) {
        throw new Error(`Source item missing face_id for ${probe.itemRelationship}`);
      }

      const createdItem = await tgc.createComponentItem({
        componentType: probe.itemCreateType,
        setId: targetSetId,
        name: `${sourceItemName}-probe`,
        frontFileId: sourceFaceId,
        backFileId: sourceBackItemId,
        quantity: sourceItemQty,
      });
      const createdItemId = asString(createdItem.id);
      if (!createdItemId) {
        throw new Error(`Failed creating ${probe.itemCreateType}`);
      }
      console.log(`Created item: type=${probe.itemCreateType} id=${createdItemId}`);

      const targetItems = await tgc.listComponentItems(
        probe.containerCreateType,
        targetSetId,
        "members",
        1,
        100,
      );
      const count = asItems(targetItems.items).length;
      if (count < 1) {
        throw new Error("Verification failed: expected >=1 member");
      }

      console.log(
        `OK ${probe.containerCreateType}/${probe.itemCreateType}: set=${targetSetId} item=${createdItemId}`,
      );
    }

    console.log("Component primitive integration test passed");
  } finally {
    if (createdGameId) {
      await tgc.deleteGame(createdGameId).catch(() => {});
    }
    await tgc.logout().catch(() => {});
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-component-primitives failed: ${message}`);
  process.exitCode = 1;
});
