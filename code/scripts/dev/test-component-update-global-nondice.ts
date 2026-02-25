import { withFixtureGame } from "./lib/live-fixture.js";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

type JsonObject = Record<string, unknown>;

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let j = 0; j < 8; j += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([length, typeBytes, Buffer.from(data), crc]);
}

async function createSolidPng(path: string, width: number, height: number, rgb: [number, number, number]): Promise<void> {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x += 1) {
      const px = rowOffset + 1 + x * 3;
      raw[px] = rgb[0];
      raw[px + 1] = rgb[1];
      raw[px + 2] = rgb[2];
    }
  }

  const zlib = await import("node:zlib");
  const compressed = zlib.deflateSync(raw);
  const png = Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", new Uint8Array()),
  ]);
  await writeFile(path, png);
}

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
  await withFixtureGame("tgcmcp-component-update-global", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const tempDir = await mkdtemp(join(tmpdir(), "tgcmcp-update-global-"));
    const faceAPath = join(tempDir, "face-a-975x1350.png");
    const faceBPath = join(tempDir, "face-b-975x1350.png");

    await createSolidPng(faceAPath, 975, 1350, [0x2b, 0x64, 0x3a]);
    await createSolidPng(faceBPath, 975, 1350, [0x6d, 0x32, 0x2f]);

    const folder = await tgc.createFolder({ name: `update-global-assets-${new Date().toISOString()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");

    const faceAFileId = asString(
      (await tgc.uploadFile({ path: faceAPath, folderId, name: `update-global-a-${Date.now()}.png` })).id,
    );
    if (!faceAFileId) throw new Error("Failed to upload face A image.");

    const faceBFileId = asString(
      (await tgc.uploadFile({ path: faceBPath, folderId, name: `update-global-b-${Date.now()}.png` })).id,
    );
    if (!faceBFileId) throw new Error("Failed to upload face B image.");

    const originalName = "update-global-booster-original";
    const created = await tgc.createComponent({
      componentType: "boxface",
      gameId,
      name: originalName,
      identity: "PokerBooster",
      faceFileId: faceAFileId,
      quantity: 1,
    });

    const componentId = asString(created.id);
    if (!componentId) throw new Error("Create failed for boxface.");

    const revisedName = "update-global-booster-revised";
    await tgc.updateComponent({
      componentType: "boxface",
      componentId,
      name: revisedName,
      faceFileId: faceBFileId,
    });

    const boosters = await tgc.listGameComponents(gameId, "pokerboosters", 1, 100);
    const items = asItems(boosters.items);
    const matching = items.filter((item) => asString(item.id) === componentId);
    if (matching.length !== 1) {
      throw new Error("Expected exactly one pokerbooster component with same id after update.");
    }

    const resultName = asString(matching[0]?.name);
    if (resultName !== revisedName) {
      throw new Error(`Expected updated name '${revisedName}', got '${resultName}'.`);
    }

    console.log(`Verified in-place update for non-dice component: ${componentId}`);
  });

  console.log("Component update global non-dice integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-component-update-global-nondice failed: ${message}`);
  process.exitCode = 1;
});
