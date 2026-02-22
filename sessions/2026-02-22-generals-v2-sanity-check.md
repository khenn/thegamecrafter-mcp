# Session: Generals-v2 Copy Capability Sanity Check

Date: 2026-02-22

## Target Game
- Name: `Generals-v2`
- Game ID: `64DC0B18-EE95-11E8-A07F-7EA0C1FB3B94`

## Interrogation Summary
- `tgc_game_get` succeeded and returned full `component_list` with mixed component types.
- `tgc_game_decks_list` returned 4 decks:
  - `Reference` (PokerDeck, 6 cards)
  - `Sectors` (SquareDeck, 20 cards)
  - `Base Buildings` (MiniDeck, 128 cards)
  - `Spy` (MiniDeck, 16 cards)
- `tgc_deck_cards_list` confirmed card traversal is available for all deck identities above.
- `tgc_game_gameparts_list` returned 7 stock parts (dice colors + quantities), page 1 only.

## Capability Verdict
Manual copy (primitive reconstruction) is **partially supported**:
- Supported now:
  - game create/update/delete
  - deck create + bulk card copy
  - stock part interrogation (existing `gameparts` endpoint surface)
- Missing for full Generals-v2-equivalent copy:
  - read tools to enumerate non-deck component instances with IDs (domino mats, standees, screens, mats, sticker sets, etc.)
  - write tools to create those non-deck components in a new game
  - or a validated way to relink existing non-deck components using IDs (not exposed by current MCP surface)

## Noted Tool Gap
- `tgc_game_cost_breakdown_get` currently returns "implemented: false" (contract only).

## Conclusion
Current MCP can fully rebuild deck/card portions, but cannot yet fully rebuild all non-deck components required by `Generals-v2` using the same manual-copy method.
