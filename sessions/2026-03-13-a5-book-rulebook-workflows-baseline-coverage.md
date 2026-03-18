# 2026-03-13 - A5 Book/Rulebook Workflows Baseline Coverage

## Objective
Continue A5 family implementation with the book/rulebook workflow family:
- expand the existing book skill from a small seed set to full owner-family coverage,
- route folios, documents, and score pads through the focused book skill instead of generic preflight,
- raise baseline guidance coverage for all owner-mapped book-like identities,
- keep `TGCAGENT` lean while moving deep book-specific knowledge into focused skill references.

## Scope classification
- Component-family specific: books, folios, documents, and score pads
- Global impact: router delegation wording, public agent guidance, generic preflight ownership cleanup, and routing tests

## Changes

### Expanded focused skill
- Updated `skills/tgc-book-rulebook-workflows/`
  - `SKILL.md`
  - `references/workflows.md`
  - `references/book-component-profiles.md`

### Guidance captured
- Added baseline coverage for all 22 owner-mapped book-family identities.
- Expanded guidance beyond the original seed set to cover:
  - booklet long-tail identities
  - coil-bound long-tail identities
  - perfect-bound long-tail identities
  - folio identities
  - documents
  - score pads
- Captured book-family decision points that were previously only implied:
  - booklet vs coil vs perfect-bound vs folio vs document vs score-pad choice
  - booklet parity and cover sequencing
  - folio/document/score-pad front/back orientation issues
  - perfect-bound spine safety
  - coil-book and mat-book material/surfacing differences
  - UV/linen exclusions and cover-only behavior where relevant

### Routing / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/workflows.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Removed the migrated book seed entries from:
  - `skills/tgc-component-preflight/references/component-profiles.md`

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - expanded book-skill keywords for:
    - `folio`
    - `score pad`
    - `document`
    - `coil book`
  - added routing cases for:
    - folio vs document inserts
    - horizontal score-pad orientation

## Verification
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`8` skill fixture sets, `24` routing cases)
  - validator fixture tests: pass
- Ran: `npm --prefix code run report:component-matrix`
  - result: success

## Coverage impact
- Before book-family pass:
  - identity coverage: `181/201` (`90%`)
  - `tgc-book-rulebook-workflows`: `5/22`
- After book-family pass:
  - identity coverage: `198/201` (`99%`)
  - `tgc-book-rulebook-workflows`: `22/22` identities baseline-guided (`100%`)

## Notes
- The only remaining baseline gaps are now the parts long-tail.
- Books, packaging, cards, boards/mats, and custom-cut are all at full baseline coverage in the generated owner map.

## Next
- Recommended next family: `tgc-parts-dice-workflows`
  - current owner-family baseline: `5/8`
  - remaining gaps are the final baseline-guidance holdouts for A5
