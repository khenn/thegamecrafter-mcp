# 2026-03-17 - A5 Claude Guardrail and Live Harness Progress

## Objective
Advance the Claude regression harness beyond smoke/routing by:
- adding family guardrail fixtures,
- adding an initial live sandbox fixture pack,
- extending the runner for richer assertions and unattended execution,
- identifying any downstream Claude blockers before broader rollout.

## Scope classification
- Global: downstream Claude regression harness and A5 parity validation

## Changes

### Runner updates
- Updated `code/scripts/dev/run-claude-regression.ts`
  - added note-string assertions:
    - `notesAllOf`
    - `notesNoneOf`
  - added per-fixture/per-case tool allowlists via `--allowedTools`
  - added configurable Claude effort level
  - added configurable Claude permission mode
  - added configurable per-case timeout to fail fast instead of hanging indefinitely
  - tightened prompt wrapper to keep outputs concise and preserve requested literal tokens in `notes`

### New fixture packs
- Added `tests/claude/fixtures/family-guardrails.json`
  - packaging slot completeness
  - deck back-strategy guardrails
  - board proofing guardrails
  - custom-cut geometry guardrails
  - book parity/orientation guardrails
  - parts/dice completeness guardrails
- Added `tests/claude/fixtures/live-sandbox.json`
  - packaging create/readback/delete
  - deck create/readback/delete
  - board create/readback/delete
  - booklet create/readback/delete

### Doc update
- Updated `tools/claude-a5-regression-plan.md`
  - documented that `claude auth status` is not sufficient proof of usable runtime auth

## Findings
- The harness extensions landed cleanly.
- A new downstream Claude blocker appeared before the new suites could be validated:
  - `claude auth status` still reports the account as logged in,
  - but actual Claude CLI API calls are failing with `401 authentication_error`,
  - the cached Claude OAuth token appears to have expired.

### Evidence
- `claude auth status` still returns:
  - `loggedIn: true`
  - `authMethod: claude.ai`
- A direct debug run for the packaging guardrail prompt showed repeated:
  - `401 authentication_error`
  - `"OAuth token has expired. Please obtain a new token or refresh your existing token."`
- The debug log is at:
  - `/tmp/claude-guardrail-debug.log`

## Impact
- Existing smoke/routing fixtures remain structurally valid, but current downstream Claude execution is blocked until the Claude CLI auth token is refreshed.
- Guardrail and live suites should not be treated as passing or failing on agent behavior yet; current failures/timeouts are environment-auth failures, not skill regressions.

## Next
- Refresh Claude CLI auth with `claude auth login`.
- Rerun:
  - `npm --prefix code run claude:test:guardrails`
  - `npm --prefix code run claude:test:live`
- Calibrate any prompt/notes expectations only after auth is restored.
