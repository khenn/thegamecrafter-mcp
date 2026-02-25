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

function findById(items: JsonObject[], id: string): JsonObject | null {
  return items.find((item) => asString(item.id) === id) ?? null;
}

async function main(): Promise<void> {
  await withFixtureGame("tgcmcp-component-update-dice", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const tempDir = await mkdtemp(join(tmpdir(), "tgcmcp-update-dice-"));
    const sideBasePath = join(tempDir, "side-base-180.png");
    const sideSwapPath = join(tempDir, "side-swap-180.png");

    await createSolidPng(sideBasePath, 180, 180, [0x26, 0x5a, 0x8f]);
    await createSolidPng(sideSwapPath, 180, 180, [0x8f, 0x35, 0x26]);

    const folder = await tgc.createFolder({ name: `update-dice-assets-${new Date().toISOString()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");

    const baseFileId = asString(
      (await tgc.uploadFile({ path: sideBasePath, folderId, name: `update-dice-base-${Date.now()}.png` })).id,
    );
    if (!baseFileId) throw new Error("Failed to upload base side image.");

    const swapFileId = asString(
      (await tgc.uploadFile({ path: sideSwapPath, folderId, name: `update-dice-swap-${Date.now()}.png` })).id,
    );
    if (!swapFileId) throw new Error("Failed to upload swap side image.");

    const created = await tgc.createComponent({
      componentType: "customcolord6",
      gameId,
      name: "update-dice-original",
      identity: "CustomColorD6",
      side1FileId: baseFileId,
      side2FileId: baseFileId,
      side3FileId: baseFileId,
      side4FileId: baseFileId,
      side5FileId: baseFileId,
      side6FileId: baseFileId,
    });

    const componentId = asString(created.id);
    if (!componentId) throw new Error("Create failed for customcolord6.");

    const updatedName = "update-dice-revised";
    await tgc.updateComponent({
      componentType: "customcolord6",
      componentId,
      name: updatedName,
      side3FileId: swapFileId,
      dieColor: "blue",
    });

    const d6List = await tgc.listGameComponents(gameId, "customcolord6s", 1, 100);
    const items = asItems(d6List.items);
    const updated = findById(items, componentId);
    if (!updated) throw new Error("Updated component id not found in customcolord6s list.");

    const resultName = asString(updated.name);
    if (resultName !== updatedName) {
      throw new Error(`Expected updated name '${updatedName}', got '${resultName}'.`);
    }

    const sameIdCount = items.filter((item) => asString(item.id) === componentId).length;
    if (sameIdCount !== 1) {
      throw new Error("Expected exactly one component with same id after update.");
    }

    console.log(`Verified in-place update for customcolord6: ${componentId}`);
  });

  console.log("Component update custom dice integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-component-update-custom-dice failed: ${message}`);
  process.exitCode = 1;
});
