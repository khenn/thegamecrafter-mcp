import { withFixtureGame } from "./lib/live-fixture.js";
import { TgcApiError } from "../../src/tgc/client.js";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x += 1) {
      const px = rowOffset + 1 + x * 3;
      raw[px] = 0x4e;
      raw[px + 1] = 0x6b;
      raw[px + 2] = 0x88;
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

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function main(): Promise<void> {
  await withFixtureGame("tgcmcp-publish-unpublish", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    // Publish requires a box in game configuration; create a minimal tuckbox first.
    const tempDir = await mkdtemp(join(tmpdir(), "tgcmcp-publish-"));
    const boxPath = join(tempDir, "box-outside-2325x1950.png");
    await createSolidPng(boxPath, 2325, 1950);

    const folder = await tgc.createFolder({ name: `publish-assets-${new Date().toISOString()}` });
    const folderId = asString(folder.id);
    if (!folderId) {
      throw new Error("Failed to create folder for publish test assets.");
    }

    const upload = await tgc.uploadFile({ path: boxPath, folderId, name: `publish-box-${Date.now()}.png` });
    const outsideFileId = asString(upload.id);
    if (!outsideFileId) {
      throw new Error("Failed to upload box art.");
    }

    await tgc.createComponent({
      componentType: "tuckbox",
      gameId,
      name: "publish-test-box",
      identity: "PokerTuckBox54",
      outsideFileId,
      quantity: 1,
      hasProofedOutside: true,
    });

    await tgc.updateGame(gameId, {
      description: "Fixture publish/unpublish validation game.",
      minPlayers: 1,
      maxPlayers: 4,
      playTime: "30-60",
      shortDescription: "Fixture publish test.",
      minAge: "14+",
    });

    let published = false;
    try {
      published = await tgc.publishGame(gameId);
      console.log(`Published game: ${gameId}`);
    } catch (error: unknown) {
      if (error instanceof TgcApiError) {
        const message = error.message.toLowerCase();
        const isPolicyGate =
          message.includes("must purchase a copy") || message.includes("has not been fully proofed");
        if (isPolicyGate) {
          console.log(`Publish endpoint reached; policy gate encountered as expected: ${error.message}`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    if (published) {
      const unpublished = await tgc.unpublishGame(gameId);
      if (!unpublished) {
        throw new Error("Expected unpublishGame to return true.");
      }
      console.log(`Unpublished game: ${gameId}`);
    } else {
      try {
        await tgc.unpublishGame(gameId);
        console.log(`Unpublish endpoint accepted for unpublished game: ${gameId}`);
      } catch (error: unknown) {
        if (error instanceof TgcApiError) {
          const message = error.message.toLowerCase();
          if (message.includes("resource not found")) {
            console.log(`Unpublish endpoint reached; expected state gate encountered: ${error.message}`);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }
  });

  console.log("Game publish/unpublish integration test passed.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-game-publish-unpublish failed: ${message}`);
  process.exitCode = 1;
});
