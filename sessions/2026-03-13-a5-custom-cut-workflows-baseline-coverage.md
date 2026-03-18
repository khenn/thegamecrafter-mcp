# 2026-03-13 - A5 Custom-Cut Workflows Baseline Coverage

## Objective
Continue A5 family implementation with the custom-cut workflow family:
- create a dedicated custom-cut workflow skill,
- route geometry-heavy punchout, sticker, dial, and dual-layer-board prompts out of the generic component stack,
- raise baseline guidance coverage for all owner-mapped custom-cut identities,
- keep `TGCAGENT` lean while moving deep custom-cut knowledge into focused skill references.

## Scope classification
- Component-family specific: custom-cut punchouts, stickers, dials, and dual-layer boards
- Global impact: router delegation, public agent guidance, README skill install guidance, generic preflight ownership cleanup, and routing tests

## Changes

### New focused skill
- Added `skills/tgc-custom-cut-workflows/`
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflows.md`
  - `references/component-profiles.md`

### Guidance captured
- Added baseline coverage for all 53 owner-mapped custom-cut identities.
- Captured custom-cut decision points that were previously only seeded or implicit:
  - custom punchout vs cardstock vs sticker choice
  - bespoke slug/template assumptions versus stock-shape slugged sets
  - dial window and assembled-orientation readability
  - standee, hinge, spinner, and slot-geometry cautions
  - dual-layer-board pocket alignment and three-surface requirements
  - child-member awareness for `twosidedsluggedset`, `onesidedsluggedset`, and `threesidedcustomcutset`

### Routing / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Updated `README.md`
- Updated `skills/tgc-component-preflight/SKILL.md`
- Updated `skills/tgc-component-preflight/references/workflows.md`
- Removed the migrated custom-cut seed entries from:
  - `skills/tgc-component-preflight/references/component-profiles.md`

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - added `tgc-custom-cut-workflows`
  - added custom-cut routing cases for:
    - custom slug choice,
    - dual-layer-board preflight,
    - standee slot-geometry guidance
  - kept dial proof-fit remediation routed to `tgc-image-preflight-fit`

## Verification
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`8` skill fixture sets, `22` routing cases)
  - validator fixture tests: pass
- Ran: `npm --prefix code run report:component-matrix`
  - result: success

## Coverage impact
- Before custom-cut pass:
  - identity coverage: `133/201` (`66%`)
  - `tgc-custom-cut-workflows`: `5/53`
- After custom-cut pass:
  - identity coverage: `181/201` (`90%`)
  - `tgc-custom-cut-workflows`: `53/53` identities baseline-guided (`100%`)

## Notes
- The remaining baseline gaps are now concentrated in:
  - books long-tail,
  - score pads,
  - parts long-tail.
- With packaging, cards, boards/mats, and custom-cut now at full baseline coverage, the most valuable next family is `tgc-book-rulebook-workflows`.

## Next
- Recommended next family: `tgc-book-rulebook-workflows`
  - current owner-family baseline: `5/22`
  - remaining gaps include folios, booklet long-tail, score pads, and additional book formats
