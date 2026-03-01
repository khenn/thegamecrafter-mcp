# Session: Plan B step 4 - trigger overlap boundary tests

## Goal
Ensure router vs focused skills are selected predictably with overlapping language.

## Changes
- Extended trigger test harness to support routing boundary assertions:
  - `code/scripts/skills/test-skill-triggers.ts`
  - added `routingCases` support with:
    - `prompt`
    - `expectedPrimary`
    - optional `minPrimaryHits`

- Expanded trigger fixtures:
  - `tests/skills/prompts/trigger-matrix.json`
  - added 4 routing overlap cases for:
    - component preflight
    - book/rulebook workflows
    - image preflight/fit
    - guided router/global game flows

- Updated roadmap progress:
  - `ROADMAP.md`

## Validation
- `npm --prefix code run skills:test-triggers` -> pass
- `npm --prefix code run skills:test` -> pass
  - validator pass (4 skills)
  - trigger pass (4 skill fixtures + 4 routing cases)
  - fixture tests pass

## Notes
- This harness remains keyword-score based and deterministic.
- As new focused skills are added, add edge-case routing prompts to avoid accidental router over-capture.
