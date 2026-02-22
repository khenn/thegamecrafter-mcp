# Session: Move Subprojects To Root + Step 4 Read Primitives

## Date
- 2026-02-22

## Objective
- Move local exploratory work from `logs/subprojects/` to top-level `subprojects/`.
- Complete Step 4 of the ZCH copy subproject by implementing missing primitive read tools and validating live.

## Structural Changes
- Moved subproject workspace to:
  - `subprojects/zch-copy-lab/`
- Updated ignore policy for local-only subprojects:
  - `.gitignore` now ignores `subprojects/*` except `subprojects/.gitkeep`.
- Updated canonical structure guidance:
  - `context/STRUCTURE.md` now includes `subprojects/`.
- Updated root agent folder expectations:
  - `AGENTS.md` now references `subprojects/` as local exploratory sandbox location.

## Step 4 Tooling Implemented
- Expanded game read:
  - `tgc_game_get` now supports `includeRelationships`.
- Added read tools:
  - `tgc_game_decks_list`
  - `tgc_deck_cards_list`
  - `tgc_game_gameparts_list`
  - `tgc_deck_get`
  - `tgc_card_get`
  - `tgc_part_get`
  - `tgc_file_get`
  - `tgc_file_references_get`

## Validation
- `npm run typecheck` passed.
- `npm run build` passed.
- Live handler-level interrogation test against `Zombicide Character Help` succeeded:
  - Source game resolved by name.
  - Deck listing returned 2 decks.
  - Deck card listing and card fetch succeeded.
  - File fetch and file-reference listing succeeded for sample card face file.
  - Gamepart listing succeeded.

## Subproject Progress
- `subprojects/zch-copy-lab/STATUS.md` updated:
  - Step 4 marked complete.
