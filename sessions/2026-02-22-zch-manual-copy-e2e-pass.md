# Session: ZCH Manual Copy E2E Pass (Post-Restart)

## Objective
Validate full manual copy workflow for `Zombicide Character Help` after bulk card mapping fixes, without leaving residual games.

## Actions
- Added integration runner:
  - `code/scripts/dev/test-zch-manual-copy-e2e.ts`
- Added npm script:
  - `test:integration:zch-manual-copy-e2e` in `code/package.json`
- Ran:
  - `npm run typecheck`
  - `npm run test:integration:zch-manual-copy-e2e`

## Result
- End-to-end manual reconstruction succeeded:
  - Source game located: `41DDF3A4-2F76-11EC-A572-0D2F58AF5381`
  - Source decks copied:
    - `Complimentary` (19 cards)
    - `Heros` (180 cards)
  - Bulk create count and `face_id` integrity checks passed.
  - Deck card counts matched source after copy.
- Cleanup succeeded:
  - Temporary target game deleted: `07213F14-101D-11F1-8061-DB623C541315`

## Notes
- This confirms `tgc_deck_bulk_create_cards` now works for high-card-count deck reconstruction in manual copy workflows.
