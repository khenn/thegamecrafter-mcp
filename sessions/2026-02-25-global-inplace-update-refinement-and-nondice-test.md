# Session: Global In-Place Update Refinement + Non-Dice Update Test

Date: 2026-02-25

## Objective
Apply in-place update preference globally across component workflows and add representative non-dice update regression coverage.

## Changes
- Guidance refinements:
  - `context/AGENTS.md`
    - added explicit global rule: prefer `tgc_component_update` for existing non-deck revisions; avoid duplicates unless explicitly requested.
  - `skills/tgc-guided-workflows/SKILL.md`
    - added core default for in-place revision behavior.
  - `skills/tgc-guided-workflows/references/workflows.md`
    - added `Component Revision Workflow (Global, Non-Deck)` section.
- New live integration test:
  - `code/scripts/dev/test-component-update-global-nondice.ts`
  - test flow: create `boxface` (`PokerBooster`) -> update same component name/art via `tgc_component_update` -> verify same id remains and values changed.
- Added npm script:
  - `test:integration:component-update-global-nondice`

## Validation
- `npm run typecheck` passed.
- `npm run test:integration:component-update-global-nondice` passed.

## Outcome
- In-place update behavior is now explicitly documented as the global default for non-deck component revisions.
- Regression coverage now proves update behavior for both dice and non-dice families.
