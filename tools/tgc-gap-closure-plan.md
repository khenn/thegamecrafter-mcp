# TGC MCP Functional Gap Closure Plan

Date: 2026-02-22
Source: `tools/tgc-component-capability-matrix.md`

## Goal
Close the remaining game-building functionality gaps in a safe, test-as-you-go sequence so an LLM can build new games across TGC-supported component families.

## Current Gap Snapshot
- Catalog products discovered: 201
- Fully supported: 201
- Products with gaps: 0
- Missing create API families: 0

## Build Principles
- Ship in batches by reusable API family, not by individual product identity.
- Add read/list probes and write/create tools together when possible.
- Every new write family gets a disposable live fixture test (create -> verify -> cleanup).
- Every new write family must include a component-intelligence profile in skills/docs:
  - source URLs (`make/products/<Identity>`, `api/tgc/products/<Identity>`, and `info` help URL if present),
  - validated constraints (image dimensions, page rules, min/max, finish options),
  - preflight warning/correction prompts for invalid user requests.
- Avoid unsupported assumptions about non-owned assets; use owned/synthetic assets for validation.
- Track any possible IP/security concern as a formal finding when discovered.

## Execution Plan

- [x] **Batch 0: Harness and Safety Foundations**
  - Deliverables:
    - [x] Standard live fixture runner pattern in `code/scripts/dev/lib/live-fixture.ts`.
    - [x] Shared test naming/cleanup conventions via `withFixtureGame(...)`.
    - [x] Per-family "minimum viable payload" fixtures demonstrated in `test-batch0-smoke-harness.ts`.
  - Validation gate:
    - [x] Create/verify/delete smoke test passes for one existing supported family and one new family.

- [x] **Batch 1: Packaging Core (highest leverage)**
  - API families:
    - [x] `/api/tuckbox`
    - [x] `/api/hookbox`
    - [x] `/api/twosidedbox`
    - [x] `/api/boxtop`
    - [x] `/api/boxtopgloss`
    - [x] `/api/twosidedboxgloss`
    - [x] `/api/boxface`
  - Why first:
    - Removes largest practical blocker for shipping playable boxed games.
    - Covers many product identities at once.
  - Validation gate:
    - [x] Build a fixture game with at least one instance from each implemented packaging family.
    - [x] Verify with `tgc_game_components_list` and game readback.

- [x] **Batch 2: Books and Documents**
  - API families:
    - [x] `/api/document`
    - [x] `/api/booklet`, `/api/bookletpage`
    - [x] `/api/coilbook`, `/api/coilbookpage`
    - [x] `/api/perfectboundbook`, `/api/perfectboundbookpage`
    - [x] `/api/scorepad`
  - Validation gate:
    - [x] Create one fixture each for document/booklet/coil/perfectbound/scorepad.
    - [x] Verify page counts and membership/relationships via read endpoints.

- [x] **Batch 3: Board/Mat Surface Types**
  - API families:
    - [x] `/api/onesided`
    - [x] `/api/onesidedgloss`
  - Why here:
    - Unlocks mats/boards variants used by many complex games.
  - Validation gate:
    - [x] Build fixtures for neoprene mat + fold board identities and verify dimensions/identity.

- [x] **Batch 4: Advanced Cut and Dial Families**
  - API families:
    - [x] `/api/dial`
    - [x] `/api/customcutonesidedslugged`
    - [x] `/api/customcuttwosidedslugged`
    - [x] `/api/threesidedcustomcutset`, `/api/threesidedcustomcut`
  - Validation gate:
    - [x] Create one dual-layer board-like fixture and one custom-cut sticker/punchout fixture.
    - [x] Verify child member creation semantics and quantities.

- [x] **Batch 5: Specialty Parts and Custom Dice/Meeples**
  - API families:
    - [x] `/api/acrylicshape`
    - [x] `/api/customprintedmeeple`
    - [x] `/api/customcolord4`, `/api/customcolord6`, `/api/customcolord8`
  - Validation gate:
    - [x] Create each specialty component once with valid art/proof flags.
    - [x] Verify component readback via relationship endpoints.

- [ ] **Batch 6: Capability Matrix Automation and Coverage Closure**
  - Deliverables:
    - Regenerate matrix after each batch.
    - Add CI-like script that fails when supported-family coverage regresses.
    - Mark residual unsupported families as intentionally deferred (if any).
  - Validation gate:
    - Matrix delta shows monotonic reduction in missing families.

## Build + Validate Workflow Per API Family
1. Add service method in `code/src/tgc/service.ts`.
2. Add handler and contract schema in `code/src/mcp/handlers.ts` and `code/src/mcp/contract.ts`.
3. Add/extend tool docs in `tools/tgc-mcp-tool-contract-v1.md`.
4. Add/extend component-intelligence guidance in `skills/tgc-guided-workflows/SKILL.md` and `context/AGENTS.md`:
   - include source URLs and preflight rules.
5. Add a focused live test script in `code/scripts/dev/`:
   - authenticate
   - create disposable game
   - create component(s)
   - verify with read endpoints
   - cleanup in `finally`
6. Update skill guardrails/workflow notes when behavior/pitfalls are learned.
7. Record session in `sessions/` with outcome and caveats.

## Success Criteria
- An LLM can build a new game using all practical component families exposed by TGC developer API create endpoints.
- Each family has at least one passing live integration test with cleanup.
- Capability matrix reflects implemented coverage and known intentional deferrals.

## Security/IP Monitoring During Build
When probing/validating, flag as potential security issue if any of these are observed:
- Non-owned private asset file IDs become readable/writable.
- Non-owned unpublished game content becomes accessible beyond intended public metadata.
- Ability to mutate other users' resources by ID.
- Access-control bypass via relationship endpoints.

If observed, capture:
- exact endpoint/tool
- request shape
- returned fields
- why it implies potential IP exposure
for disclosure to TGC staff.
