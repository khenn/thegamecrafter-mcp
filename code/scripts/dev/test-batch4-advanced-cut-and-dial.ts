import { withFixtureGame } from "./lib/live-fixture.js";
import { mkdtemp } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
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
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = 1 + width * 3; // filter byte + RGB pixels
  const raw = Buffer.alloc(rowSize * height);
  const r = 0x2d;
  const g = 0x5b;
  const b = 0x8a;
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // no filter
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
  await withFixtureGame("tgcmcp-batch4-advanced", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const tempDir = await mkdtemp(join(tmpdir(), "tgcmcp-batch4-"));
    const dialPath = join(tempDir, "dial-825x2400.png");
    const customPath = join(tempDir, "custom-975x1575.png");
    const dualLayerPath = join(tempDir, "duallayer-1125x1725.png");

    await createSolidPng(dialPath, 825, 2400);
    await createSolidPng(customPath, 975, 1575);
    await createSolidPng(dualLayerPath, 1125, 1725);

    const folder = await tgc.createFolder({
      name: `batch4-assets-${new Date().toISOString()}`,
    });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");

    const dialUpload = await tgc.uploadFile({
      path: dialPath,
      folderId,
      name: `batch4-dial-${Date.now()}.png`,
    });
    const dialFileId = asString(dialUpload.id);
    if (!dialFileId) throw new Error("Failed to upload dial image.");

    const customUpload = await tgc.uploadFile({
      path: customPath,
      folderId,
      name: `batch4-custom-${Date.now()}.png`,
    });
    const customFileId = asString(customUpload.id);
    if (!customFileId) throw new Error("Failed to upload custom-cut image.");

    const dualLayerUpload = await tgc.uploadFile({
      path: dualLayerPath,
      folderId,
      name: `batch4-duallayer-${Date.now()}.png`,
    });
    const dualLayerFileId = asString(dualLayerUpload.id);
    if (!dualLayerFileId) throw new Error("Failed to upload dual-layer image.");

    const dial = await tgc.createComponent({
      componentType: "dial",
      gameId,
      name: "batch4-dial",
      identity: "SmallDial",
      quantity: 1,
      outsideFileId: dialFileId,
    });
    const dialId = asString(dial.id);
    if (!dialId) throw new Error("Create failed for dial.");
    const dialList = await tgc.listGameComponents(gameId, "smalldials", 1, 100);
    if (!asItems(dialList.items).some((item) => asString(item.id) === dialId)) {
      throw new Error("Verification failed for dial via smalldials.");
    }
    console.log(`Verified dial: ${dialId} (SmallDial)`);

    const sticker = await tgc.createComponent({
      componentType: "customcutonesidedslugged",
      gameId,
      name: "batch4-custom-onesided",
      identity: "CustomSmallSticker",
      quantity: 1,
      faceFileId: customFileId,
    });
    const stickerId = asString(sticker.id);
    if (!stickerId) throw new Error("Create failed for customcutonesidedslugged.");
    const stickerList = await tgc.listGameComponents(gameId, "customsmallstickers", 1, 100);
    if (!asItems(stickerList.items).some((item) => asString(item.id) === stickerId)) {
      throw new Error("Verification failed for customcutonesidedslugged via customsmallstickers.");
    }
    console.log(`Verified customcutonesidedslugged: ${stickerId} (CustomSmallSticker)`);

    const punchout = await tgc.createComponent({
      componentType: "customcuttwosidedslugged",
      gameId,
      name: "batch4-custom-twosided",
      identity: "CustomSmallPunchout",
      quantity: 1,
      faceFileId: customFileId,
      backFileId: customFileId,
    });
    const punchoutId = asString(punchout.id);
    if (!punchoutId) throw new Error("Create failed for customcuttwosidedslugged.");
    const punchoutList = await tgc.listGameComponents(gameId, "customsmallpunchouts", 1, 100);
    if (!asItems(punchoutList.items).some((item) => asString(item.id) === punchoutId)) {
      throw new Error("Verification failed for customcuttwosidedslugged via customsmallpunchouts.");
    }
    console.log(`Verified customcuttwosidedslugged: ${punchoutId} (CustomSmallPunchout)`);

    const dualLayerSet = await tgc.createComponent({
      componentType: "threesidedcustomcutset",
      gameId,
      name: "batch4-dual-layer-set",
      identity: "SmallDualLayerBoard",
      quantity: 1,
      faceFileId: dualLayerFileId,
      backFileId: dualLayerFileId,
      innerFileId: dualLayerFileId,
    });
    const dualLayerSetId = asString(dualLayerSet.id);
    if (!dualLayerSetId) throw new Error("Create failed for threesidedcustomcutset.");
    const dualLayerSetList = await tgc.listGameComponents(gameId, "smallduallayerboards", 1, 100);
    if (!asItems(dualLayerSetList.items).some((item) => asString(item.id) === dualLayerSetId)) {
      throw new Error("Verification failed for threesidedcustomcutset via smallduallayerboards.");
    }
    console.log(`Verified threesidedcustomcutset: ${dualLayerSetId} (SmallDualLayerBoard)`);

    const dualLayerMember = await tgc.createComponentItem({
      componentType: "threesidedcustomcut",
      setId: dualLayerSetId,
      name: "batch4-dual-layer-member",
      frontFileId: dualLayerFileId,
      backFileId: dualLayerFileId,
      innerFileId: dualLayerFileId,
      quantity: 1,
    });
    const dualLayerMemberId = asString(dualLayerMember.id);
    if (!dualLayerMemberId) throw new Error("Create failed for threesidedcustomcut member.");

    const memberList = await tgc.listComponentItems(
      "threesidedcustomcutset",
      dualLayerSetId,
      "members",
      1,
      100,
    );
    if (!asItems(memberList.items).some((item) => asString(item.id) === dualLayerMemberId)) {
      throw new Error("Verification failed for threesidedcustomcut via members.");
    }
    console.log(`Verified threesidedcustomcut member: ${dualLayerMemberId} (members)`);
  });

  console.log("Batch 4 advanced cut and dial integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch4-advanced-cut-and-dial failed: ${message}`);
  process.exitCode = 1;
});
