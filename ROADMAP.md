# The Game Crafter MCP - Feature Roadmap

This roadmap is for public `thegamecrafter-mcp` and is ordered by creator workflow and release strategy.

## Scope
- Focus on account-authoring workflows (create/manage your own games and assets).
- Keep public-catalog interaction secondary and avoid API usage patterns that may exceed intended use.
- Prioritize new-game build completeness over copy workflows.

## Goal A - Make and Iterate (Release 1)

Ship the highest-usage workflows first: creating games, adding components/art, and preparing playable prototypes.

### A1. Core MCP Platform
- [x] ~~MCP stdio server scaffold~~
- [x] ~~Auth/session tools (`tgc_auth_login`, `tgc_auth_logout`)~~
- [x] ~~Read tools (`tgc_me`, `tgc_designer_list`, `tgc_game_get`, `tgc_game_list`)~~

### A2. Game Lifecycle
- [x] ~~Implement `tgc_game_create`~~
- [x] ~~Implement `tgc_game_update`~~
- [x] ~~Implement `tgc_game_delete`~~
- [x] ~~Implement `tgc_game_copy`~~
- [x] ~~Gate: create/update/read/delete flows validated with cleanup~~

### A3. Asset Ingestion
- [x] ~~Implement `tgc_folder_create`~~
- [x] ~~Implement `tgc_file_upload`~~
- [x] ~~Gate: uploaded assets reusable across component workflows~~

### A4. Components and Parts Coverage
- [x] ~~Implement deck/card workflows (`tgc_deck_create`, `tgc_card_create`, `tgc_deck_bulk_create_cards`)~~
- [x] ~~Implement component container/item/page workflows (`tgc_component_create`, `tgc_component_item_create`, `tgc_component_page_create`)~~
- [x] ~~Implement part linking (`tgc_gamepart_upsert`)~~
- [x] ~~Implement component discovery/listing (`tgc_game_components_list`, `tgc_component_items_list`, `tgc_game_gameparts_list`)~~
- [x] ~~Expand component write coverage across Batches 1-5~~
- [x] ~~Gate: live create/readback probes for implemented component families~~

### A5. Make-Phase Intelligence
- [x] ~~Seed guidance for implemented component families in `skills/` + `context/AGENTS.md`~~
- [x] ~~Add preflight guardrails for print-fit, bleed/cut, and component constraints~~
- [ ] Complete per-component guidance parity for all implemented component families
- [ ] Add/finish automated capability matrix regeneration in normal dev flow
- [ ] In progress: Integrate TGC Help Center knowledge into agent/skills guidance.
  - [x] Crawl seeded Help Center categories and generate local catalog references.
  - [x] Add curated process/best-practice guidance reference for make/iterate workflows.
  - [x] Expand curated guidance coverage across all implemented component families.
  - [x] ~~Decide whether to add optional RAG retrieval service (Supabase/pgvector) after evaluating static-reference performance.~~
    - Decision: defer RAG for Release 1; use static references now and re-evaluate after Goal B release hardening.

### A6. Prototype/Test-Adjacent Coverage
- [x] ~~Add read helpers for test-area relationships (`sanitytests`, `arttests`, `cvtests`) with user-facing interpretation~~
- [x] ~~Add a `tgc_make_readiness_check` helper (prototype readiness, proofing warnings, missing assets)~~
- [x] ~~Gate: readiness checks catch known fixture problems before ordering prototypes~~

### A7. Remaining Make-Phase Gaps
- [x] ~~Implement `tgc_game_cost_breakdown_get`~~
- [x] ~~Implement `tgc_game_bulk_pricing_get`~~
- [x] ~~Implement `tgc_gamedownload_create`~~
- [x] ~~Add first-class Surfacing support and guidance:~~
  - [x] ~~`enable_uv_coating` workflow support~~
  - [x] ~~`enable_linen_texture` workflow support~~
  - [x] ~~user-facing validation/prompts for surfacing tradeoffs and cost impact~~
- [x] ~~Complete Make-tab parity review and close actionable gaps:~~
  - [x] ~~stock component workflow support level (implement or explicitly document constraints)~~
  - [x] ~~embedded game support decision (implement or explicitly document unsupported state)~~
- [x] ~~Gate: complete make/iterate workflow from empty game to prototype-ready package~~
- [x] ~~Gate: Make-tab functional parity for all supported API-backed features~~

## Goal B - Hardening and Release Ops (Release 1 Exit)

Stabilize what was built in Goal A and ship a reliable public first release.

### B1. Quality and Reliability
- [ ] Contract and integration tests for all implemented tools
- [ ] CI pipeline for typecheck/build/tests
- [ ] Retry/backoff, timeout policy, and improved diagnostics
- [ ] Idempotent/resumable behavior for long multi-step workflows

### B2. Docs and Onboarding
- [x] ~~Cross-platform README install and verification guidance~~
- [x] ~~Agent/skill installation guidance for Codex and Claude-style workflows~~
- [ ] Finish release-specific docs pass for v1 toolset and known limitations
- [ ] Create concise upgrade notes/changelog template for future releases

### B3. Skills and Agent Maintenance Loop
- [x] ~~Issue-based feedback contribution flow with privacy safeguards~~
- [x] ~~User approval gate before publishing feedback content~~
- [ ] Add regression checklist for applying issue feedback across component/family/global scope
- [ ] Gate: at least one full feedback cycle validated from issue to merged guidance update

### B4. Release Packaging
- [ ] Versioning + release process discipline
- [ ] Configure GitHub community contribution baseline:
  - [ ] `CONTRIBUTING.md` contribution flow
  - [ ] issue/PR templates
  - [ ] `CODE_OF_CONDUCT.md`
  - [ ] `SECURITY.md` vulnerability reporting path
  - [ ] branch protection/review expectations
- [ ] Publish first stable release focused on Make/Iterate workflows

## Goal C - Sell and Publish Workflow (Release 2)

After v1 release, add guided publishing and visibility optimization.

### C1. Sell-Surface API Coverage
- [x] ~~Implement `tgc_game_publish`~~
- [x] ~~Implement `tgc_game_unpublish`~~
- [ ] Implement sell-asset/metadata helpers where API supports write operations:
  - [ ] action shots create/update/delete/list
  - [ ] game tags add/remove/list
  - [ ] related games linkage/list/order (if API supports safe mutation)
  - [ ] BOF workflow support (if API supports safe mutation)
- [ ] Gate: CRUD/readback tests for each supported sell workflow

### C2. Guided Publish Assistant
- [ ] Implement `tgc_prepublish_check` for blockers + warnings + next actions
- [ ] Add guided publish wizard behavior in skills/agent:
  - [ ] collect missing inputs
  - [ ] present top 2-3 options where relevant
  - [ ] require explicit user confirmation before publish
- [ ] Gate: end-to-end guided publish succeeds on a realistic fixture game

### C3. Visibility and Merchandising Suggestions
- [ ] Add `tgc_visibility_review` helper with actionable recommendations
- [ ] Add Sell best-practice references and prompt patterns into skills
- [ ] Gate: measurable improvement in completeness/visibility score after suggestions applied

## Goal D - Crowd Sale and Growth (Release 3)

Extend beyond publishing into promotion and campaign workflows.

### D1. Crowd Sale Discovery and Support
- [ ] Confirm and document writable API surface for crowd sale workflows (`crowdsale_game1/2/3` and related endpoints)
- [ ] Add read/guide tools for crowd sale readiness and lifecycle
- [ ] Implement write workflows if API safely supports them

### D2. Post-Publish Growth Tooling
- [ ] Add guidance for promotions, campaign setup, and post-launch optimization
- [ ] Add analytics-oriented helper prompts where API support exists

## Deferred (Not in Current Release Window)
- [ ] Optional local OS secret-manager integration for unattended operation
- [ ] Optional MCP browsable resources support (`resources/list`, `resources/read`, templates) for discoverable docs/capabilities context
- [ ] Full UI/desktop frontend
- [ ] Background daemon as required runtime
- [ ] Implicit auto-publish without explicit user action
