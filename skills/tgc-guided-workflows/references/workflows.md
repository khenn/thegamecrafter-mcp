# Workflows Reference

## Baseline: Create Game
1. `tgc_auth_login` if no active session.
2. Resolve `designerId`:
- use user-provided value if given,
- otherwise call `tgc_designer_list` and select primary designer.
3. Ask user only for `name` if missing.
4. Call `tgc_game_create`.
5. Return `gameId`, `name`, and next actions.

## Rulebook From PDF (Outcome-Based)
When user asks for a rulebook but does not specify component type:
1. Evaluate viable implemented options (typically `LargeBooklet`, `MediumCoilBook`, `DigestPerfectBoundBook`) against page count and constraints.
2. Present 2-3 viable options with concise tradeoffs:
- fit (page-count compatibility),
- constraints (min/max, parity, multiple-of-4),
- approximate cost in configured currency when available.
3. Ask user to choose one option before create.
4. If only one option is viable, explain why other options are excluded and ask for explicit confirmation before create.
5. Before upload, run print-safe preflight and offer remediation if clipping/binding risk is detected.

## Proof Feedback Loop (Image Fit)
When user shares proof feedback or screenshot issues:
1. Classify issue type:
- trim clipping,
- binding/gutter clipping,
- excessive letterboxing,
- undesired crop/coverage.
2. Apply deterministic parameter changes:
- adjust fit mode (`safe`/`near-trim`/`full-bleed`),
- adjust insets (outer/binding),
- adjust padding/fill strategy.
3. Re-render and patch in place.
4. Report old vs new parameters and IDs.

## Component Revision Workflow (Global, Non-Deck)
When user asks to revise an existing non-deck component (name/art/options):
1. Resolve target component identity (`componentType` + `componentId`).
2. Apply `tgc_component_update` with only requested field changes.
3. Verify same component id remains present via `tgc_game_components_list`.
4. Report exactly what changed.
5. Do not create a replacement/duplicate component unless user explicitly requests a new variant/copy.

## Surfacing Workflow (Make Tab)
When user asks to change UV coating or linen texture:
1. Call `tgc_game_surfacing_get` and report current settings.
2. If either target value is missing, ask once for both:
- `enableUvCoating` (`true`/`false`)
- `enableLinenTexture` (`true`/`false`)
3. Call `tgc_game_surfacing_set` with one or both supplied values.
4. Report resulting state and remind user to verify Production Cost deltas in TGC UI.

## Downloadable File Workflow (Make Tab)
When user asks to add a downloadable file:
1. Upload the local file via `tgc_file_upload`.
2. Ask for/derive a user-facing download name if missing.
3. Attach the uploaded file to the game using `tgc_gamedownload_create` (`gameId`, `fileId`, `name`, optional `free`).
4. Report `gamedownloadId` and file details.

## Stock Component Workflow (Make Tab)
Current support level is constrained but usable:
1. Discover candidate stock products using `tgc_tgc_products_list`.
2. Resolve required linkage identifiers (`partId`, `componentType`, `componentId`) from known product/game data.
3. Link to the game via `tgc_gamepart_upsert`.
4. If one-step stock-component add is unavailable, explicitly communicate this and proceed with the supported linking path.

## Embedded Game Workflow (Make Tab)
Current status:
- Dedicated embedded-game mutation is not implemented in MCP yet.
- If requested, state this limitation clearly and direct the user to complete Add Embedded Game in TGC UI.

## Dial Artwork Workflow (Dual Dial Included)
When user asks for a dial and does not provide precise geometry instructions:
1. Gather visual intent only:
- labels/terms (for example `HP`, `MANA`),
- style preferences (color/theme/typography),
- track semantics (range/direction) if needed.
2. Run dial geometry preflight:
- resolve dial mask/cut/safe/fold/hole/window regions,
- compute safe label zones.
3. Auto-place dial content:
- assign labels to geometry-safe zones nearest corresponding windows,
- keep label boxes and symbols out of punched/fold conflict areas,
- ensure wheel/center-hole areas remain readable and uncluttered.
4. Validate final play orientation readability.
5. Upload and mutate.
6. If proof feedback arrives, iterate deterministically and patch in place (not duplicate by default).

## Interrogate Game Components
- Default: return all component types present.
- Narrow to one type only when user explicitly requests that filter.
- For set-based components, list container then members:
1. `tgc_game_components_list`
2. `tgc_component_items_list` with `relationship=members`

## Primitive Manual-Copy Sequence
1. Authenticate + resolve source game:
- `tgc_auth_login`
- `tgc_designer_list`
- `tgc_game_list`
2. Interrogate source graph before any mutation:
- `tgc_game_get`
- `tgc_game_decks_list`
- `tgc_deck_cards_list`
- `tgc_card_get`
- `tgc_file_get`
- `tgc_file_references_get`
- `tgc_game_gameparts_list`
- `tgc_game_components_list`
- `tgc_component_items_list` for set members
3. Rebuild in target with primitive write tools.
4. Treat `tgc_game_copy` as optional benchmark, not the primary capability target.

## Community Feedback Capture (Optional, Opt-In)
Use this when the user wants to help improve the public agent/skills without manual maintainer coaching.

1. Ask once at session start:
- "Would you like to contribute learning notes from this session to improve TGCMCP agent behavior and skills?"
2. Persist the answer locally in `.tgc-feedback/preferences.json` (gitignored) to avoid repeated prompts.
3. If opted in, capture concise notes during work:
- what failed,
- what worked,
- what guardrail would have prevented friction,
- which component/workflow was affected.
4. At session end, publish a GitHub issue using the repository feedback template.
5. If issue publish is unavailable, write a pending note under `contrib/feedback/` for later submission.
