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
- Help:
  - `https://help.thegamecrafter.com/article/39-templates`
  - `https://help.thegamecrafter.com/article/5-getting-started`
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
- Related help:
  - `https://help.thegamecrafter.com/article/39-templates`
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

## Batch 3 Authoritative References (Board/Mat Surfaces)

### onesided (`MediumGameMat`)
- Product: `https://www.thegamecrafter.com/make/products/MediumGameMat`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/MediumGameMat`
- Help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- Image size: `7275x4275`
- Image slot: `face`
- Video content:
  - `https://www.youtube.com/watch?v=c9O_P2C4NW0`
  - `https://www.youtube.com/watch?v=Mfaoks6DE3w`
- Notes:
  - ships outside game box; may increase shipping cost.

### onesidedgloss (`BiFoldBoard`)
- Product: `https://www.thegamecrafter.com/make/products/BiFoldBoard`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/BiFoldBoard`
- Help: `http://help.thegamecrafter.com/article/90-game-boards`
- Image size: `2775x5475`
- Image slot: `face`
- Notes:
  - foldable board form factor.
  - product notes indicate surfacing options are not suitable for dry-erase markers.

## Batch 4 Authoritative References (Advanced Cut + Dial)

### dial (`SmallDial`)
- Product: `https://www.thegamecrafter.com/make/products/SmallDial`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/SmallDial`
- Help: `http://help.thegamecrafter.com/article/87-dials`
- Image size: `825x2400`
- Image slot: `outside`
- Video content:
  - `https://www.youtube.com/watch?v=9g7X1eq-bkU`

### dial (`DualDial`)
- Product: `https://www.thegamecrafter.com/make/products/DualDial`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/DualDial`
- Help: `http://help.thegamecrafter.com/article/87-dials`
- Image size: `2550x1650` (validated in live run)
- Image slot: `outside`
- Notes:
  - assembled behavior matters: body is folded and pinned; wheels rotate behind windows.
  - do not judge label quality only in flat sheet orientation.
  - keep critical text out of:
    - fold/notch intrusions,
    - axle-hole rings,
    - indicator windows.
  - default to geometry-safe placement:
    - body labels (`HP`, `MANA`, etc.) should sit adjacent to their windows with conservative clearance.
    - avoid center wheel text unless explicitly requested.
  - run post-assembly readability check in expected play orientation before upload.

### customcutonesidedslugged (`CustomSmallSticker`)
- Product: `https://www.thegamecrafter.com/make/products/CustomSmallSticker`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomSmallSticker`
- Help:
  - `https://help.thegamecrafter.com/article/98-stickers`
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- Image size: `975x1575`
- Image slot: `face`

### customcuttwosidedslugged (`CustomSmallPunchout`)
- Product: `https://www.thegamecrafter.com/make/products/CustomSmallPunchout`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomSmallPunchout`
- Help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`
- Image size: `975x1575`
- Image slots: `face`, `back`
- Video content:
  - `https://www.youtube.com/watch?v=SSIoi6KnMik`

### threesidedcustomcutset (`SmallDualLayerBoard`) + threesidedcustomcut (`members`)
- Product: `https://www.thegamecrafter.com/make/products/SmallDualLayerBoard`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/SmallDualLayerBoard`
- Help: `http://help.thegamecrafter.com/article/658-dual-layer-boards`
- Related help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- Set image size: `1125x1725`
- Set image slots: `face`, `back`, `inner`
- Child API: `/api/threesidedcustomcut`
- Child relationship: `members`
- Video content:
  - `https://www.youtube.com/watch?v=oxesLyWqcew`

## Batch 5 Authoritative References (Specialty Parts + Custom Dice/Meeple)

### acrylicshape (`AcrylicShape125`)
- Product: `https://www.thegamecrafter.com/make/products/AcrylicShape125`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/AcrylicShape125`
- Help: `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
- Image size: `2400x1200`
- Image slots: `side1`, `side2`
- Notes:
  - both sides should be provided to avoid blank/repeated defaults.
  - keep critical art inset from outer contour due custom-cut perimeter.

### customcolord4 (`CustomColorD4`)
- Product: `https://www.thegamecrafter.com/make/products/CustomColorD4`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomColorD4`
- Help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
- Image size: `300x300`
- Image slots: `side1`, `side2`, `side3`, `side4`
- Identity guardrail: require `identity=CustomColorD4` (auto-infer when omitted).

### customcolord6 (`CustomColorD6`)
- Product: `https://www.thegamecrafter.com/make/products/CustomColorD6`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomColorD6`
- Help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
- Image size: `180x180`
- Image slots: `side1`, `side2`, `side3`, `side4`, `side5`, `side6`
- Identity guardrail: require `identity=CustomColorD6` (auto-infer when omitted).

### customcolord8 (`CustomColorD8`)
- Product: `https://www.thegamecrafter.com/make/products/CustomColorD8`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomColorD8`
- Help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
- Image size: `300x300`
- Image slots: `side1`, `side2`, `side3`, `side4`, `side5`, `side6`, `side7`, `side8`
- Identity guardrail: require `identity=CustomColorD8` (auto-infer when omitted).

### customprintedmeeple (`CustomPrintedMeeple`)
- Product: `https://www.thegamecrafter.com/make/products/CustomPrintedMeeple`
- Product API: `https://www.thegamecrafter.com/api/tgc/products/CustomPrintedMeeple`
- Help: `https://help.thegamecrafter.com/article/366-custom-printed-meeples`
- Image size: `300x300`
- Image slots: `face`, `back`
