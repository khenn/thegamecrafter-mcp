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
