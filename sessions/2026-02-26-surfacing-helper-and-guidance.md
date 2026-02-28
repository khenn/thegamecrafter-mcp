# Session Note - 2026-02-26 - Surfacing Helper and Guidance

## Summary
Implemented first-class game surfacing helpers and guidance to reduce ambiguity when configuring Make -> Surfacing options.

## Code Changes
- Added MCP tools to contract:
  - `tgc_game_surfacing_get`
  - `tgc_game_surfacing_set`
- Added handler schemas/cases for both tools.
- Added validation in `tgc_game_surfacing_set` requiring at least one of:
  - `enableUvCoating`
  - `enableLinenTexture`
- Added user-friendly prompt/error details when neither setting is provided.
- Added game patch key mappings:
  - `enableUvCoating -> enable_uv_coating`
  - `enableLinenTexture -> enable_linen_texture`

## Guidance Updates
- Updated `context/TGCAGENT.md` with explicit Surfacing workflow behavior.
- Updated `skills/tgc-guided-workflows/SKILL.md` and `references/workflows.md` to use surfacing helpers and prompt for both values together.

## Roadmap Updates
- Marked A7 surfacing sub-items complete in `ROADMAP.md`.

## Verification
- Build/typecheck pass pending in this session at time of note creation.
