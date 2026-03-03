# 2026-03-02 - Goal A5 Step 1 Coverage Index + Scorecard

## Objective
Implement Step 1 from the skills hardening plan:
- auto-generate a component coverage index from live TGC catalog data,
- compute current skill coverage vs underserved identities,
- produce a scorecard artifact for prioritization.

## Changes
- Updated generator script:
  - `code/scripts/dev/generate-component-capability-matrix.ts`
- Added/updated generated artifacts:
  - `tools/tgc-component-capability-matrix.md`
  - `tools/tgc-component-coverage-index.md`
  - `tools/tgc-skill-coverage-scorecard.md`

## Implementation Notes
- Reused existing live catalog generator path (`/api/tgc/products`) to avoid duplicate logic.
- Added coverage profile extraction from:
  - `skills/tgc-component-preflight/references/component-profiles.md`
  - `skills/tgc-book-rulebook-workflows/references/book-component-profiles.md`
- Coverage definition for this step:
  - an identity is "covered" when it has explicit baseline guidance in the above skill references.

## Verification
- Ran: `npm run report:component-matrix` in `code/`
- Result:
  - capability matrix regenerated successfully,
  - coverage index generated,
  - scorecard generated.

## Current Snapshot
- Total active products: 201
- Skill-covered identities: 24
- Underserved identities: 177
- Coverage: 12%
- Highest underserved categories:
  - Packaging (41)
  - Punchouts (38)
  - Mats (27)
  - Cards (24)

## Next
- Use the new scorecard/index to drive family-level baseline profile expansion (Step 2).
