# 2026-03-12 - A5 Board/Mat Workflows Baseline Coverage

## Objective
Continue A5 family implementation with boards, mats, and screens:
- create a dedicated board/mat workflow skill,
- route board-like prompts out of the generic component stack,
- raise baseline guidance coverage for all owner-mapped board/mat/screen identities,
- add the future Claude sandbox validation phase to the roadmap.

## Scope classification
- Component-family specific: boards, mats, screens
- Global impact: roadmap, router delegation, public agent guidance, README skill install guidance, and routing tests

## Changes

### Plan update
- Updated `ROADMAP.md`
  - added post-build validation substep for:
    - sandboxed Claude install area,
    - per-family Claude test prompts,
    - context-loading verification for minimal-context behavior.

### New focused skill
- Added `skills/tgc-board-mat-workflows/`
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflows.md`
  - `references/component-profiles.md`

### Guidance captured
- Added baseline coverage for all 46 owner-mapped board/mat/screen identities.
- Captured board/mat/screen decision points that were previously only implicit:
  - board vs mat vs neoprene vs screen choice
  - fold-aware proofing and 3D viewer guidance
  - dry-erase versus linen caveats
  - side-label differences (`face/back` vs `inside/outside` vs single `face`)
  - screen-specific privacy/readability framing
- Explicitly left dual-layer boards in the custom-cut family because their create path and geometry constraints differ materially.

### Routing / public behavior updates
- Updated `skills/tgc-guided-workflows/SKILL.md`
- Updated `skills/tgc-guided-workflows/references/workflows.md`
- Updated `skills/tgc-guided-workflows/references/skill-routing-map.md`
- Updated `context/TGCAGENT.md`
- Updated `README.md`
- Removed remaining board/mat seed entries from:
  - `skills/tgc-component-preflight/references/component-profiles.md`

### Trigger coverage
- Updated `tests/skills/prompts/trigger-matrix.json`
  - added `tgc-board-mat-workflows`
  - added board/mat/screen routing cases
  - kept image-fit routing separated from board-family routing

## Verification
- Ran: `npm --prefix code run report:component-matrix`
  - result: success
- Ran: `npm --prefix code run skills:test`
  - validate: pass
  - triggers/routing: pass (`7` skill fixture sets, `19` routing cases)
  - validator fixture tests: pass

## Coverage impact
- Before board/mat pass:
  - identity coverage: `89/201` (`44%`)
  - `tgc-board-mat-workflows`: `2/46`
- After board/mat pass:
  - identity coverage: `133/201` (`66%`)
  - `tgc-board-mat-workflows`: `46/46` identities baseline-guided (`100%`)

## Notes
- The remaining category gaps now cluster heavily in:
  - punchouts/custom-cut,
  - books long-tail,
  - stickers,
  - parts long-tail.
- Because many remaining gaps are custom-cut and geometry-heavy, the next most valuable family is `tgc-custom-cut-workflows`.

## Next
- Recommended next family: `tgc-custom-cut-workflows`
  - current owner-family baseline: `5/53`
  - highest remaining owner-family gap count
