# A5 Claude Live Regression Debug And Baseline

Date: 2026-03-17

## Scope classification
- Global:
  - downstream Claude live regression was not testing current skill content because Claude loads installed copies from its skills directory, not the repo working tree
  - live runner schema enforcement was incompatible with long-running Claude tool workflows
- Fixture-specific:
  - board live prompt expected the wrong relationship token for `BiFoldBoard`
  - live suite defaults were too strict for downstream runtime behavior and too short for slower family flows

## Changes made
- Updated live mutation guidance so packaging clearly distinguishes `componentType` from `identity`:
  - `context/TGCAGENT.md`
  - `skills/tgc-guided-workflows/SKILL.md`
  - `skills/tgc-packaging-workflows/SKILL.md`
  - `skills/tgc-packaging-workflows/references/workflows.md`
- Updated Claude live regression runner:
  - live mode now asks for a JSON footer in-prompt instead of relying on CLI `--json-schema`
  - parser now unwraps fenced JSON and normalizes boolean-like fields
  - live prompt contract now forbids session/credential leakage in notes
- Updated live fixture pack:
  - removed live-suite MCP allowlist restriction
  - increased live timeout to `180s`
  - increased live retry count to `2`
  - aligned deck expectation with observed focused-skill behavior
  - corrected board verification relationship to `onesidedglosses`
- Updated live runner retry behavior:
  - live cases now retry on timeout as well as known transient Claude execution errors
- Updated docs:
  - `README.md`
  - `tools/claude-a5-regression-plan.md`

## Downstream Claude findings
- Claude skill loading failed inside the Codex sandbox because the `Skill` tool could not access `~/.claude.json`.
- Running Claude outside the sandbox restored real downstream behavior.
- The installed Claude skill copies were stale until the repo `skills/` folders were recopied into `~/.claude/skills`.
- After syncing the installed skills, Claude correctly used:
  - `componentType=tuckbox`
  - `identity=PokerTuckBox54`
  for the live packaging case.

## Verification
- Deterministic skill checks:
  - `npm --prefix code run skills:test`
- Claude live single-case passes:
  - `npm --prefix code run claude:test:live -- --case live-packaging-create-readback-cleanup`
  - `npm --prefix code run claude:test:live -- --case live-card-deck-create-readback-cleanup`
- Claude live full-suite baseline:
  - `npm --prefix code run claude:test:live`
  - packaging passed
  - card/deck passed
  - board passed
  - booklet passed

## Current state
- The full `claude:test:live` suite is now stable in the current environment with retry-on-timeout enabled for live cases.
- Latest green baseline log:
  - `logs/claude/regression-2026-03-17T13-58-41.742Z`
- Next work item:
  - promote this stable live suite into the broader A5 closeout path alongside smoke, routing, and guardrail suites.
