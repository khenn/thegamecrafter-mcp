# Session: Bulk Card `face_id` Fix and Validation

## Summary
- Fixed `tgc_deck_bulk_create_cards` payload normalization so bulk-created cards retain `face_id` on TGC.
- Fixed `tgc_deck_create` mapping for `hasProofedBack` (`boolean` input now maps to TGC-required `0/1` form value).
- Added an integration script that verifies bulk create writes `face_id` and cleans up test resources.

## Code Changes
- `code/src/mcp/handlers.ts`
  - Replaced loose bulk card schema with explicit card schema.
  - Added normalization for bulk card aliases:
    - input aliases: `frontFileId` / `faceFileId` / `face_id`
    - mapped output: `face_id`
    - optional `backFileId` / `back_id` mapped to `back_id`
    - optional `classNumber` / `class_number` mapped to `class_number`
- `code/src/tgc/service.ts`
  - `createDeck`: map `hasProofedBack` boolean -> `has_proofed_back` numeric (`1`/`0`).
  - `bulkCreateCards`: typed input for TGC-native card payload fields.
- `code/src/mcp/contract.ts`
  - Tightened `tgc_deck_bulk_create_cards` card schema (explicit fields, max 100).
- `code/package.json`
  - Added script: `test:integration:deck-bulk-create-cards`.
- `code/scripts/dev/test-deck-bulk-create-cards.ts`
  - New integration test with automatic cleanup.

## Verification
- `npm run typecheck` passed.
- `npm run test:integration:deck-bulk-create-cards` passed:
  - Created disposable game/deck.
  - Bulk-created probe card.
  - Verified returned card had expected `face_id`.
  - Deleted disposable game in cleanup.

## Docs Updated
- `ROADMAP.md`: marked milestone-4 implementation items complete; added bulk `face_id` test gate note.
- `skills/tgc-guided-workflows/SKILL.md`: added bulk card input/guardrail notes.
- `tools/tgc-mcp-tool-contract-v1.md`: documented per-card bulk fields and max size.
