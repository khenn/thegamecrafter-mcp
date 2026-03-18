# Session: A5 Token Warnings + Manual Claude Gate

Date: 2026-03-18

## Goal
- Add warning-only token thresholds to the downstream Claude regression harness.
- Keep downstream Claude parity explicitly manual/opt-in instead of part of the normal MCP build/test loop.
- Record a later-release TODO to make the downstream skills harness LLM-agnostic.

## Changes
- Updated [code/scripts/dev/run-claude-regression.ts](/home/khenny/tgcmcp/code/scripts/dev/run-claude-regression.ts) to support warning-only thresholds:
  - per-suite warning configuration,
  - warning capture in case JSON and summary output,
  - console reporting that does not fail the suite.
- Added initial warning-only output-token thresholds:
  - [tests/claude/fixtures/smoke.json](/home/khenny/tgcmcp/tests/claude/fixtures/smoke.json): `1000`
  - [tests/claude/fixtures/routing-minimal-context.json](/home/khenny/tgcmcp/tests/claude/fixtures/routing-minimal-context.json): `1600`
  - [tests/claude/fixtures/family-guardrails.json](/home/khenny/tgcmcp/tests/claude/fixtures/family-guardrails.json): `1700`
  - [tests/claude/fixtures/live-sandbox.json](/home/khenny/tgcmcp/tests/claude/fixtures/live-sandbox.json): `2600`
- Clarified in [tools/claude-a5-regression-plan.md](/home/khenny/tgcmcp/tools/claude-a5-regression-plan.md) that:
  - token thresholds are warnings only for now,
  - downstream Claude parity is opt-in/manual,
  - it is not part of the general MCP build/test path.
- Added a later-release TODO in [ROADMAP.md](/home/khenny/tgcmcp/ROADMAP.md) to make the downstream skills regression harness LLM-agnostic.

## Normal Flow Decision
- Stable local dev gate remains:
  - `npm --prefix code run a5:test`
- Manual downstream parity remains separate:
  - `npm --prefix code run a5:test:claude`
  - `npm --prefix code run claude:test:all`

## Verification
- `npm --prefix code run a5:test`
- `npm --prefix code run claude:test:smoke`

## Outcome
- A5 local regression flow is still deterministic.
- Claude parity remains available when explicitly chosen.
- Token growth now surfaces as warnings without blocking work.
