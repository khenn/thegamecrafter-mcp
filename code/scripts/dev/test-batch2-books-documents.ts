import { withFixtureGame } from "./lib/live-fixture.js";

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

async function main(): Promise<void> {
  await withFixtureGame("tgcmcp-batch2-books-docs", async ({ tgc, gameId, gameName }) => {
    console.log(`Fixture game created: ${gameName} (${gameId})`);

    const folder = await tgc.createFolder({ name: `batch2-assets-${Date.now()}` });
    const folderId = asString(folder.id);
    if (!folderId) throw new Error("Failed to create assets folder.");

    const upload = await tgc.uploadFile({
      folderId,
      path: "/home/khenny/tgcmcp/logs/batch1-images/test-image-2325x1950.png",
      name: `batch2-page-face-${Date.now()}.png`,
    });
    const faceFileId = asString(upload.id);
    if (!faceFileId) throw new Error("Failed to upload page face asset.");

    const document = await tgc.createComponent({
      componentType: "document",
      gameId,
      name: "Batch2 Document",
      identity: "Document",
      quantity: 1,
      faceFileId,
    });
    const documentId = asString(document.id);
    if (!documentId) throw new Error("Failed to create document.");

    const booklet = await tgc.createComponent({
      componentType: "booklet",
      gameId,
      name: "Batch2 Booklet",
      identity: "LargeBooklet",
      quantity: 1,
    });
    const bookletId = asString(booklet.id);
    if (!bookletId) throw new Error("Failed to create booklet.");

    const coilbook = await tgc.createComponent({
      componentType: "coilbook",
      gameId,
      name: "Batch2 CoilBook",
      identity: "MediumCoilBook",
      quantity: 1,
    });
    const coilbookId = asString(coilbook.id);
    if (!coilbookId) throw new Error("Failed to create coilbook.");

    const perfectboundbook = await tgc.createComponent({
      componentType: "perfectboundbook",
      gameId,
      name: "Batch2 PerfectBound",
      identity: "DigestPerfectBoundBook",
      quantity: 1,
    });
    const perfectboundbookId = asString(perfectboundbook.id);
    if (!perfectboundbookId) throw new Error("Failed to create perfectboundbook.");

    const scorepad = await tgc.createComponent({
      componentType: "scorepad",
      gameId,
      name: "Batch2 ScorePad",
      identity: "MediumScorePadColor",
      quantity: 1,
    });
    const scorepadId = asString(scorepad.id);
    if (!scorepadId) throw new Error("Failed to create scorepad.");

    const bookletPage = await tgc.createComponentPage({
      componentType: "bookletpage",
      parentId: bookletId,
      name: "Batch2 Booklet Page 1",
      frontFileId: faceFileId,
    });
    const bookletPageId = asString(bookletPage.id);
    if (!bookletPageId) throw new Error("Failed to create booklet page.");

    const coilbookPage = await tgc.createComponentPage({
      componentType: "coilbookpage",
      parentId: coilbookId,
      name: "Batch2 CoilBook Page 1",
      frontFileId: faceFileId,
    });
    const coilbookPageId = asString(coilbookPage.id);
    if (!coilbookPageId) throw new Error("Failed to create coilbook page.");

    const perfectboundbookPage = await tgc.createComponentPage({
      componentType: "perfectboundbookpage",
      parentId: perfectboundbookId,
      name: "Batch2 PerfectBound Page 1",
      frontFileId: faceFileId,
    });
    const perfectboundbookPageId = asString(perfectboundbookPage.id);
    if (!perfectboundbookPageId) throw new Error("Failed to create perfectboundbook page.");

    const docs = await tgc.listGameComponents(gameId, "documents", 1, 50);
    const docsFound = asItems(docs.items).some((item) => asString(item.id) === documentId);
    if (!docsFound) throw new Error("Verification failed: document missing.");

    const booklets = await tgc.listGameComponents(gameId, "booklets", 1, 50);
    const bookletFound = asItems(booklets.items).some((item) => asString(item.id) === bookletId);
    if (!bookletFound) throw new Error("Verification failed: booklet missing.");

    const coilbooks = await tgc.listGameComponents(gameId, "coilbooks", 1, 50);
    const coilFound = asItems(coilbooks.items).some((item) => asString(item.id) === coilbookId);
    if (!coilFound) throw new Error("Verification failed: coilbook missing.");

    const perfectboundbooks = await tgc.listGameComponents(gameId, "perfectboundbooks", 1, 50);
    const perfectFound = asItems(perfectboundbooks.items).some(
      (item) => asString(item.id) === perfectboundbookId,
    );
    if (!perfectFound) throw new Error("Verification failed: perfectboundbook missing.");

    const scorepads = await tgc.listGameComponents(gameId, "scorepads", 1, 50);
    const scorepadFound = asItems(scorepads.items).some((item) => asString(item.id) === scorepadId);
    if (!scorepadFound) throw new Error("Verification failed: scorepad missing.");

    const bookletPages = await tgc.listComponentItems("booklet", bookletId, "pages", 1, 50);
    const bookletPageFound = asItems(bookletPages.items).some(
      (item) => asString(item.id) === bookletPageId,
    );
    if (!bookletPageFound) throw new Error("Verification failed: bookletpage missing.");

    const coilbookPages = await tgc.listComponentItems("coilbook", coilbookId, "pages", 1, 50);
    const coilbookPageFound = asItems(coilbookPages.items).some(
      (item) => asString(item.id) === coilbookPageId,
    );
    if (!coilbookPageFound) throw new Error("Verification failed: coilbookpage missing.");

    const perfectboundbookPages = await tgc.listComponentItems(
      "perfectboundbook",
      perfectboundbookId,
      "pages",
      1,
      50,
    );
    const perfectboundbookPageFound = asItems(perfectboundbookPages.items).some(
      (item) => asString(item.id) === perfectboundbookPageId,
    );
    if (!perfectboundbookPageFound) throw new Error("Verification failed: perfectboundbookpage missing.");

    console.log("Batch 2 books/documents integration test passed.");
  });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`test-batch2-books-documents failed: ${message}`);
  process.exitCode = 1;
});
