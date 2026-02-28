# Session: Security Roadmap Items Completed

Date: 2026-02-28

## Scope
Completed the three private pre-Goal-B security items.

## Changes
1. Corrected security wording in `tools/codex-mcp-local-setup.md`:
- Removed inaccurate claim that secrets are not stored.
- Added explicit warning that client behavior may persist resolved env values.

2. Removed session-id logging from dev integration scripts:
- `code/scripts/dev/test-game-create-delete.ts`
- `code/scripts/dev/test-deck-bulk-create-cards.ts`
- `code/scripts/dev/test-zch-manual-copy-e2e.ts`

3. Added defensive error-detail sanitization in MCP handler error paths:
- `code/src/mcp/handlers.ts`
- Redacts values for sensitive keys before returning `TgcApiError.details`.

## Validation
- Ran TypeScript build: `cd code && npm run build` (pass).

## Private Tracking
- Local private checklist marked complete in `subprojects/private-roadmap-security.md` (gitignored).
