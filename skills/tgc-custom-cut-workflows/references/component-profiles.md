# Custom-Cut Component Profiles

Use this reference for custom-cut optioning and preflight.

## Current source set
- Custom Punchouts and Card Stock: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- Custom Punchouts: Hinges: `https://help.thegamecrafter.com/article/206-custom-punchouts-hinges`
- Custom Punchouts: Screws & Dials: `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`
- Custom Punchouts: Spinners: `https://help.thegamecrafter.com/article/207-custom-punchouts-spinners`
- Custom Punchouts: Standees: `https://help.thegamecrafter.com/article/205-custom-punchouts-standees`
- Dials: `https://help.thegamecrafter.com/article/87-dials`
- Dice Stickers: `https://help.thegamecrafter.com/article/88-dice-stickers`
- Custom Stickers: `https://help.thegamecrafter.com/article/365-custom-stickers`
- Stickers: `https://help.thegamecrafter.com/article/98-stickers`
- Dual Layer Boards: `https://help.thegamecrafter.com/article/658-dual-layer-boards`
- Templates: `https://help.thegamecrafter.com/article/39-templates`

## Product API patterns
- Product page URL pattern:
  - `https://www.thegamecrafter.com/make/products/<Identity>`
- Product API URL pattern:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared guardrails
- Treat custom-cut as geometry-first work. If the user has not confirmed template or cutline intent, stop and clarify before mutation.
- Use `tgc-image-preflight-fit` whenever trim, bleed, label readability, or pocket/window alignment is in doubt.
- Custom punchouts are chipboard and custom cardstock is thinner black-core stock; do not silently substitute one for the other.
- Dials, standees, hinges, and dual-layer boards require an assembly-aware proof pass after art placement.
- Dice stickers are registration-sensitive; any border or inset mismatch will be obvious on finished dice.
- Dual-layer boards remain owned by this workflow family even though their catalog category is `Boards`.

## Family slot models

### Custom punchout and cardstock slugs (`/api/customcuttwosidedslugged`)
- Primary help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required surfaces: `face`, `back`
- Default notes:
  - custom cutline/template work is expected
  - use punchout when the user wants thick chipboard pieces
  - use cardstock when the user wants thinner black-core pieces

### Custom sticker slugs (`/api/customcutonesidedslugged`)
- Primary help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required surface: `face`
- Default notes:
  - single printable face only
  - confirm the user wants sticker behavior, not a chipboard punchout

### Pre-shaped punchout sets (`/api/twosidedsluggedset` + child `/api/twosidedslugged`)
- Primary help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/205-custom-punchouts-standees`
  - `https://help.thegamecrafter.com/article/207-custom-punchouts-spinners`
- Required member surfaces: `face`, `back`
- Default notes:
  - set-level create is a container; printed geometry lives on child `members`
  - use when the user wants stock shapes like chits, tiles, standees, or shards instead of bespoke cutlines

### Specialty sticker sets (`/api/onesidedsluggedset` + child `/api/onesidedslugged`)
- Primary help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/88-dice-stickers`
- Required member surface: `face`
- Default notes:
  - set-level create is a container; printed geometry lives on child `members`
  - best for small specialty sticker targets where alignment risk is high

### Dials (`/api/dial`)
- Primary help:
  - `https://help.thegamecrafter.com/article/87-dials`
  - `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`
- Required surface: `outside`
- Default notes:
  - flat art must be reviewed in assembled orientation
  - keep critical text and icons clear of windows, axle holes, folds, and notches

### Dual-layer boards (`/api/threesidedcustomcutset` + child `/api/threesidedcustomcut`)
- Primary help:
  - `https://help.thegamecrafter.com/article/658-dual-layer-boards`
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- Required surfaces: `face`, `back`, `inner`
- Default notes:
  - set-level create is a container; pocket geometry lives on child `members`
  - confirm the pocket layout and art alignment across the three printed layers before mutation

## Identity profiles

### Custom slug identities
- (`CustomLargeCardstock`) Product: `https://www.thegamecrafter.com/make/products/CustomLargeCardstock`; size: `2475x3150`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomLargePunchout`) Product: `https://www.thegamecrafter.com/make/products/CustomLargePunchout`; size: `2475x3150`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomLargeSticker`) Product: `https://www.thegamecrafter.com/make/products/CustomLargeSticker`; size: `2475x3150`; surface: `face`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomMediumCardstock`) Product: `https://www.thegamecrafter.com/make/products/CustomMediumCardstock`; size: `2400x1350`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomMediumPunchout`) Product: `https://www.thegamecrafter.com/make/products/CustomMediumPunchout`; size: `2400x1350`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomMediumSticker`) Product: `https://www.thegamecrafter.com/make/products/CustomMediumSticker`; size: `2400x1350`; surface: `face`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomMiniCardstock`) Product: `https://www.thegamecrafter.com/make/products/CustomMiniCardstock`; size: `750x1050`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomMiniSticker`) Product: `https://www.thegamecrafter.com/make/products/CustomMiniSticker`; size: `750x1050`; surface: `face`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomSmallCardstock`) Product: `https://www.thegamecrafter.com/make/products/CustomSmallCardstock`; size: `975x1575`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomSmallPunchout`) Product: `https://www.thegamecrafter.com/make/products/CustomSmallPunchout`; size: `975x1575`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`CustomSmallSticker`) Product: `https://www.thegamecrafter.com/make/products/CustomSmallSticker`; size: `975x1575`; surface: `face`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/39-templates`

### Dial identities
- (`SmallDial`) Product: `https://www.thegamecrafter.com/make/products/SmallDial`; size: `825x2400`; surface: `outside`; help:
  - `https://help.thegamecrafter.com/article/87-dials`
  - `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`
- (`DualDial`) Product: `https://www.thegamecrafter.com/make/products/DualDial`; size: `2550x1650`; surface: `outside`; help:
  - `https://help.thegamecrafter.com/article/87-dials`
  - `https://help.thegamecrafter.com/article/204-custom-punchouts-rivets-dials`

### Dual-layer board identities
- (`LargeDualLayerBoard`) Product: `https://www.thegamecrafter.com/make/products/LargeDualLayerBoard`; size: `2475x3075`; surfaces: `face`, `back`, `inner`; child API: `/api/threesidedcustomcut`; help:
  - `https://help.thegamecrafter.com/article/658-dual-layer-boards`
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumDualLayerBoard`) Product: `https://www.thegamecrafter.com/make/products/MediumDualLayerBoard`; size: `2475x1275`; surfaces: `face`, `back`, `inner`; child API: `/api/threesidedcustomcut`; help:
  - `https://help.thegamecrafter.com/article/658-dual-layer-boards`
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallDualLayerBoard`) Product: `https://www.thegamecrafter.com/make/products/SmallDualLayerBoard`; size: `1125x1725`; surfaces: `face`, `back`, `inner`; child API: `/api/threesidedcustomcut`; help:
  - `https://help.thegamecrafter.com/article/658-dual-layer-boards`
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`

### Specialty sticker identities
- (`DiceSticker`) Product: `https://www.thegamecrafter.com/make/products/DiceSticker`; size: `188x188`; member surface: `face`; child API: `/api/onesidedslugged`; help:
  - `https://help.thegamecrafter.com/article/88-dice-stickers`
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
- (`MeepleSticker`) Product: `https://www.thegamecrafter.com/make/products/MeepleSticker`; size: `225x225`; member surface: `face`; child API: `/api/onesidedslugged`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/98-stickers`
- (`MintTinSticker`) Product: `https://www.thegamecrafter.com/make/products/MintTinSticker`; size: `750x1125`; member surface: `face`; child API: `/api/onesidedslugged`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/98-stickers`
- (`PawnSticker`) Product: `https://www.thegamecrafter.com/make/products/PawnSticker`; size: `300x525`; member surface: `face`; child API: `/api/onesidedslugged`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/98-stickers`
- (`TokenSticker`) Product: `https://www.thegamecrafter.com/make/products/TokenSticker`; size: `338x338`; member surface: `face`; child API: `/api/onesidedslugged`; help:
  - `https://help.thegamecrafter.com/article/365-custom-stickers`
  - `https://help.thegamecrafter.com/article/98-stickers`

### Punchout set identities
- (`ArrowChit`) Product: `https://www.thegamecrafter.com/make/products/ArrowChit`; size: `150x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`BullseyeChit`) Product: `https://www.thegamecrafter.com/make/products/BullseyeChit`; size: `375x900`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`CircleShard`) Product: `https://www.thegamecrafter.com/make/products/CircleShard`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`DominoChit`) Product: `https://www.thegamecrafter.com/make/products/DominoChit`; size: `375x675`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`DominoTile`) Product: `https://www.thegamecrafter.com/make/products/DominoTile`; size: `675x1275`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`HexShard`) Product: `https://www.thegamecrafter.com/make/products/HexShard`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeCircleChit`) Product: `https://www.thegamecrafter.com/make/products/LargeCircleChit`; size: `375x375`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeHexTile`) Product: `https://www.thegamecrafter.com/make/products/LargeHexTile`; size: `1200x1050`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeRing`) Product: `https://www.thegamecrafter.com/make/products/LargeRing`; size: `450x450`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeSquareChit`) Product: `https://www.thegamecrafter.com/make/products/LargeSquareChit`; size: `375x375`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeSquareTile`) Product: `https://www.thegamecrafter.com/make/products/LargeSquareTile`; size: `1125x1125`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`LargeStandee`) Product: `https://www.thegamecrafter.com/make/products/LargeStandee`; size: `375x975`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/205-custom-punchouts-standees`
- (`MediumCircleChit`) Product: `https://www.thegamecrafter.com/make/products/MediumCircleChit`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumHexTile`) Product: `https://www.thegamecrafter.com/make/products/MediumHexTile`; size: `825x750`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumRing`) Product: `https://www.thegamecrafter.com/make/products/MediumRing`; size: `375x375`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumSquareChit`) Product: `https://www.thegamecrafter.com/make/products/MediumSquareChit`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumSquareTile`) Product: `https://www.thegamecrafter.com/make/products/MediumSquareTile`; size: `825x825`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MediumStandee`) Product: `https://www.thegamecrafter.com/make/products/MediumStandee`; size: `300x750`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/205-custom-punchouts-standees`
- (`MediumTriangleChit`) Product: `https://www.thegamecrafter.com/make/products/MediumTriangleChit`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MiniCircleTile`) Product: `https://www.thegamecrafter.com/make/products/MiniCircleTile`; size: `450x450`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MiniHexTile`) Product: `https://www.thegamecrafter.com/make/products/MiniHexTile`; size: `450x450`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`MiniSquareTile`) Product: `https://www.thegamecrafter.com/make/products/MiniSquareTile`; size: `450x450`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallCircleChit`) Product: `https://www.thegamecrafter.com/make/products/SmallCircleChit`; size: `225x225`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallHexTile`) Product: `https://www.thegamecrafter.com/make/products/SmallHexTile`; size: `675x600`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallRing`) Product: `https://www.thegamecrafter.com/make/products/SmallRing`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallSquareChit`) Product: `https://www.thegamecrafter.com/make/products/SmallSquareChit`; size: `225x225`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallSquareTile`) Product: `https://www.thegamecrafter.com/make/products/SmallSquareTile`; size: `675x675`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`SmallStandee`) Product: `https://www.thegamecrafter.com/make/products/SmallStandee`; size: `225x525`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help:
  - `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
  - `https://help.thegamecrafter.com/article/205-custom-punchouts-standees`
- (`SquareShard`) Product: `https://www.thegamecrafter.com/make/products/SquareShard`; size: `300x300`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`StripChit`) Product: `https://www.thegamecrafter.com/make/products/StripChit`; size: `375x975`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`TombstoneShard`) Product: `https://www.thegamecrafter.com/make/products/TombstoneShard`; size: `300x450`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
- (`TriangleTile`) Product: `https://www.thegamecrafter.com/make/products/TriangleTile`; size: `675x600`; member surfaces: `face`, `back`; child API: `/api/twosidedslugged`; help: `https://help.thegamecrafter.com/article/201-custom-punchouts-and-card-stock`
