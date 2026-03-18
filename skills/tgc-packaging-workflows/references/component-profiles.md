# Packaging Component Profiles

Use this reference for packaging-specific optioning and preflight.

## Current source set
- Boxes and Other Packaging: `https://help.thegamecrafter.com/article/83-boxes`
- Booster Packs FAQ: `https://help.thegamecrafter.com/article/364-booster-packs-faq`
- 3D Viewer: `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- UV Coating: `https://help.thegamecrafter.com/article/169-uv-coating`
- Linen Texture: `https://help.thegamecrafter.com/article/178-linen-texture`
- Printing With White Ink: `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
- Templates: `https://help.thegamecrafter.com/article/39-templates`

## Product API pattern
- Product API URL pattern for all identities below:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared packaging guardrails
- Recommend 3D viewer review for any fold-heavy or multi-panel packaging before prototype order.
- Do not create print-ready packaging without the full required slot set for that family.
- Use `tgc-image-preflight-fit` when art needs bleed/trim/fold safety review.
- Treat UV and linen as game-level surfacing decisions; do not assume every packaging API family persists `surfacing_treatment` on component create/update payloads.
- For non-paper packaging such as mint tins, warn that pure white may not print as expected.

## Family slot models

### Tuckbox (`/api/tuckbox`)
- Primary help: `https://help.thegamecrafter.com/article/83-boxes`
- Required slot: `outsideFileId`
- Default notes:
  - best for deck-first packaging with one exterior art sheet
  - no interior art slot in this family

### Hookbox (`/api/hookbox`)
- Primary help: `https://help.thegamecrafter.com/article/83-boxes`
- Required slots: `outsideFileId`, `insideFileId`
- Default notes:
  - validate both exterior and interior art before create
  - use when inside print matters or the hookbox form factor is explicitly desired

### Two-Sided Box (`/api/twosidedbox`)
- Primary help: `https://help.thegamecrafter.com/article/83-boxes`
- Required printed slots:
  - usually `topFileId` and `bottomFileId`
  - tin variants expose top/back surfaces in product metadata; verify readback carefully
- Default notes:
  - sturdier full-box print
  - appropriate when users want both top and bottom art

### Box Top Only (`/api/boxtop`)
- Primary help: `https://help.thegamecrafter.com/article/83-boxes`
- Required slot: `topFileId`
- Default notes:
  - use when only the top/sides print is needed
  - safer fallback when bottom art is missing

### Gloss Packaging
- `boxtopgloss` primary help: `https://help.thegamecrafter.com/article/83-boxes`
- `twosidedboxgloss` primary help: `https://help.thegamecrafter.com/article/83-boxes`
- Required printed slots:
  - `boxtopgloss`: `topFileId`
  - `twosidedboxgloss`: `topFileId`, `bottomFileId`
- Optional overlay slots:
  - `spotGlossFileId`
  - `spotGlossBottomFileId`
- Default notes:
  - optional spot-gloss overlays must align exactly with base art
  - recommend proof review after any spot-gloss change

### Box Face / Single-Face Packaging (`/api/boxface`, `/api/onesided`)
- `boxface` primary help: `https://help.thegamecrafter.com/article/364-booster-packs-faq`
- `onesided` packaging outlier help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- Required slot:
  - `faceFileId` for `boxface`
  - `frontFileId` for `onesided` packaging (`VHSBox`)
- Default notes:
  - single printable face sheet only
  - confirm user understands there is no second printable outer surface in this family

## Identity profiles

### Tuckbox identities
- (`BridgeTuckBox54`) Product: `https://www.thegamecrafter.com/make/products/BridgeTuckBox54`; size: `2175x1800`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`BridgeTuckBox108`) Product: `https://www.thegamecrafter.com/make/products/BridgeTuckBox108`; size: `2925x2250`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`JumboTuckBox90`) Product: `https://www.thegamecrafter.com/make/products/JumboTuckBox90`; size: `3450x2700`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerBoosterBox`) Product: `https://www.thegamecrafter.com/make/products/PokerBoosterBox`; size: `3450x4875`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`; notes: booster-box packaging, not the same as a single booster pack
- (`PokerTuckBox36`) Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox36`; size: `2100x1800`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerTuckBox54`) Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox54`; size: `2325x1950`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerTuckBox72`) Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox72`; size: `2550x1950`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerTuckBox90`) Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox90`; size: `2775x2100`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerTuckBox108`) Product: `https://www.thegamecrafter.com/make/products/PokerTuckBox108`; size: `3075x2250`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SmallProTarotInsert`) Product: `https://www.thegamecrafter.com/make/products/SmallProTarotInsert`; size: `2400x4575`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`; notes: insert form factor, confirm it is not intended as the primary outer box
- (`SmallStoutTarotInsert`) Product: `https://www.thegamecrafter.com/make/products/SmallStoutTarotInsert`; size: `3525x4725`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`; notes: insert form factor, confirm it is not intended as the primary outer box
- (`SquareTuckBox48`) Product: `https://www.thegamecrafter.com/make/products/SquareTuckBox48`; size: `2850x1800`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SquareTuckBox96`) Product: `https://www.thegamecrafter.com/make/products/SquareTuckBox96`; size: `3525x2250`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`TarotTuckBox40`) Product: `https://www.thegamecrafter.com/make/products/TarotTuckBox40`; size: `2325x2025`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`TarotTuckBox90`) Product: `https://www.thegamecrafter.com/make/products/TarotTuckBox90`; size: `3000x2475`; slots: `outside`; help: `https://help.thegamecrafter.com/article/83-boxes`

### Hookbox identities
- (`BridgeHookBox54`) Product: `https://www.thegamecrafter.com/make/products/BridgeHookBox54`; size: `2625x3300`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`BridgeHookBox108`) Product: `https://www.thegamecrafter.com/make/products/BridgeHookBox108`; size: `3000x3750`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`JumboHookBox36`) Product: `https://www.thegamecrafter.com/make/products/JumboHookBox36`; size: `3075x4725`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`JumboHookBox90`) Product: `https://www.thegamecrafter.com/make/products/JumboHookBox90`; size: `3450x5100`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox18`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox18`; size: `2475x3000`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox36`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox36`; size: `2700x3150`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox54`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox54`; size: `2850x3375`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox72`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox72`; size: `3000x3450`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox90`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox90`; size: `3075x3600`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`PokerHookBox108`) Product: `https://www.thegamecrafter.com/make/products/PokerHookBox108`; size: `3225x3750`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SquareHookBox48`) Product: `https://www.thegamecrafter.com/make/products/SquareHookBox48`; size: `3450x3450`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SquareHookBox96`) Product: `https://www.thegamecrafter.com/make/products/SquareHookBox96`; size: `3525x3900`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`TarotHookBox40`) Product: `https://www.thegamecrafter.com/make/products/TarotHookBox40`; size: `2925x4125`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`TarotHookBox90`) Product: `https://www.thegamecrafter.com/make/products/TarotHookBox90`; size: `3300x4500`; slots: `outside`, `inside`; help: `https://help.thegamecrafter.com/article/83-boxes`

### Two-sided box identities
- (`DeckBox`) Product: `https://www.thegamecrafter.com/make/products/DeckBox`; size: `3675x4950`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`LargeRetailBox`) Product: `https://www.thegamecrafter.com/make/products/LargeRetailBox`; size: `3975x4725`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`MediumProBox`) Product: `https://www.thegamecrafter.com/make/products/MediumProBox`; size: `3300x4350`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`MediumStoutBox`) Product: `https://www.thegamecrafter.com/make/products/MediumStoutBox`; size: `3675x4575`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`MintTin`) Product: `https://www.thegamecrafter.com/make/products/MintTin`; size: `750x1125`; slots: `top`, `back`; help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/427-printing-with-white-ink`
- (`SmallProBox`) Product: `https://www.thegamecrafter.com/make/products/SmallProBox`; size: `3450x2700`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SmallStoutBox`) Product: `https://www.thegamecrafter.com/make/products/SmallStoutBox`; size: `3600x3000`; slots: `top`, `bottom`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`TallMintTin`) Product: `https://www.thegamecrafter.com/make/products/TallMintTin`; size: `750x1125`; slots: `top`, `back`; help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/427-printing-with-white-ink`

### Box-top identities
- (`DeckBoxTopAndSide`) Product: `https://www.thegamecrafter.com/make/products/DeckBoxTopAndSide`; size: `3675x4950`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`LargePrototypeBox`) Product: `https://www.thegamecrafter.com/make/products/LargePrototypeBox`; size: `7650x5925`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`LargeStoutBoxTop`) Product: `https://www.thegamecrafter.com/make/products/LargeStoutBoxTop`; size: `3450x3450`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`MediumPrototypeBox`) Product: `https://www.thegamecrafter.com/make/products/MediumPrototypeBox`; size: `5850x5400`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`MediumStoutBoxTopAndSide`) Product: `https://www.thegamecrafter.com/make/products/MediumStoutBoxTopAndSide`; size: `3675x4575`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`
- (`SmallPrototypeBox`) Product: `https://www.thegamecrafter.com/make/products/SmallPrototypeBox`; size: `4350x4500`; slots: `top`; help: `https://help.thegamecrafter.com/article/83-boxes`

### Gloss packaging identities
- (`LargeStoutBoxTopAndSide`) Product: `https://www.thegamecrafter.com/make/products/LargeStoutBoxTopAndSide`; size: `5925x5925`; slots: `top`; optional overlay: `spotGloss`; help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`LargeStoutBox`) Product: `https://www.thegamecrafter.com/make/products/LargeStoutBox`; size: `5925x5925`; slots: `top`, `bottom`; optional overlays: `spotGloss`, `spotGlossBottom`; help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`

### Single-face packaging identities
- (`PokerBooster`) Product: `https://www.thegamecrafter.com/make/products/PokerBooster`; size: `975x1350`; slots: `face`; help: `https://help.thegamecrafter.com/article/364-booster-packs-faq`
- (`PokerEnvelope`) Product: `https://www.thegamecrafter.com/make/products/PokerEnvelope`; size: `975x1425`; slots: `face`; help: `https://help.thegamecrafter.com/article/364-booster-packs-faq`; notes: envelope-style packaging, single printed face only
- (`VHSBox`) Product: `https://www.thegamecrafter.com/make/products/VHSBox`; size: `3225x2400`; slots: `face`; help:
  - `https://help.thegamecrafter.com/article/83-boxes`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
