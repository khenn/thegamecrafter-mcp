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

async function createSolidPng(path: string, width: number, height: number): Promise<void> {
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
  const r = 0x3b;
  const g = 0x6a;
  const b = 0x8f;
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x += 1) {
      const px = rowOffset + 1 + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
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
  await withFixtureGame("tgcmcp-batch5-specialty", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const tempDir = await mkdtemp(join(tmpdir(), "tgcmcp-batch5-"));
    const acrylicPath = join(tempDir, "acrylic-2400x1200.png");
    const die300Path = join(tempDir, "die-300x300.png");
    const die180Path = join(tempDir, "die-180x180.png");
    const meeplePath = join(tempDir, "meeple-300x300.png");

    await createSolidPng(acrylicPath, 2400, 1200);
    await createSolidPng(die300Path, 300, 300);
    await createSolidPng(die180Path, 180, 180);
    await createSolidPng(meeplePath, 300, 300);

    const folder = await tgc.createFolder({
      name: `batch5-assets-${new Date().toISOString()}`,
    });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");

    const acrylicFileId = asString(
      (await tgc.uploadFile({ path: acrylicPath, folderId, name: `batch5-acrylic-${Date.now()}.png` })).id,
    );
    if (!acrylicFileId) throw new Error("Failed to upload acrylic image.");

    const die300FileId = asString(
      (await tgc.uploadFile({ path: die300Path, folderId, name: `batch5-die300-${Date.now()}.png` })).id,
    );
    if (!die300FileId) throw new Error("Failed to upload 300x300 die image.");

    const die180FileId = asString(
      (await tgc.uploadFile({ path: die180Path, folderId, name: `batch5-die180-${Date.now()}.png` })).id,
    );
    if (!die180FileId) throw new Error("Failed to upload 180x180 die image.");

    const meepleFileId = asString(
      (await tgc.uploadFile({ path: meeplePath, folderId, name: `batch5-meeple-${Date.now()}.png` })).id,
    );
    if (!meepleFileId) throw new Error("Failed to upload meeple image.");

    const acrylic = await tgc.createComponent({
      componentType: "acrylicshape",
      gameId,
      name: "batch5-acrylic-shape-125",
      identity: "AcrylicShape125",
      quantity: 1,
      side1FileId: acrylicFileId,
      side2FileId: acrylicFileId,
    });
    const acrylicId = asString(acrylic.id);
    if (!acrylicId) throw new Error("Create failed for acrylicshape.");
    const acrylicList = await tgc.listGameComponents(gameId, "acrylicshape125s", 1, 100);
    if (!asItems(acrylicList.items).some((item) => asString(item.id) === acrylicId)) {
      throw new Error("Verification failed for acrylicshape via acrylicshape125s.");
    }
    console.log(`Verified acrylicshape: ${acrylicId} (AcrylicShape125)`);

    const d4 = await tgc.createComponent({
      componentType: "customcolord4",
      gameId,
      name: "batch5-custom-d4",
      identity: "CustomColorD4",
      quantity: 1,
      side1FileId: die300FileId,
      side2FileId: die300FileId,
      side3FileId: die300FileId,
      side4FileId: die300FileId,
    });
    const d4Id = asString(d4.id);
    if (!d4Id) throw new Error("Create failed for customcolord4.");
    const d4List = await tgc.listGameComponents(gameId, "customcolord4s", 1, 100);
    if (!asItems(d4List.items).some((item) => asString(item.id) === d4Id)) {
      throw new Error("Verification failed for customcolord4 via customcolord4s.");
    }
    console.log(`Verified customcolord4: ${d4Id} (CustomColorD4)`);

    const d6 = await tgc.createComponent({
      componentType: "customcolord6",
      gameId,
      name: "batch5-custom-d6",
      identity: "CustomColorD6",
      quantity: 1,
      side1FileId: die180FileId,
      side2FileId: die180FileId,
      side3FileId: die180FileId,
      side4FileId: die180FileId,
      side5FileId: die180FileId,
      side6FileId: die180FileId,
    });
    const d6Id = asString(d6.id);
    if (!d6Id) throw new Error("Create failed for customcolord6.");
    const d6List = await tgc.listGameComponents(gameId, "customcolord6s", 1, 100);
    if (!asItems(d6List.items).some((item) => asString(item.id) === d6Id)) {
      throw new Error("Verification failed for customcolord6 via customcolord6s.");
    }
    console.log(`Verified customcolord6: ${d6Id} (CustomColorD6)`);

    const d8 = await tgc.createComponent({
      componentType: "customcolord8",
      gameId,
      name: "batch5-custom-d8",
      identity: "CustomColorD8",
      quantity: 1,
      side1FileId: die300FileId,
      side2FileId: die300FileId,
      side3FileId: die300FileId,
      side4FileId: die300FileId,
      side5FileId: die300FileId,
      side6FileId: die300FileId,
      side7FileId: die300FileId,
      side8FileId: die300FileId,
    });
    const d8Id = asString(d8.id);
    if (!d8Id) throw new Error("Create failed for customcolord8.");
    const d8List = await tgc.listGameComponents(gameId, "customcolord8s", 1, 100);
    if (!asItems(d8List.items).some((item) => asString(item.id) === d8Id)) {
      throw new Error("Verification failed for customcolord8 via customcolord8s.");
    }
    console.log(`Verified customcolord8: ${d8Id} (CustomColorD8)`);

    const meeple = await tgc.createComponent({
      componentType: "customprintedmeeple",
      gameId,
      name: "batch5-custom-meeple",
      identity: "CustomPrintedMeeple",
      quantity: 1,
      faceFileId: meepleFileId,
      backFileId: meepleFileId,
    });
    const meepleId = asString(meeple.id);
    if (!meepleId) throw new Error("Create failed for customprintedmeeple.");
    const meepleList = await tgc.listGameComponents(gameId, "customprintedmeeples", 1, 100);
    if (!asItems(meepleList.items).some((item) => asString(item.id) === meepleId)) {
      throw new Error("Verification failed for customprintedmeeple via customprintedmeeples.");
    }
    console.log(`Verified customprintedmeeple: ${meepleId} (CustomPrintedMeeple)`);
  });

  console.log("Batch 5 specialty parts integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch5-specialty-parts failed: ${message}`);
  process.exitCode = 1;
});
