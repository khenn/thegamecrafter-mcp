# Session: Batch 5 Specialty Parts Complete

Date: 2026-02-24

## Objective
Implement Batch 5 API-family coverage for specialty parts and custom dice/meeples, then validate with live create/readback tests.

## Changes
- Extended `tgc_component_create` contract/schema/service mapping to support side-slot file IDs:
  - `side1FileId` through `side8FileId` (mapped to `side1_id` through `side8_id` in TGC form payload).
- Added live integration test:
  - `code/scripts/dev/test-batch5-specialty-parts.ts`
  - Creates/validates:
    - `acrylicshape` (`AcrylicShape125`)
    - `customcolord4` (`CustomColorD4`)
    - `customcolord6` (`CustomColorD6`)
    - `customcolord8` (`CustomColorD8`)
    - `customprintedmeeple` (`CustomPrintedMeeple`)
- Added npm script:
  - `test:integration:batch5-specialty-parts`
- Updated capability matrix generator validated API set with:
  - `/api/acrylicshape`
  - `/api/customprintedmeeple`
  - `/api/customcolord4`
  - `/api/customcolord6`
  - `/api/customcolord8`
- Updated docs/roadmap/skill references:
  - `tools/tgc-mcp-tool-contract-v1.md`
  - `tools/tgc-gap-closure-plan.md`
  - `ROADMAP.md`
  - `context/AGENTS.md`
  - `skills/tgc-guided-workflows/SKILL.md`
  - `skills/tgc-guided-workflows/references/component-profiles.md`

## Validation
- `npm run typecheck` passed.
- `npm run test:integration:batch5-specialty-parts` passed.
- `npm run report:component-matrix` regenerated matrix with full coverage:
  - products discovered: 201
  - fully supported: 201
  - gaps: 0

## Notes
- Batch 5 completes API-family catalog coverage from `GET /api/tgc/products` create endpoints.
- Remaining next batch is Batch 6 hardening/automation (coverage regression guardrails, CI checks, and process tightening).
