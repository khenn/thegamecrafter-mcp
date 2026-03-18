# Claude A5 Prompt Pack

Date: 2026-03-13
Status: Initial regression fixture pack for downstream Claude `tgcagent` validation

## Purpose
Provide the first automated prompt set for A5 closeout:
- non-interactive smoke verification,
- read-only routing and minimal-context checks,
- baseline telemetry collection for future token-efficiency thresholds.

## Prompt design rules
- Run each prompt in a fresh Claude session with `--no-session-persistence`.
- Use Claude CLI structured output so the harness can validate behavior without transcript scraping.
- Keep the first suite read-only; do not require MCP login or mutations yet.
- Ask Claude to list only the files/references it actually used.
- Treat runtime token/cost telemetry from the Claude CLI envelope as authoritative.

## Current automated suites

### Smoke
- `downstream-readonly-smoke`
  - broad prototype-planning question
  - should route through `tgc-guided-workflows`
  - should not need approval or user input
  - should use minimal context and avoid repo internals

### Routing and minimal-context
- `packaging-optioning`
  - should prefer `tgc-packaging-workflows`
- `card-deck-optioning`
  - should prefer `tgc-card-deck-workflows`
- `board-mat-optioning`
  - should prefer `tgc-board-mat-workflows`
- `custom-cut-optioning`
  - should prefer `tgc-custom-cut-workflows`
- `book-optioning`
  - should prefer `tgc-book-rulebook-workflows`
- `parts-dice-optioning`
  - should prefer `tgc-parts-dice-workflows`
- `cross-family-orchestration`
  - should prefer `tgc-guided-workflows`

### Family guardrails
- `packaging-slot-guardrails`
  - should block or pause when printable packaging faces are incomplete
- `card-back-strategy-guardrails`
  - should surface shared-back default and unique-back tradeoffs
- `board-proofing-guardrails`
  - should surface size, reverse-side, and 3D-viewer checks
- `custom-cut-geometry-guardrails`
  - should block when cut-line or geometry readiness is missing
- `book-page-parity-guardrails`
  - should surface page-count and orientation checks
- `parts-face-completeness-guardrails`
  - should surface die-type and face-completeness blockers

### Live sandbox
- `live-packaging-create-readback-cleanup`
  - create, verify, and delete a disposable tuckbox workflow
- `live-card-deck-create-readback-cleanup`
  - create, verify, and delete a disposable deck workflow
- `live-board-create-readback-cleanup`
  - create, verify, and delete a disposable bifold board workflow
- `live-booklet-create-readback-cleanup`
  - create, verify, and delete a disposable booklet workflow

## Prompt template behavior
The runner wraps each fixture prompt with stable instructions that tell Claude to:
- act as the installed downstream TGC agent,
- avoid repo-builder behavior,
- avoid unrelated repo/source scanning,
- use only the minimum context needed,
- stay read-only unless the fixture explicitly says otherwise,
- emit the structured response block required by the schema.

## Next packs to add
- family workflow guardrail prompts
- safety and negative prompts
- live sandbox create/update/readback prompts
- cleanup verification prompts
