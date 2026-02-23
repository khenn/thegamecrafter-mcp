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
  const bookletDir = "/home/khenny/tgcmcp/logs/batch2-pdf-sample/booklet_1575x2475";
  const perfectboundDir = "/home/khenny/tgcmcp/logs/batch2-pdf-sample/perfectbound_1725x2625";
  const perfectBlankPath = `${perfectboundDir}/blank-1725x2625.png`;

  const missing: string[] = [];
  for (let i = 1; i <= 11; i += 1) {
    if (!existsSync(pagePath(bookletDir, i))) missing.push(pagePath(bookletDir, i));
    if (!existsSync(pagePath(perfectboundDir, i))) missing.push(pagePath(perfectboundDir, i));
  }
  if (!existsSync(perfectBlankPath)) missing.push(perfectBlankPath);
  if (missing.length > 0) {
    throw new Error(`Missing page image assets. First missing: ${missing[0]}`);
  }

  const tgc = new TgcService(readEnvConfig());
  try {
    console.log("Logging in to TGC...");
    await tgc.login({});

    const designers = await tgc.listDesigners(1, 1);
    const designerId = asString(asItems(designers.items)[0]?.id);
    if (!designerId) throw new Error("No designer available for authenticated user.");

    const gameName = `tgcmcp-md-rulebook-first11-${new Date().toISOString()}`;
    console.log(`Creating game: ${gameName}`);
    const game = await tgc.createGame({ name: gameName, designerId });
    const gameId = asString(game.id);
    if (!gameId) throw new Error("Failed to create target game.");

    const folder = await tgc.createFolder({ name: `md-first11-assets-${Date.now()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");

    const booklet = await tgc.createComponent({
      componentType: "booklet",
      gameId,
      name: "MD Rulebook - Booklet",
      identity: "LargeBooklet",
      quantity: 1,
    });
    const bookletId = asString(booklet.id);
    if (!bookletId) throw new Error("Failed to create booklet.");

    const perfectbound = await tgc.createComponent({
      componentType: "perfectboundbook",
      gameId,
      name: "MD Rulebook - PerfectBound",
      identity: "DigestPerfectBoundBook",
      quantity: 1,
    });
    const perfectboundId = asString(perfectbound.id);
    if (!perfectboundId) throw new Error("Failed to create perfectboundbook.");

    console.log(`Created game ${gameId}`);
    console.log(`Booklet: ${bookletId}, PerfectBound: ${perfectboundId}`);

    for (let i = 1; i <= 10; i += 1) {
      const upload = await tgc.uploadFile({
        folderId,
        path: pagePath(bookletDir, i),
        name: `booklet-page-${String(i).padStart(2, "0")}.png`,
      });
      const imageId = asString(upload.id);
      if (!imageId) throw new Error(`Failed upload for booklet page ${i}.`);

      await tgc.createComponentPage({
        componentType: "bookletpage",
        parentId: bookletId,
        name: `MD Rulebook - Booklet Page ${i}`,
        frontFileId: imageId,
        sequenceNumber: i,
      });
    }
    console.log("Booklet pages created: 10");

    for (let i = 1; i <= 11; i += 1) {
      const upload = await tgc.uploadFile({
        folderId,
        path: pagePath(perfectboundDir, i),
        name: `perfectbound-page-${String(i).padStart(2, "0")}.png`,
      });
      const imageId = asString(upload.id);
      if (!imageId) throw new Error(`Failed upload for perfectbound page ${i}.`);

      await tgc.createComponentPage({
        componentType: "perfectboundbookpage",
        parentId: perfectboundId,
        name: `MD Rulebook - PerfectBound Page ${i}`,
        frontFileId: imageId,
        sequenceNumber: i,
      });
    }

    const blankUpload = await tgc.uploadFile({
      folderId,
      path: perfectBlankPath,
      name: "perfectbound-page-12-blank.png",
    });
    const blankImageId = asString(blankUpload.id);
    if (!blankImageId) throw new Error("Failed upload for blank page 12.");

    await tgc.createComponentPage({
      componentType: "perfectboundbookpage",
      parentId: perfectboundId,
      name: "MD Rulebook - PerfectBound Page 12 (Blank)",
      frontFileId: blankImageId,
      sequenceNumber: 12,
    });
    console.log("PerfectBound pages created: 12 (11 PDF + 1 blank)");

    const bookletPages = await tgc.listComponentItems("booklet", bookletId, "pages", 1, 50);
    const perfectPages = await tgc.listComponentItems("perfectboundbook", perfectboundId, "pages", 1, 50);

    console.log(
      JSON.stringify(
        {
          gameId,
          gameName,
          folderId,
          bookletId,
          bookletPageCount: asItems(bookletPages.items).length,
          perfectboundId,
          perfectboundPageCount: asItems(perfectPages.items).length,
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
  console.error(`test-batch2-pdf-first11-books failed: ${message}`);
  process.exitCode = 1;
});
