# The Game Crafter MCP - Feature Roadmap

This roadmap is for public `thegamecrafter-mcp` and is ordered for iterative delivery with testing after each milestone.

## Scope
- Focus on account-authoring workflows (create/manage your own games and assets).
- Keep public-catalog interaction secondary and avoid API usage patterns that may exceed intended use.
- Prioritize new-game build completeness over copy workflows.

## Current Baseline
- [x] MCP stdio server scaffold.
- [x] Auth/session tools (`tgc_auth_login`, `tgc_auth_logout`).
- [x] Read tools (`tgc_me`, `tgc_designer_list`, `tgc_game_get`, `tgc_game_list`).

## Milestone 1 - Game Foundation
- [x] Implement `tgc_game_create`.
- [x] Test gate:
  - Login works.
  - Create game succeeds with supplied `designerId`.
  - Created game is readable via `tgc_game_get`.

## Milestone 2 - Game Metadata Lifecycle
- [x] Implement `tgc_game_delete`.
- [x] Implement `tgc_game_update`.
- [x] Implement `tgc_game_copy`.
- [x] Test gate:
  - [x] Create/delete integration test leaves no residual test games.
  - [x] Patch updates are reflected on subsequent reads.
  - [x] Copy creates a new game with expected metadata.

## Milestone 3 - Asset Ingestion
- [x] Implement `tgc_folder_create`.
- [x] Implement `tgc_file_upload`.
- [x] Test gate:
  - [x] Folder creation and file upload IDs are reusable in later steps.

## Milestone 4 - Card Component Buildout
- [x] Implement `tgc_deck_create`.
- [x] Implement `tgc_card_create`.
- [x] Implement `tgc_deck_bulk_create_cards`.
- [x] Test gate:
  - [x] Deck/card creation works from uploaded art files.
  - [x] Bulk card creation maps to TGC `face_id`/`back_id` payload and preserves `face_id` in created cards.

## Milestone 5 - Part Linking and Cost Visibility
- [x] Implement `tgc_part_create`.
- [x] Implement `tgc_gamepart_upsert`.
- [ ] Implement `tgc_game_cost_breakdown_get`.
- [ ] Implement `tgc_game_bulk_pricing_get`.
- [ ] Test gate:
  - Linked parts appear in cost/pricing outputs.

## Milestone 5.5 - Complex Component Primitives (Generals-class Games)
- [x] Implement `tgc_game_components_list` (relationship-based component listing).
- [x] Implement `tgc_component_items_list` (set member listing).
- [x] Implement `tgc_component_create` (non-deck set/container creation).
- [x] Implement `tgc_component_item_create` (set member creation).
- [x] Test gate:
  - Live integration validates `twosidedset/twosided`.
  - Live integration validates `twosidedsluggedset/twosidedslugged`.
  - Live integration validates `onesidedsluggedset/onesidedslugged`.
- [ ] Next gate:
  - End-to-end `Generals-v2` reconstruction script copies all supported component families into a new game.

## Milestone 6 - Catalog Coverage And Build Completeness
- [x] Implement `tgc_tgc_products_list` (catalog discovery endpoint).
- [x] Add generated capability matrix (`tools/tgc-component-capability-matrix.md`) from live catalog data.
- [ ] Add public-game metadata reconnaissance script to sample component family payload shapes across public games.
- [ ] Add disposable synthetic fixture workflow for unsupported component families (create, verify, cleanup).
- [ ] Expand MCP write coverage for missing create APIs discovered in matrix.
  - [x] Packaging core coverage validated via `tgc_component_create`:
    - `/api/tuckbox`
    - `/api/hookbox`
    - `/api/twosidedbox`
    - `/api/boxtop`
    - `/api/boxtopgloss`
    - `/api/twosidedboxgloss`
    - `/api/boxface`
  - [x] Books/documents coverage validated:
    - `/api/document`
    - `/api/booklet`
    - `/api/bookletpage`
    - `/api/coilbook`
    - `/api/coilbookpage`
    - `/api/perfectboundbook`
    - `/api/perfectboundbookpage`
    - `/api/scorepad`
  - [x] Board/mat surface coverage validated:
    - `/api/onesided`
    - `/api/onesidedgloss`
- [ ] Add component-intelligence guidance layer for each implemented component family.
  - [x] Seeded for:
    - `LargeBooklet`
    - `DigestPerfectBoundBook`
    - Batch 1 packaging families
    - Batch 3 board/mat families
  - [ ] For every newly supported component family, add:
    - source URLs in skills/docs (`make/products`, `api/tgc/products`, and help/article link when present),
    - preflight validation rules (bounds, parity, required assets, finish options),
    - guided warning/correction prompts before mutation when requests violate constraints.
- [x] Test gate:
  - [x] For each newly added create API family, add a live integration probe that creates at least one valid component and verifies readback.

## Milestone 7 - Publish Readiness
- [ ] Implement `tgc_game_publish`.
- [ ] Implement `tgc_game_unpublish`.
- [ ] Implement `tgc_gamedownload_create`.
- [ ] Add `tgc_prepublish_check` workflow helper.
- [ ] Test gate:
  - Prepublish checks identify missing assets/settings before publish attempts.

## Milestone 8 - Workflow Automation
- [ ] Add `tgc_game_scaffold` workflow tool (manifest-driven game setup).
- [ ] Add resumable/idempotent behavior for multi-step workflows.
- [ ] Add optional manual-copy workflow helper as a lower-priority convenience feature.
- [ ] Test gate:
  - One manifest can produce a reproducible game skeleton.

## Milestone 9 - Hardening and Release
- [ ] Contract/integration tests for all implemented tools.
- [ ] CI for typecheck/build/tests.
- [ ] Retry/backoff and improved error diagnostics.
- [ ] Versioned releases and changelog discipline.
- [ ] Package and publish reusable Codex skill for Game Crafter guided workflows.

## Downstream Security Enhancements
- [ ] Optional local secret-manager integration for unattended operation.
- [ ] Auth mode documentation (interactive vs secret-store-backed).

## Not In Scope For Initial Releases
- Full UI/desktop frontend.
- Background daemon as required runtime.
- Implicit auto-publish without explicit user action.
