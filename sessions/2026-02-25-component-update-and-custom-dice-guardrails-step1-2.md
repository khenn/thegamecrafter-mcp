# Session: Component Update + Custom Dice Guardrails (Steps 1-2)

Date: 2026-02-25

## Objective
Implement updated plan steps 1 and 2 from feedback issue #1:
1) add global non-deck in-place component update tool,
2) add custom-dice guardrails for side-slot completeness and identity requirements.

## Implemented
- Added new MCP tool contract and implementation:
  - `tgc_component_update`
  - files:
    - `code/src/mcp/contract.ts`
    - `code/src/mcp/handlers.ts`
    - `code/src/tgc/service.ts`
- `tgc_component_update` supports safe mutable-field updates for non-deck components:
  - name/identity/quantity
  - file slots (`face/back/front/outside/inside/inner/top/bottom/spotGloss`)
  - side slots (`side1..side8`)
  - proof flags
  - `dieColor` (`diecolor` alias accepted in handler)
- Extended `tgc_component_create` to accept `dieColor`.
- Added custom-dice create guardrails in handler:
  - component types: `customcolord4`, `customcolord6`, `customcolord8`
  - enforce required side slots for each die type
  - enforce identity and auto-infer when omitted:
    - `customcolord4` -> `CustomColorD4`
    - `customcolord6` -> `CustomColorD6`
    - `customcolord8` -> `CustomColorD8`

## Validation
- Added live integration test:
  - `code/scripts/dev/test-component-update-custom-dice.ts`
  - npm script: `test:integration:component-update-custom-dice`
- Test flow:
  - create `CustomColorD6`
  - update same component in-place (`name`, `side3FileId`, `dieColor`)
  - verify readback by same component id and updated name
- Results:
  - `npm run typecheck` passed
  - `npm run test:integration:component-update-custom-dice` passed

## Docs/Skills Updates
- Updated tool contract docs:
  - `tools/tgc-mcp-tool-contract-v1.md`
- Updated public guidance for custom-dice identity/slot guardrails:
  - `context/TGCAGENT.md`
  - `skills/tgc-guided-workflows/SKILL.md`
  - `skills/tgc-guided-workflows/references/component-profiles.md`
