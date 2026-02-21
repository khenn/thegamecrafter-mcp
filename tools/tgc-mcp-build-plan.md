# TGC MCP Build Plan

## Purpose
Build a public MCP server that wraps The Game Crafter Developer API for AI-driven game creation and maintenance workflows.

## API Constraints To Design Around
- Auth uses `POST /api/session` with `username`, `password`, and `api_key_id`.
- SSO flow exists via `/sso` plus `POST /api/session/sso/xxx`.
- Rate limit guidance: avoid exceeding 240 requests/minute (4 req/s) to prevent `500` errors.
- Wing responses are wrapped (`result` or `error`) and support `_include_*` and paging patterns.
- Changelog latest major notes are from 2021; docs include some legacy/deprecated sections and occasional formatting issues.

## MCP Scope (Initial)
- Session/auth lifecycle
- User/designer/game discovery
- Folder + file upload
- Game lifecycle (create/update/fetch/copy/publish/unpublish)
- Component creation for common flows (deck/card first)
- Part + gamepart linking
- Game downloads + pricing/cost inspection

## Server Architecture
- Runtime: TypeScript, Node 20+, `@modelcontextprotocol/sdk`.
- Layers:
  - `src/mcp/`: tool registrations and schemas
  - `src/tgc/client/`: HTTP client + Wing response parsing
  - `src/tgc/endpoints/`: typed endpoint wrappers
  - `src/domain/`: higher-level workflows (e.g., create deck with cards)
  - `src/config/`: environment parsing + defaults
- Cross-cutting:
  - Token-bucket rate limiter (default 3 req/s, burst 6)
  - Retry policy for transient failures (`500`, network timeouts)
  - Strong input validation (zod/json schema)
  - Structured error mapping to MCP-friendly messages

## Proposed MCP Tools (v1)
- `tgc_auth_login`
- `tgc_auth_logout`
- `tgc_me`
- `tgc_designer_list`
- `tgc_game_create`
- `tgc_game_update`
- `tgc_game_get`
- `tgc_game_copy`
- `tgc_game_publish`
- `tgc_game_unpublish`
- `tgc_folder_create`
- `tgc_file_upload`
- `tgc_deck_create`
- `tgc_card_create`
- `tgc_deck_bulk_create_cards`
- `tgc_part_create`
- `tgc_gamepart_upsert`
- `tgc_gamedownload_create`
- `tgc_game_bulk_pricing_get`
- `tgc_game_cost_breakdown_get`
- `tgc_tgc_products_list`

## Workflow Tools (v1.1)
- `tgc_game_scaffold`: create game, folder, optional starter deck.
- `tgc_deck_from_image_grid`: upload grid image and bulk-create cards.
- `tgc_prepublish_check`: verify required fields/assets and identify missing pieces.

## Delivery Phases
1. Project Bootstrap
- Initialize TS package, lint/test, build, and MCP stdio entrypoint.
- Add env contract and startup validation.

2. Core Client
- Implement authenticated request helper and Wing response unwrapping.
- Add paging helper and generic relationship include support.

3. Auth + Discovery Tools
- Deliver login/logout/me/designer/game read-only tools.
- Add integration tests against a stub transport.

4. Authoring Tools
- Add folder/file upload and game create/update/copy/publish flows.
- Add component endpoints for deck/card and gamepart links.

5. Reliability + UX
- Add retries, idempotency guidance, backoff, and richer error handling.
- Add dry-run mode for multi-step workflows.

6. Public Release
- Docs: install, auth setup, example prompts, safety notes.
- GitHub CI (lint, typecheck, test), semantic versioning, changelog.

## Testing Strategy
- Unit tests: schema validation, response parsing, error normalization.
- Contract tests: mock Wing API responses for each endpoint wrapper.
- Scenario tests: create game -> upload file -> create deck/cards -> publish.
- Manual smoke tests with a sandbox TGC account and low-volume request pacing.

## Open Questions Before Implementation
- Runtime target: MCP stdio only, or stdio + HTTP transport.
- Session management policy: per-call credentials vs persisted session cache.
- Scope of v1 components: only deck/card, or include boards/books early.
- Desired default permissions profile for SSO-enabled usage.
