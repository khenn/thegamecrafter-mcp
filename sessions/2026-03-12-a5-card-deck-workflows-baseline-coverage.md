# 2026-03-12 - A5 Card/Deck Workflows Baseline Coverage

## Objective
Continue A5 family implementation with cards/decks:
- create a dedicated card/deck skill,
- route card/deck prompts out of the generic stack,
- raise baseline guidance coverage for all active card identities.

## Scope classification
- Component-family specific: cards/decks
- Global impact: router delegation, public agent guidance, README skill install guidance, and routing tests

## Changes

### New focused skill
- Added `skills/tgc-card-deck-workflows/`
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflows.md`
  - `references/component-profiles.md`

### Guidance captured
- Added baseline coverage for all 24 active card identities.
- Captured card/deck decision points that were not represented in the generic component skill:
  - deck identity choice
  - shared-back vs unique-back strategy
  - foil deck warnings
  - clear deck / white-ink warnings
  - randomizer / bulk-pricing cautions
  - packaging-aware next-step guidance

### Router / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/workflows.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Updated `README.md`

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - added `tgc-card-deck-workflows`
  - added card/deck routing cases
  - kept router coverage for multi-family deck-plus-packaging workflows

## Verification
- Ran: `npm --prefix code run report:component-matrix`
  - result: success
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`6` skill fixture sets, `17` routing cases)
  - validator fixture tests: pass

## Coverage impact
- Before card/deck pass:
  - identity coverage: `65/201` (`32%`)
  - `tgc-card-deck-workflows`: `0/24`
- After card/deck pass:
  - identity coverage: `89/201` (`44%`)
  - `tgc-card-deck-workflows`: `24/24` identities baseline-guided (`100%`)

## Notes
- All active card identities currently resolve through `/api/deck` with `face`/`back` slot model, so the card/deck skill focuses on choice architecture and stock-specific guardrails rather than API-family divergence.
- This is baseline guidance completion for the card/deck family, not final live parity closure.

## Next
- Recommended next family: `tgc-board-mat-workflows`
  - current owner-family baseline: `2/46`
  - high proof-risk density and strong payoff from moving geometry-sensitive guidance out of the generic component layer
