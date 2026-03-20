# Goal B1 Tool Coverage Inventory

Date: 2026-03-18

## Purpose
Define the exact implemented MCP tool surface for Goal B1 and record the current verification baseline before adding automated offline tests, reliability hardening, and CI gates.

This file is for internal quality work. It does not change the public MCP tool contract.

## Baseline
- Implemented MCP tools: `41`
- Public contract source: [code/src/mcp/contract.ts](/home/khenny/tgcmcp/code/src/mcp/contract.ts)
- Handler source: [code/src/mcp/handlers.ts](/home/khenny/tgcmcp/code/src/mcp/handlers.ts)
- Current automated `vitest` coverage: contract coverage for all tools, exhaustive offline handler coverage for all implemented tools, and deterministic client reliability tests
- Current live/manual verification: ad hoc `code/scripts/dev/*.ts` harnesses plus A5 guidance tests
- Current deterministic local checks:
  - `npm --prefix code run typecheck`
  - `npm --prefix code run build`
  - `npm --prefix code run a5:test` when auth env and runtime constraints are available

## Test Lane Definitions
- `contract`: schema and public tool list regression tests, no network
- `offline-handler`: `executeTool` coverage with mocked `TgcService`, no network
- `live-smoke`: opt-in real TGC verification for representative end-to-end paths

## Family Inventory

### 1. Auth / Session
Tools:
- `tgc_auth_login`
- `tgc_auth_logout`
- `tgc_me`
- `tgc_designer_list`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-game-create-delete.ts](/home/khenny/tgcmcp/code/scripts/dev/test-game-create-delete.ts)
  - [live-fixture.ts](/home/khenny/tgcmcp/code/scripts/dev/lib/live-fixture.ts)
  - downstream Claude live and smoke harnesses indirectly rely on login behavior

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: yes

### 2. Game Core
Tools:
- `tgc_game_create`
- `tgc_game_list`
- `tgc_game_update`
- `tgc_game_get`
- `tgc_game_copy`
- `tgc_game_delete`
- `tgc_game_publish`
- `tgc_game_unpublish`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-game-create-delete.ts](/home/khenny/tgcmcp/code/scripts/dev/test-game-create-delete.ts)
  - [test-game-publish-unpublish.ts](/home/khenny/tgcmcp/code/scripts/dev/test-game-publish-unpublish.ts)
  - [test-zch-manual-copy-e2e.ts](/home/khenny/tgcmcp/code/scripts/dev/test-zch-manual-copy-e2e.ts)

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: yes

### 3. Game Readiness / Reporting
Tools:
- `tgc_game_surfacing_get`
- `tgc_game_surfacing_set`
- `tgc_game_test_reports_get`
- `tgc_make_readiness_check`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-batch3-board-mat-surfaces.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch3-board-mat-surfaces.ts)
  - readiness and report behavior is also exercised indirectly by guidance work, but not by an automated offline suite

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: representative only

### 4. Deck / Card
Tools:
- `tgc_deck_get`
- `tgc_game_decks_list`
- `tgc_deck_cards_list`
- `tgc_deck_create`
- `tgc_card_create`
- `tgc_deck_bulk_create_cards`
- `tgc_card_get`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-deck-bulk-create-cards.ts](/home/khenny/tgcmcp/code/scripts/dev/test-deck-bulk-create-cards.ts)
  - [test-zch-manual-copy-e2e.ts](/home/khenny/tgcmcp/code/scripts/dev/test-zch-manual-copy-e2e.ts)
  - [test-batch0-smoke-harness.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch0-smoke-harness.ts)

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: yes

### 5. Parts / Gameparts / Pricing
Tools:
- `tgc_game_gameparts_list`
- `tgc_part_get`
- `tgc_part_create`
- `tgc_gamepart_upsert`
- `tgc_game_bulk_pricing_get`
- `tgc_game_cost_breakdown_get`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-gamepart-upsert-probe.ts](/home/khenny/tgcmcp/code/scripts/dev/test-gamepart-upsert-probe.ts)
  - [test-batch5-specialty-parts.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch5-specialty-parts.ts)

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: representative only

### 6. Components / Items / Pages
Tools:
- `tgc_game_components_list`
- `tgc_component_items_list`
- `tgc_component_create`
- `tgc_component_update`
- `tgc_component_item_create`
- `tgc_component_page_create`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - [test-component-primitives.ts](/home/khenny/tgcmcp/code/scripts/dev/test-component-primitives.ts)
  - [test-packaging-core.ts](/home/khenny/tgcmcp/code/scripts/dev/test-packaging-core.ts)
  - [test-batch2-books-documents.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch2-books-documents.ts)
  - [test-batch2-pdf-rulebook.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch2-pdf-rulebook.ts)
  - [test-batch4-advanced-cut-and-dial.ts](/home/khenny/tgcmcp/code/scripts/dev/test-batch4-advanced-cut-and-dial.ts)
  - [test-component-update-custom-dice.ts](/home/khenny/tgcmcp/code/scripts/dev/test-component-update-custom-dice.ts)
  - [test-component-update-global-nondice.ts](/home/khenny/tgcmcp/code/scripts/dev/test-component-update-global-nondice.ts)

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: yes

### 7. Files / Folders / Downloads
Tools:
- `tgc_folder_create`
- `tgc_file_upload`
- `tgc_gamedownload_create`
- `tgc_file_get`
- `tgc_file_references_get`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - book/document and manual-copy harnesses use file-related flows indirectly
  - there is no obvious dedicated automated offline coverage yet

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: representative only

### 8. Catalog
Tools:
- `tgc_tgc_products_list`

Current state:
- Contract declared: yes
- Handler implemented: yes
- Automated offline coverage: yes
- Existing live/manual evidence:
  - catalog and capability-matrix generation rely on product data
  - coverage is currently script-driven rather than test-suite driven

B1 target:
- `contract`: exhaustive
- `offline-handler`: exhaustive
- `live-smoke`: no dedicated gate required

## Cross-Cutting Gaps
- Core offline verification is now in place for the implemented tool surface:
  - contract list and envelope regression
  - handler routing and validation coverage for all implemented tools
  - deterministic timeout/retry behavior tests for the TGC client
- Remaining B1 gaps are now primarily release-hardening and workflow-level concerns:
  - confirm first GitHub pass for the new core CI workflow
  - live smoke-pack rationalization
  - broader diagnostics review at the MCP output layer
  - idempotent/resumable behavior for selected multi-step workflows

## Immediate B1 Execution Use
This inventory now supports the next execution slice:
1. Observe/confirm the first GitHub run of the new core CI workflow.
2. Keep live TGC mutation checks as opt-in smoke coverage, not default CI.
3. After CI is stable, target resumable/idempotent behavior for selected multi-step flows.
