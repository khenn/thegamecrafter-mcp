# Session: Generals-v2 Component Primitives Implemented

Date: 2026-02-22

## Goal
Add MCP primitives required to reconstruct non-deck components for complex games like `Generals-v2`.

## Implemented MCP Tools
- `tgc_game_components_list`
  - Lists `game/{id}/{relationship}` component families (e.g. `twosidedsets`, `onesidedsluggedsets`).
- `tgc_component_items_list`
  - Lists set child items via `component/{id}/members` traversal.
- `tgc_component_create`
  - Creates non-deck component containers (e.g. `twosidedset`, `twosidedsluggedset`, `onesidedsluggedset`).
- `tgc_component_item_create`
  - Creates items within set containers (e.g. `twosided`, `twosidedslugged`, `onesidedslugged`).

## Service/Handler/Contract Changes
- Updated:
  - `code/src/mcp/contract.ts`
  - `code/src/mcp/handlers.ts`
  - `code/src/tgc/service.ts`
- Added safe token validation for dynamic endpoint segments.

## Integration Test Added
- `code/scripts/dev/test-component-primitives.ts`
- npm script:
  - `test:integration:component-primitives`

## Live Test Result
- Passed end-to-end against TGC:
  - `twosidedset` + `twosided`
  - `twosidedsluggedset` + `twosidedslugged`
  - `onesidedsluggedset` + `onesidedslugged`
- Test creates temporary resources and deletes the temporary game in cleanup.

## Key Discovery
- For set-based components, child traversal is through relationship `members` (not `twosideds`/`onesidedsluggeds` paths).

## Documentation Updates
- `ROADMAP.md` updated with Milestone 5.5 for complex component primitives.
- Updated guidance in:
  - `AGENTS.md`
  - `context/AGENTS.md`
  - `skills/tgc-guided-workflows/SKILL.md`
