# 2026-03-12 - A5 Detailed Plan and Phase 1 Foundation

## Objective
Lock the approved A5 detailed plan into the public roadmap and begin Phase 1 for comprehensive guidance coverage:
- latest-doc/source refresh policy,
- strict guidance coverage contract,
- owner-family map for all active TGC identities.

## Changes

### Roadmap
- Updated `ROADMAP.md`
  - added locked `A5 Detailed Plan (2026-03-12)`,
  - added phased execution model,
  - added target workflow-family ownership model,
  - added A5 definition-of-done language focused on lean `TGCAGENT` plus deep skill-owned knowledge.

### Phase 1 contract + refresh policy
- Added `tools/tgc-guidance-coverage-contract.md`
  - defines `Level 0` through `Level 4` guidance maturity,
  - defines strict A5 completion target,
  - defines family ownership model and reference placement rules.
- Updated `tools/tgc-help-knowledge-strategy.md`
  - added Phase 1 refresh policy,
  - documented minimal-context guidance rule,
  - recorded source freshness audit marker for `2026-03-12`.

### Generator and artifacts
- Updated `code/scripts/dev/generate-component-capability-matrix.ts`
  - tracks source profile file(s) per covered identity,
  - assigns every active identity to a target owner family,
  - emits `tools/tgc-guidance-owner-map.md`,
  - includes contract input reference in scorecard output.
- Regenerated:
  - `tools/tgc-component-capability-matrix.md`
  - `tools/tgc-component-coverage-index.md`
  - `tools/tgc-skill-coverage-scorecard.md`
  - `tools/tgc-guidance-owner-map.md`

## Verification
- Ran: `npm --prefix code run report:component-matrix`
- Result:
  - products discovered: `201`
  - supported products: `201`
  - gaps: `0`
  - owner map generated successfully

## Phase 1 baseline snapshot
- Baseline guidance coverage remains `24/201` identities (`12%`).
- New owner-family summary:
  - `tgc-packaging-workflows`: `48` identities, `7` baseline-guided
  - `tgc-card-deck-workflows`: `24` identities, `0` baseline-guided
  - `tgc-custom-cut-workflows`: `53` identities, `5` baseline-guided
  - `tgc-board-mat-workflows`: `46` identities, `2` baseline-guided
  - `tgc-book-rulebook-workflows`: `22` identities, `5` baseline-guided
  - `tgc-parts-dice-workflows`: `8` identities, `5` baseline-guided

## Notes
- Public repo policy still avoids shipping automated crawling scripts.
- Phase 1 therefore records refresh policy and source-audit expectations in-repo, while keeping full refresh automation outside the public tree.
- The new owner map is the primary backlog driver for family-by-family A5 completion.

## Next
- Finish Phase 1 by deciding whether to keep `tgc-component-preflight` as a broad family skill or replace it with family-specific skills starting with packaging.
- Then begin Phase 3 implementation in priority order:
  1. packaging,
  2. cards/decks,
  3. custom-cut,
  4. boards/mats/screens.
