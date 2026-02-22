# Session Note - 2026-02-22 (Unrestricted `tgc_game_list`)

## Change
- Updated `tgc_game_list` to be unrestricted/global by default.
- Added optional filters:
  - `designerId`
  - `userId`

## Rationale
- Preserve full public-list functionality and avoid implicit account-only restrictions.
- Let LLMs narrow results using explicit filter inputs.

## Validation
- `npm run typecheck` passed.
- `npm run build` passed.
- Runtime tests confirmed:
  - global listing works without auth
  - filtered listing by `userId` works after auth
