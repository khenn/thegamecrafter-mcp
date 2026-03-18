# Session: A5 Claude Full Baseline

Date: 2026-03-17

## Goal
- Run the full unattended downstream Claude regression stack in one pass.
- Establish the first token-usage baseline by workflow family for A5 closeout.

## Command
- `npm --prefix code run claude:test:all`

## Result
- Full unattended Claude baseline passed end-to-end.
- Smoke, routing/minimal-context, family guardrails, and live sandbox suites all passed.
- Live sandbox cleanup sweep passed both before and after the live suite with `remaining_active=0`.

## Baseline Artifacts
- Smoke:
  - `/home/khenny/tgcmcp/logs/claude/regression-2026-03-17T15-21-59.205Z/summary.json`
- Routing/minimal-context:
  - `/home/khenny/tgcmcp/logs/claude/regression-2026-03-17T15-22-30.362Z/summary.json`
- Family guardrails:
  - `/home/khenny/tgcmcp/logs/claude/regression-2026-03-17T15-27-52.988Z/summary.json`
- Live sandbox:
  - `/home/khenny/tgcmcp/logs/claude/regression-2026-03-17T15-31-55.554Z/summary.json`

## Token Baseline Snapshot
- Smoke:
  - router read-only smoke: `input=6`, `output=768`
- Routing/minimal-context:
  - packaging: `7 / 1156`
  - cards/decks: `7 / 908`
  - boards/mats: `7 / 1327`
  - custom-cut: `7 / 1399`
  - books: `7 / 1367`
  - parts/dice: `7 / 1284`
  - cross-family router: `7 / 1253`
- Family guardrails:
  - packaging: `7 / 1464`
  - cards/decks: `7 / 925`
  - boards/mats: `5 / 1356`
  - custom-cut: `7 / 1016`
  - books: `7 / 747`
  - parts/dice: `7 / 868`
- Live sandbox:
  - packaging: `20 / 1856`
  - cards/decks: `13 / 1206`
  - boards/mats: `18 / 1882`
  - books: `21 / 2233`

## Initial Interpretation
- Read-only routing prompts stayed very small on input tokens and generally landed in the `900-1400` output-token band.
- Guardrail prompts stayed in a similar range, with books and parts lower and packaging higher.
- Live sandbox prompts were materially larger, landing in the `1200-2233` output-token band.
- This is good enough to use as the first family-level baseline; hard thresholds should wait for a few more stable runs.

## Roadmap Impact
- Claude regression harness and closure evidence items can be marked complete.
- Remaining A5 work is now primarily:
  - owner-map/coverage regression checks in normal dev flow
  - capability-matrix regeneration wiring in normal dev flow
  - eventual token thresholding after observing more runs
