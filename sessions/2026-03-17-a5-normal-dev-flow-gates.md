# Session: A5 Normal Dev Flow Gates

Date: 2026-03-17

## Goal
- Wire the remaining A5 owner-map/coverage checks into the normal dev flow.
- Make capability-matrix regeneration and guidance coverage drift detectable with a deterministic local gate.

## Changes
- Reworked [code/scripts/dev/generate-component-capability-matrix.ts](/home/khenny/tgcmcp/code/scripts/dev/generate-component-capability-matrix.ts) to:
  - emit a machine-readable summary file at `tools/tgc-guidance-regression-summary.json`,
  - support a strict `--check` mode,
  - compare generated artifacts against committed outputs while normalizing generated timestamps,
  - fail on capability regressions, guidance-coverage regressions, or owner-family regressions.
- Added package scripts in [code/package.json](/home/khenny/tgcmcp/code/package.json):
  - `report:component-matrix:check`
  - `a5:test`
  - `a5:test:claude`
- Kept Claude parity separate from the stable local gate:
  - `a5:test` is now the normal-flow local gate (`report:component-matrix:check` + `skills:test`)
  - `a5:test:claude` remains the heavier downstream Claude parity pass

## Why The Split
- The local A5 gate needs to be stable and deterministic for ordinary skill/reference edits.
- Downstream Claude parity is still valuable, but the Claude CLI can intermittently fail on local lock/permission writes that are outside TGCMCP itself.
- Keeping Claude parity separate avoids turning external runtime flakiness into a blocker for the normal local dev loop.

## Verification
- `npm --prefix code run report:component-matrix`
- `npm --prefix code run report:component-matrix:check`
- `npm --prefix code run skills:test`
- `npm --prefix code run a5:test`

## Outcome
- Normal dev flow now has a stable A5 gate for:
  - live catalog capability coverage
  - owner-map and guidance coverage drift
  - skill validation and routing fixtures
- Remaining A5 follow-up is limited to future token-thresholding and continued Claude parity runs as a separate heavier check.
