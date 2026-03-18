# 2026-03-13 - A5 Parts/Dice Workflows Baseline Coverage

## Objective
Finish the remaining A5 baseline-guidance gap by implementing the parts/dice workflow family:
- create a dedicated parts workflow skill,
- route acrylic, printed-dice, printed-meeple, and play-money prompts out of the generic component stack,
- raise baseline guidance coverage for the final owner-mapped identities,
- complete 100% catalog baseline guidance coverage in the generated owner map.

## Scope classification
- Component-family specific: acrylic shapes, printed dice, printed meeples, and play money
- Global impact: router delegation, public agent guidance, README skill install guidance, generic preflight ownership cleanup, and routing tests

## Changes

### New focused skill
- Added `skills/tgc-parts-dice-workflows/`
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflows.md`
  - `references/component-profiles.md`

### Guidance captured
- Added baseline coverage for all 8 owner-mapped parts identities.
- Captured the remaining parts-family decision points that were previously seeded or missing:
  - acrylic thickness choice and double-sided art expectations
  - per-face completeness for printed D4/D6/D8 dice
  - white-print and PNG-quality cautions for printed dice
  - printed-meeple face/back completeness
  - play-money long-edge flip orientation
  - IP/legal caution for real-currency imitation on play money

### Routing / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/workflows.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Updated `README.md`
- Updated `skills/tgc-component-preflight/SKILL.md`
- Updated `skills/tgc-component-preflight/references/workflows.md`
- Removed migrated parts seed entries from:
  - `skills/tgc-component-preflight/references/component-profiles.md`

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - added `tgc-parts-dice-workflows`
  - added routing cases for:
    - acrylic vs printed meeple choice
    - play-money long-edge flip orientation

## Verification
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`9` skill fixture sets, `26` routing cases)
  - validator fixture tests: pass
- Ran: `npm --prefix code run report:component-matrix`
  - result: success

## Coverage impact
- Before parts-family pass:
  - identity coverage: `198/201` (`99%`)
  - `tgc-parts-dice-workflows`: `5/8`
- After parts-family pass:
  - identity coverage: `201/201` (`100%`)
  - `tgc-parts-dice-workflows`: `8/8` identities baseline-guided (`100%`)

## Notes
- This completes A5 baseline guidance coverage across all active catalog identities in the generated owner map.
- The next A5 work is no longer family backfill. Remaining work shifts to:
  - stronger than baseline guidance depth where needed,
  - Claude sandbox install and minimal-context validation,
  - live parity testing and regression hardening.

## Next
- Recommended next step: execute the planned Claude sandbox validation phase for skill installation, per-family prompt packs, and context-loading verification.
