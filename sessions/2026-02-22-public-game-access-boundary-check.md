# Session Log - 2026-02-22 - Public Game Access Boundary Check

## Summary
Validated what our MCP tool can read from non-owned public games to support component coverage work.

## Actions
- Authenticated via `tgc_auth_login`.
- Queried public games with `tgc_game_list` (no designer filter).
- Probed one public game (`Quartet`) with:
  - `tgc_game_get`
  - `tgc_game_decks_list`
  - `tgc_deck_cards_list`
  - `tgc_card_get`
- Probed one public game (`Pet Shop`) with:
  - `tgc_game_components_list` for `twosidedsets`, `twosidedsluggedsets`, `onesidedsluggedsets`, `booklets`, `documents`
  - `tgc_component_items_list` (`relationship=members`) on returned set IDs.

## Findings
- Public game reads include rich metadata for non-owned games:
  - game metadata and `component_list`
  - deck metadata and card instance metadata (card IDs, names, quantities)
  - non-deck container metadata and member instance metadata.
- Returned payloads did not expose editable source file IDs for non-owned art in tested calls.
- Public preview URIs are visible where provided by TGC/public game metadata.

## Outcome
- Public-game interrogation is viable for schema discovery and component-family reconnaissance.
- It should not be used as an art/content harvesting path.
- For unsupported create flows without owned examples, use disposable synthetic fixtures.

## Docs Updated
- `skills/tgc-guided-workflows/SKILL.md` guardrails expanded for public metadata reconnaissance.
- `ROADMAP.md` Milestone 6 now includes reconnaissance + synthetic fixture workflow items.
