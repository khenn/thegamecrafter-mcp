# TGC Guided Router Workflows

This reference is orchestration-only. Use focused skills for deep constraints.

## Routing Rules
- Use `tgc-component-preflight` for component option validation and mutation readiness.
- Use `tgc-book-rulebook-workflows` for rulebook/book creation, parity, and page sequencing.
- Use `tgc-image-preflight-fit` for bleed/trim/safe-zone geometry and proof remediation.

## Baseline: Create Game
1. `tgc_auth_login` if no active session.
2. Resolve `designerId`:
   - use user-provided value if given,
   - otherwise call `tgc_designer_list` and select primary designer.
3. Ask user only for `name` if missing.
4. Call `tgc_game_create`.
5. Return `gameId`, `name`, and next actions.

## Component Revision Workflow (Global, Non-Deck)
1. Resolve target component identity (`componentType` + `componentId`).
2. Apply `tgc_component_update` with only requested field changes.
3. Verify same component id remains present via `tgc_game_components_list`.
4. Report exactly what changed.
5. Do not create duplicates unless user explicitly asks for a variant/copy.

## Surfacing Workflow (Make Tab)
1. Call `tgc_game_surfacing_get` and report current settings.
2. If either target value is missing, ask once for both:
   - `enableUvCoating` (`true`/`false`)
   - `enableLinenTexture` (`true`/`false`)
3. Call `tgc_game_surfacing_set` with one or both supplied values.
4. Report resulting state and remind user to verify Production Cost deltas in TGC UI.

## Downloadable File Workflow (Make Tab)
1. Upload local file via `tgc_file_upload`.
2. Ask for/derive download name if missing.
3. Attach file to game using `tgc_gamedownload_create`.
4. Report `gamedownloadId` and file details.

## Stock Component Workflow (Make Tab)
1. Discover candidate stock products using `tgc_tgc_products_list`.
2. Resolve linkage identifiers (`partId`, `componentType`, `componentId`) from known product/game data.
3. Link to game via `tgc_gamepart_upsert`.
4. If one-step add is unavailable, state limitation and continue with supported linking path.

## Embedded Game Workflow (Make Tab)
- Dedicated embedded-game mutation is not implemented in MCP yet.
- If requested, state limitation and direct user to TGC UI.

## Test Reports Workflow
1. Call `tgc_game_test_reports_get`.
2. Summarize interpreted status for `sanitytests`, `arttests`, `cvtests`.
3. Recommend Test-tab checks before prototype order when reports are missing.

## Make Readiness Workflow
1. Call `tgc_make_readiness_check`.
2. If blocked, stop and resolve blockers.
3. If warnings, present fixes.
4. If ready, proceed with ordering guidance.

## Help-Center-Grounded Guidance
1. Load `tgc-help-center-guidance.md`.
2. Load `tgc-help-center-catalog.md` when topic-specific links are needed.
3. Keep policy/process guidance separate from mutation guidance.

## Interrogate Game Components
- Default: return all component types.
- Narrow only when user explicitly requests a type filter.
- For set families, list container then members:
  1. `tgc_game_components_list`
  2. `tgc_component_items_list` with `relationship=members`

## Community Feedback Capture (Event-Driven)
1. Respect `preferences.feedback_contribution`.
2. Only draft issue text for non-trivial, reusable, undocumented learnings.
3. Show exact draft text and ask explicit publication approval.
4. If publishing unavailable, write pending note under `contrib/feedback/`.
