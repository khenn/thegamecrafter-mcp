# 2026-03-12 - A5 Packaging Workflows Baseline Coverage

## Objective
Begin A5 family implementation with packaging:
- create a dedicated packaging skill,
- migrate packaging-specific guidance out of generic component preflight,
- update routing/install docs,
- raise baseline guidance coverage for all packaging identities.

## Scope classification
- Component-family specific: packaging
- Global impact: router delegation, public agent guidance, README skill install guidance, and coverage generation

## Changes

### New focused skill
- Added `skills/tgc-packaging-workflows/`
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflows.md`
  - `references/component-profiles.md`

### Packaging guidance migration
- Moved packaging-specific reference ownership out of:
  - `skills/tgc-component-preflight/references/component-profiles.md`
- Packaging skill now owns:
  - packaging source set links,
  - family slot models,
  - packaging-specific hard gates,
  - all 48 active packaging identities with baseline profile entries.

### Router / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/workflows.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Updated `skills/tgc-component-preflight/SKILL.md`
- Updated `skills/tgc-component-preflight/references/workflows.md`

### Coverage generation
- Updated `code/scripts/dev/generate-component-capability-matrix.ts`
  - dynamically discovers skill profile files ending in `component-profiles.md`
  - includes new packaging profile file in coverage outputs

### Install/docs
- Updated `README.md`
  - skill install section now describes the TGCMCP skill stack instead of only the router skill

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - added `tgc-packaging-workflows`
  - added packaging-specific routing cases

## Verification
- Ran: `npm --prefix code run report:component-matrix`
  - result: success
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`5` skill fixture sets, `14` routing cases)
  - validator fixture tests: pass

## Coverage impact
- Before packaging pass:
  - identity coverage: `24/201` (`12%`)
- After packaging pass:
  - identity coverage: `65/201` (`32%`)
- Packaging owner-family baseline:
  - `tgc-packaging-workflows`: `48/48` identities baseline-guided (`100%`)

## Notes
- This is baseline-guidance completion for packaging under the Phase 1/Phase 3 contract, not full live parity closure for the family.
- `VHSBox`, `MintTin`, and `PokerEnvelope` were treated as packaging outliers using live product metadata so their slot models are not guessed from the common box APIs.

## Next
- Recommended next family: `tgc-card-deck-workflows`
  - current baseline: `0/24`
  - high user frequency and strong context-isolation payoff
