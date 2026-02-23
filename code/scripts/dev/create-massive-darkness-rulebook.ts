import { existsSync } from "node:fs";
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

function pagePath(dir: string, index: number): string {
  return `${dir}/page-${String(index).padStart(2, "0")}.png`;
}

async function main(): Promise<void> {
  const tgc = new TgcService(readEnvConfig());
  const perfectboundDir = "/home/khenny/tgcmcp/logs/batch2-pdf-test/perfectbound_1725x2625";
  const pageCount = 46;

  for (let i = 1; i <= pageCount; i += 1) {
    const p = pagePath(perfectboundDir, i);
    if (!existsSync(p)) {
      throw new Error(`Missing page image: ${p}`);
    }
  }

  try {
    console.log("Logging in to TGC...");
    await tgc.login({});

    const designers = await tgc.listDesigners(1, 1);
    const designerId = asString(asItems(designers.items)[0]?.id);
    if (!designerId) throw new Error("No designer available for authenticated user.");

    console.log("Creating game: Massive Darkness");
    const game = await tgc.createGame({
      name: "Massive Darkness",
      designerId,
    });
    const gameId = asString(game.id);
    if (!gameId) throw new Error("Failed to create game.");

    const folder = await tgc.createFolder({ name: `massive-darkness-rulebook-assets-${Date.now()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create assets folder.");

    const book = await tgc.createComponent({
      componentType: "perfectboundbook",
      gameId,
      name: "MD Rulebook - PerfectBound",
      identity: "DigestPerfectBoundBook",
      quantity: 1,
    });
    const bookId = asString(book.id);
    if (!bookId) throw new Error("Failed to create perfect bound book.");

    for (let i = 1; i <= pageCount; i += 1) {
      const upload = await tgc.uploadFile({
        folderId,
        path: pagePath(perfectboundDir, i),
        name: `md-rulebook-page-${String(i).padStart(2, "0")}.png`,
      });
      const imageId = asString(upload.id);
      if (!imageId) throw new Error(`Upload failed for page ${i}.`);

      await tgc.createComponentPage({
        componentType: "perfectboundbookpage",
        parentId: bookId,
        name: `MD Rulebook Page ${i}`,
        frontFileId: imageId,
        sequenceNumber: i,
      });

      if (i % 10 === 0 || i === pageCount) {
        console.log(`Page progress: ${i}/${pageCount}`);
      }
    }

    const pages = await tgc.listComponentItems("perfectboundbook", bookId, "pages", 1, 100);
    const pageTotal = asItems(pages.items).length;

    console.log(
      JSON.stringify(
        {
          gameId,
          gameName: "Massive Darkness",
          folderId,
          perfectboundBookId: bookId,
          pageTotal,
        },
        null,
        2,
      ),
    );
  } finally {
    await tgc.logout().catch(() => {});
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`create-massive-darkness-rulebook failed: ${message}`);
  process.exitCode = 1;
});
