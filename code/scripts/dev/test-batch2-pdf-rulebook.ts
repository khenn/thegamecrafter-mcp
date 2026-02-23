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
  const bookletDir = "/home/khenny/tgcmcp/logs/batch2-pdf-test/booklet_1575x2475";
  const perfectboundDir = "/home/khenny/tgcmcp/logs/batch2-pdf-test/perfectbound_1725x2625";
  const blankPath = `${perfectboundDir}/blank-1725x2625.png`;
  const totalPdfPages = 46;

  const missing: string[] = [];
  for (let i = 1; i <= totalPdfPages; i += 1) {
    const b = pagePath(bookletDir, i);
    const p = pagePath(perfectboundDir, i);
    if (!existsSync(b)) missing.push(b);
    if (!existsSync(p)) missing.push(p);
  }
  if (!existsSync(blankPath)) missing.push(blankPath);
  if (missing.length > 0) {
    throw new Error(`Missing required converted page assets. First missing: ${missing[0]}`);
  }

  const tgc = new TgcService(readEnvConfig());
  let gameId = "";
  let gameName = "";

  try {
    console.log("Logging in to TGC...");
    await tgc.login({});

    const designers = await tgc.listDesigners(1, 1);
    const designerId = asString(asItems(designers.items)[0]?.id);
    if (!designerId) throw new Error("No designer available for authenticated user.");

    gameName = `tgcmcp-md-rulebook-import-${new Date().toISOString()}`;
    console.log(`Creating game: ${gameName}`);
    const game = await tgc.createGame({ name: gameName, designerId });
    gameId = asString(game.id);
    if (!gameId) throw new Error("Failed to create target game.");

    const folder = await tgc.createFolder({ name: `md-rulebook-assets-${Date.now()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create asset folder.");
    console.log(`Created game ${gameId} and asset folder ${folderId}`);

    const booklet = await tgc.createComponent({
      componentType: "booklet",
      gameId,
      name: "MD Rulebook Booklet",
      identity: "LargeBooklet",
      quantity: 1,
    });
    const bookletId = asString(booklet.id);
    if (!bookletId) throw new Error("Failed to create booklet component.");

    const perfectbound = await tgc.createComponent({
      componentType: "perfectboundbook",
      gameId,
      name: "MD Rulebook PerfectBound",
      identity: "DigestPerfectBoundBook",
      quantity: 1,
    });
    const perfectboundId = asString(perfectbound.id);
    if (!perfectboundId) throw new Error("Failed to create perfectboundbook component.");
    console.log(`Created components booklet=${bookletId}, perfectbound=${perfectboundId}`);

    for (let i = 1; i <= totalPdfPages; i += 1) {
      const sourcePath = pagePath(bookletDir, i);
      const upload = await tgc.uploadFile({
        folderId,
        path: sourcePath,
        name: `booklet-page-${String(i).padStart(2, "0")}.png`,
      });
      const faceFileId = asString(upload.id);
      if (!faceFileId) throw new Error(`Failed booklet upload for page ${i}.`);

      await tgc.createComponentPage({
        componentType: "bookletpage",
        parentId: bookletId,
        name: `Booklet Page ${i}`,
        frontFileId: faceFileId,
      });
      if (i % 5 === 0 || i === totalPdfPages) {
        console.log(`Booklet progress: ${i}/${totalPdfPages}`);
      }
    }

    for (let i = 1; i <= totalPdfPages; i += 1) {
      const sourcePath = pagePath(perfectboundDir, i);
      const upload = await tgc.uploadFile({
        folderId,
        path: sourcePath,
        name: `perfectbound-page-${String(i).padStart(2, "0")}.png`,
      });
      const faceFileId = asString(upload.id);
      if (!faceFileId) throw new Error(`Failed perfectbound upload for page ${i}.`);

      await tgc.createComponentPage({
        componentType: "perfectboundbookpage",
        parentId: perfectboundId,
        name: `PerfectBound Page ${i}`,
        frontFileId: faceFileId,
      });
      if (i % 5 === 0 || i === totalPdfPages) {
        console.log(`PerfectBound progress: ${i}/${totalPdfPages}`);
      }
    }

    const blankUpload = await tgc.uploadFile({
      folderId,
      path: blankPath,
      name: "perfectbound-page-47-blank.png",
    });
    const blankFileId = asString(blankUpload.id);
    if (!blankFileId) throw new Error("Failed to upload blank trailing page.");

    await tgc.createComponentPage({
      componentType: "perfectboundbookpage",
      parentId: perfectboundId,
      name: "PerfectBound Page 47 (Blank)",
      frontFileId: blankFileId,
    });

    const bookletPages = await tgc.listComponentItems("booklet", bookletId, "pages", 1, 100);
    const perfectPages = await tgc.listComponentItems("perfectboundbook", perfectboundId, "pages", 1, 100);

    const bookletCount = asItems(bookletPages.items).length;
    const perfectCount = asItems(perfectPages.items).length;

    console.log(JSON.stringify({
      gameId,
      gameName,
      folderId,
      bookletId,
      bookletCount,
      perfectboundId,
      perfectCount,
      expectedBookletCount: totalPdfPages,
      expectedPerfectboundCount: totalPdfPages + 1,
    }, null, 2));
  } finally {
    await tgc.logout().catch(() => {});
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch2-pdf-rulebook failed: ${message}`);
  process.exitCode = 1;
});
