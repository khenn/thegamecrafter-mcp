# Session: Batch 1 authoritative component-page references

## Date
- 2026-02-23

## Goal
- Backfill authoritative TGC component references for already-implemented Batch 1 packaging families, following the same rules used for new components.

## Source Validation Method
- Pulled live product metadata from:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`
- Resolved canonical links from product metadata fields (`view_uri`, `info`, `videos`).

## Batch 1 Components Covered
- `tuckbox` / `PokerTuckBox54`
- `hookbox` / `PokerHookBox54`
- `twosidedbox` / `MediumStoutBox`
- `boxtop` / `MediumStoutBoxTopAndSide`
- `boxtopgloss` / `LargeStoutBoxTopAndSide`
- `twosidedboxgloss` / `LargeStoutBox`
- `boxface` / `PokerBooster`

## Files Updated
- `skills/tgc-guided-workflows/references/component-profiles.md`
  - added authoritative product page, product API, help, and video links for all Batch 1 components.
- `context/AGENTS.md`
  - added Batch 1 implemented references block for preflight/linking behavior parity with Batch 2.

## Notes
- `LargeStoutBoxTopAndSide` returned no product-level videos in current metadata snapshot.
