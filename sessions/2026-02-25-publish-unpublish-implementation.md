# Session: Publish/Unpublish Implementation

Date: 2026-02-25

## Objective
Implement `tgc_game_publish` and `tgc_game_unpublish` and validate behavior against live TGC API.

## Changes
- Implemented MCP handler cases:
  - `tgc_game_publish`
  - `tgc_game_unpublish`
  - file: `code/src/mcp/handlers.ts`
- Implemented service methods:
  - `publishGame(gameId)` -> `POST /api/game/{gameId}/public`
  - `unpublishGame(gameId)` -> `DELETE /api/game/{gameId}/public`
  - file: `code/src/tgc/service.ts`
- Added live integration probe script:
  - `code/scripts/dev/test-game-publish-unpublish.ts`
  - npm script: `test:integration:game-publish-unpublish`

## Validation Notes
- Live tests confirmed endpoint reachability and behavior.
- TGC publish is policy-gated for new fixture games (example gate: purchase requirement).
- Test handles these expected policy gates as a valid endpoint probe while still failing on unexpected errors.

## Docs/Roadmap Updates
- Updated tool contract docs in `tools/tgc-mcp-tool-contract-v1.md` with endpoint details and policy-gate notes.
- Updated `ROADMAP.md`:
  - `tgc_game_publish` marked implemented.
  - `tgc_game_unpublish` marked implemented.
