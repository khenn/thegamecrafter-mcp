# 2026-03-13 - A5 Claude Regression Harness, Smoke Gate, and Routing Baseline

## Objective
Begin the automated A5 Claude validation phase by:
- creating the first runnable Claude regression harness,
- adding tracked smoke and routing fixtures,
- validating downstream Claude behavior in non-interactive mode,
- capturing the first token/context baseline for future threshold work.

## Scope classification
- Global: downstream Claude regression and A5 parity validation harness

## Changes

### Roadmap
- Updated `ROADMAP.md`
  - marked the manual downstream Claude smoke-test prerequisite complete
  - marked the dedicated automated non-interactive Claude smoke gate complete

### New docs
- Added `tools/claude-a5-prompt-pack.md`
  - defines the initial automated prompt pack and prompt design rules
- Added `tools/claude-a5-results-template.md`
  - provides a reusable format for logging future Claude validation runs

### New fixtures
- Added `tests/claude/fixtures/smoke.json`
  - dedicated non-interactive smoke case
- Added `tests/claude/fixtures/routing-minimal-context.json`
  - read-only routing and minimal-context cases for:
    - packaging
    - cards/decks
    - boards/mats
    - custom-cut
    - books
    - parts/dice
    - cross-family orchestration

### New runner
- Added `code/scripts/dev/run-claude-regression.ts`
  - runs `claude -p --output-format json --no-session-persistence --json-schema ...`
  - captures the Claude CLI JSON envelope
  - validates structured output against fixture expectations
  - records raw per-case results under `logs/claude/`
  - treats Claude CLI token/cost telemetry as authoritative

### Package scripts
- Updated `code/package.json`
  - added `claude:test`
  - added `claude:test:smoke`
  - added `claude:test:routing`

## Verification

### Commands
- `npm --prefix code run claude:test:smoke`
- `npm --prefix code run claude:test:routing`

### Result
- Smoke suite: passed
  - log dir: `logs/claude/regression-2026-03-13T10-13-09.900Z`
- Routing/minimal-context suite: passed
  - log dir: `logs/claude/regression-2026-03-13T10-13-09.898Z`

## Initial downstream Claude baseline

### Smoke gate
- primary skill: `tgc-guided-workflows`
- references loaded: `0`
- input tokens: `5`
- output tokens: `835`
- cost USD: `0.03932055`

### Family routing cases
- packaging
  - primary skill: `tgc-packaging-workflows`
  - references loaded: `3`
  - input/output tokens: `7 / 1147`
- cards/decks
  - primary skill: `tgc-card-deck-workflows`
  - references loaded: `2`
  - input/output tokens: `7 / 881`
- boards/mats
  - primary skill: `tgc-board-mat-workflows`
  - references loaded: `3`
  - input/output tokens: `7 / 1393`
- custom-cut
  - primary skill: `tgc-custom-cut-workflows`
  - references loaded: `3`
  - input/output tokens: `7 / 1240`
- books
  - primary skill: `tgc-book-rulebook-workflows`
  - references loaded: `2`
  - input/output tokens: `6 / 1299`
- parts/dice
  - primary skill: `tgc-parts-dice-workflows`
  - references loaded: `3`
  - input/output tokens: `7 / 1313`
- cross-family orchestration
  - primary skill: `tgc-guided-workflows`
  - secondary skills:
    - `tgc-card-deck-workflows`
    - `tgc-packaging-workflows`
    - `tgc-board-mat-workflows`
    - `tgc-custom-cut-workflows`
  - references loaded: `6`
  - input/output tokens: `8 / 2549`

## Notes
- The first harness execution surfaced two calibration issues, not downstream Claude setup problems:
  - several routing prompts legitimately required clarifying user inputs, so `needs_user_input=false` was too strict for those read-only optioning cases
  - the cross-family orchestration case needed a larger reference budget than a single-family case
- After fixture calibration, the smoke and routing suites passed without code changes to the skills.

## Next
- Add family workflow guardrail fixtures.
- Add live sandbox Claude fixtures with explicit login/mutation rules and cleanup expectations.
- Use repeated runs to establish token thresholds by workflow family.
