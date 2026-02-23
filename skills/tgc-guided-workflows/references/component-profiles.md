# Component Profiles (Implemented Seed Set)

Use these for preflight checks, recommendations, and user-facing links.

## Document (`Document`)
- Product: `https://www.thegamecrafter.com/make/products/Document`
- Help: `https://help.thegamecrafter.com/article/89-documents`
- Size: `2550x3300`
- Notes: folded document behavior, not stapled.

## Large Booklet (`LargeBooklet`)
- Product: `https://www.thegamecrafter.com/make/products/LargeBooklet`
- Help: `http://help.thegamecrafter.com/article/80-booklets`
- Size: `1575x2475`
- Rules: page count multiple of 4; max 40 pages.
- Preflight: if not multiple of 4, offer blank-page padding.
- Rulebook suitability: good for short rulebooks; not viable above 40 pages.

## Medium Coil Book (`MediumCoilBook`)
- Product: `https://www.thegamecrafter.com/make/products/MediumCoilBook`
- Size: `1575x2325`
- Rules: min 4, max 200 pages.
- Rulebook suitability: viable across a wide page range; good fallback when booklet constraints fail.

## Digest Perfect Bound Book (`DigestPerfectBoundBook`)
- Product: `https://www.thegamecrafter.com/make/products/DigestPerfectBoundBook`
- Help: `https://help.thegamecrafter.com/article/468-setting-up-a-spine`
- Size: `1725x2625`
- Rules: min 40, max 200 pages.
- Preflight: if odd pages, offer one blank page for even parity.
- Rulebook suitability: strong fit for longer manuals (for example 40+ pages) with spine/binding considerations.

## Medium Score Pad Color (`MediumScorePadColor`)
- Product: `https://www.thegamecrafter.com/make/products/MediumScorePadColor`
- Help: `http://help.thegamecrafter.com/article/95-score-pads`
- Size: `1425x2475`

## Packaging Family Snapshot
- `tuckbox` (`PokerTuckBox54`): `outsideFileId` at `2325x1950`
- `hookbox` (`PokerHookBox54`): `outsideFileId`, `insideFileId` at `2850x3375`
- `twosidedbox` (`MediumStoutBox`): `topFileId`, `bottomFileId` at `3675x4575`
- `boxtop` (`MediumStoutBoxTopAndSide`): `topFileId` at `3675x4575`
- `boxtopgloss` (`LargeStoutBoxTopAndSide`): `topFileId`, `spotGlossFileId` at `5925x5925`
- `twosidedboxgloss` (`LargeStoutBox`): `topFileId`, `bottomFileId`, `spotGlossFileId`, `spotGlossBottomFileId` at `5925x5925`
- `boxface` (`PokerBooster`): `faceFileId` at `975x1350`

Finish behavior notes:
- `boxtopgloss` and `twosidedboxgloss` validated with `surfacing_treatment` including `Linen Finish`.
- `tuckbox`, `hookbox`, `twosidedbox`, and `boxtop` did not persist `surfacing_treatment` in tested flow.

## Batch 1 Authoritative References (Packaging)

### tuckbox (`PokerTuckBox54`)
- Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox54`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/PokerTuckBox54`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - `https://www.youtube.com/watch?v=Mk4sKxZ6ciQ`
  - `https://www.youtube.com/watch?v=6qFbCzbvtZs`
  - `https://www.youtube.com/watch?v=Ta1F6p6MAyE`

### hookbox (`PokerHookBox54`)
- Product: `https://www.thegamecrafter.com/make/products/PokerHookBox54`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/PokerHookBox54`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - `https://www.youtube.com/watch?v=Lz_0EHN1wUA`

### twosidedbox (`MediumStoutBox`)
- Product: `https://www.thegamecrafter.com/make/products/MediumStoutBox`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/MediumStoutBox`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - `https://www.youtube.com/watch?v=V5Fa7mA7OG4`
  - `https://www.youtube.com/watch?v=K_MIjh_3qAI`

### boxtop (`MediumStoutBoxTopAndSide`)
- Product: `https://www.thegamecrafter.com/make/products/MediumStoutBoxTopAndSide`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/MediumStoutBoxTopAndSide`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - `https://www.youtube.com/watch?v=V5Fa7mA7OG4`

### boxtopgloss (`LargeStoutBoxTopAndSide`)
- Product: `https://www.thegamecrafter.com/make/products/LargeStoutBoxTopAndSide`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/LargeStoutBoxTopAndSide`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - no product-level videos returned by current product metadata snapshot.

### twosidedboxgloss (`LargeStoutBox`)
- Product: `https://www.thegamecrafter.com/make/products/LargeStoutBox`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/LargeStoutBox`
- Help: `http://help.thegamecrafter.com/article/83-boxes`
- Video content:
  - `https://www.youtube.com/watch?v=yzBvMRUthsU`
  - `https://www.youtube.com/watch?v=K_MIjh_3qAI`

### boxface (`PokerBooster`)
- Product: `https://www.thegamecrafter.com/make/products/PokerBooster`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/PokerBooster`
- Help: `https://help.thegamecrafter.com/article/364-booster-packs-faq`
