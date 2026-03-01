# Session: Plan B step 5 - behavior parity under split skill layout

## Goal
Migrate remaining behavior responsibilities from router to focused skills and validate routing parity.

## Changes
- Router skill tightened to orchestration/delegation role:
  - updated `skills/tgc-guided-workflows/SKILL.md`
  - removed embedded deep sections for component preflight and print-safe rules
  - added explicit `Delegation Contract` section
  - added readiness/test-report phrasing to align trigger expectations

- Added explicit routing map reference:
  - `skills/tgc-guided-workflows/references/skill-routing-map.md`

- Strengthened overlap/parity tests:
  - updated `tests/skills/prompts/trigger-matrix.json`
  - expanded routing overlap cases from 4 to 8

- Trigger harness already supports expected-primary routing assertions and now validates expanded scenarios.

## Validation
- `npm --prefix code run skills:test-triggers` -> pass
  - 4 skill fixture sets, 8 routing cases
- `npm --prefix code run skills:test` -> pass
  - skill package validation pass
  - trigger + routing pass
  - validator fixture tests pass

## Remaining for B.5 closure
- Run live tgcagent prompt-parity checks for representative end-to-end flows and verify observed skill behavior matches expected routing/delegation.
