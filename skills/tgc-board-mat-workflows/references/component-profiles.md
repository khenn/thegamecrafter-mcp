# Board, Mat, and Screen Component Profiles

Use this reference for board/mat/screen optioning and preflight.

## Current source set
- Game Boards: `https://help.thegamecrafter.com/article/90-game-boards`
- Game Mats: `https://help.thegamecrafter.com/article/91-game-mats`
- Creating Game Mats: `https://help.thegamecrafter.com/article/54-creating-game-mats`
- 3D Viewer: `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- UV Coating: `https://help.thegamecrafter.com/article/169-uv-coating`
- Linen Texture: `https://help.thegamecrafter.com/article/178-linen-texture`
- Templates: `https://help.thegamecrafter.com/article/39-templates`

## Product API pattern
- Product API URL pattern for all identities below:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared guardrails
- Recommend 3D viewer review for folding boards and folding mats before prototype order.
- Linen texture does not pair well with dry-erase usage.
- Neoprene mats are a distinct material/cost/storage choice; do not silently substitute cardstock mats.
- Use `tgc-image-preflight-fit` for trim/safe-zone/fold-readability checks.
- Dual-layer boards remain owned by the custom-cut workflow family and are intentionally not covered in this file.

## Family surface models

### Folding gloss boards (`/api/onesidedgloss`)
- Primary help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- Required slot: `face`
- Default notes:
  - classic folding board presentation
  - recommend 3D viewer proof review

### Traditional boards, mats, and screens (`/api/twosidedset`)
- Primary help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/91-game-mats`
- Required surfaces:
  - many traditional identities use `face` + `back`
  - folding mat variants often use `inside` + `outside`
- Default notes:
  - validate the actual side labels for the chosen identity before mutation

### Neoprene mats (`/api/onesided`)
- Primary help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- Required slot: `face`
- Default notes:
  - single printed face
  - neoprene choice should be explicit

## Identity profiles

### Board identities
- (`AccordionBoard`) Product: `https://www.thegamecrafter.com/make/products/AccordionBoard`; size: `2475x4875`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`BiFoldBoard`) Product: `https://www.thegamecrafter.com/make/products/BiFoldBoard`; size: `2775x5475`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`DominoBoard`) Product: `https://www.thegamecrafter.com/make/products/DominoBoard`; size: `1275x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`HalfBoard`) Product: `https://www.thegamecrafter.com/make/products/HalfBoard`; size: `1575x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`LargeQuadFoldBoard`) Product: `https://www.thegamecrafter.com/make/products/LargeQuadFoldBoard`; size: `6075x6075`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`LargeSquareBoard`) Product: `https://www.thegamecrafter.com/make/products/LargeSquareBoard`; size: `3075x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`MediumSixFoldBoard`) Product: `https://www.thegamecrafter.com/make/products/MediumSixFoldBoard`; size: `4875x4875`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`QuadFoldBoard`) Product: `https://www.thegamecrafter.com/make/products/QuadFoldBoard`; size: `5475x5475`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`QuarterBoard`) Product: `https://www.thegamecrafter.com/make/products/QuarterBoard`; size: `1575x1575`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`SixFoldBoard`) Product: `https://www.thegamecrafter.com/make/products/SixFoldBoard`; size: `8175x5475`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`SkinnyBoard`) Product: `https://www.thegamecrafter.com/make/products/SkinnyBoard`; size: `1275x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`SliverBoard`) Product: `https://www.thegamecrafter.com/make/products/SliverBoard`; size: `675x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`SmallSquareBoard`) Product: `https://www.thegamecrafter.com/make/products/SmallSquareBoard`; size: `1275x1275`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`SquareBoard`) Product: `https://www.thegamecrafter.com/make/products/SquareBoard`; size: `2475x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`
- (`StripBoard`) Product: `https://www.thegamecrafter.com/make/products/StripBoard`; size: `675x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/90-game-boards`

### Mat identities
- (`BiFoldMat`) Product: `https://www.thegamecrafter.com/make/products/BiFoldMat`; size: `2475x2475`; surfaces: `inside`, `outside`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- (`BigMat`) Product: `https://www.thegamecrafter.com/make/products/BigMat`; size: `3075x4875`; surfaces: `inside`, `outside`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- (`DominoMat`) Product: `https://www.thegamecrafter.com/make/products/DominoMat`; size: `1275x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`FlowerMat`) Product: `https://www.thegamecrafter.com/make/products/FlowerMat`; size: `825x900`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`HalfMat`) Product: `https://www.thegamecrafter.com/make/products/HalfMat`; size: `1575x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`HexMat`) Product: `https://www.thegamecrafter.com/make/products/HexMat`; size: `1650x1425`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`InvaderMat`) Product: `https://www.thegamecrafter.com/make/products/InvaderMat`; size: `1275x1125`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`LargeHexMat`) Product: `https://www.thegamecrafter.com/make/products/LargeHexMat`; size: `2925x2550`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`LargeSquareMat`) Product: `https://www.thegamecrafter.com/make/products/LargeSquareMat`; size: `3075x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`MediumGameMat`) Product: `https://www.thegamecrafter.com/make/products/MediumGameMat`; size: `7275x4275`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- (`MintTinAccordion4`) Product: `https://www.thegamecrafter.com/make/products/MintTinAccordion4`; size: `2550x1125`; surfaces: `inside`, `outside`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`MintTinAccordion6`) Product: `https://www.thegamecrafter.com/make/products/MintTinAccordion6`; size: `3825x1125`; surfaces: `inside`, `outside`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`MintTinAccordion8`) Product: `https://www.thegamecrafter.com/make/products/MintTinAccordion8`; size: `5025x1125`; surfaces: `inside`, `outside`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`PlacardMat`) Product: `https://www.thegamecrafter.com/make/products/PlacardMat`; size: `1275x975`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`PostcardMat`) Product: `https://www.thegamecrafter.com/make/products/PostcardMat`; size: `1875x1275`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`QuadFoldMat`) Product: `https://www.thegamecrafter.com/make/products/QuadFoldMat`; size: `3375x5175`; surfaces: `outside`, `inside`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`QuarterMat`) Product: `https://www.thegamecrafter.com/make/products/QuarterMat`; size: `1575x1575`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SkinnyMat`) Product: `https://www.thegamecrafter.com/make/products/SkinnyMat`; size: `1275x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SliverMat`) Product: `https://www.thegamecrafter.com/make/products/SliverMat`; size: `675x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SlopesideBiFoldMat`) Product: `https://www.thegamecrafter.com/make/products/SlopesideBiFoldMat`; size: `2175x1125`; surfaces: `inside`, `outside`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SmallBiFoldMat`) Product: `https://www.thegamecrafter.com/make/products/SmallBiFoldMat`; size: `1725x2175`; surfaces: `inside`, `outside`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SmallGameMat`) Product: `https://www.thegamecrafter.com/make/products/SmallGameMat`; size: `3075x4875`; surfaces: `face`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/54-creating-game-mats`
- (`SmallQuadFoldMat`) Product: `https://www.thegamecrafter.com/make/products/SmallQuadFoldMat`; size: `2175x3375`; surfaces: `inside`, `outside`; help:
  - `https://help.thegamecrafter.com/article/91-game-mats`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`SmallSquareMat`) Product: `https://www.thegamecrafter.com/make/products/SmallSquareMat`; size: `1275x1275`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SpinnerMat`) Product: `https://www.thegamecrafter.com/make/products/SpinnerMat`; size: `2475x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`SquareMat`) Product: `https://www.thegamecrafter.com/make/products/SquareMat`; size: `2475x2475`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`StripMat`) Product: `https://www.thegamecrafter.com/make/products/StripMat`; size: `675x3075`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`
- (`USGameMat`) Product: `https://www.thegamecrafter.com/make/products/USGameMat`; size: `1050x1425`; surfaces: `face`, `back`; help: `https://help.thegamecrafter.com/article/91-game-mats`

### Screen identities
- (`LargeScreen`) Product: `https://www.thegamecrafter.com/make/products/LargeScreen`; size: `4875x3075`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`MediumScreen`) Product: `https://www.thegamecrafter.com/make/products/MediumScreen`; size: `4875x1425`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
- (`SmallScreen`) Product: `https://www.thegamecrafter.com/make/products/SmallScreen`; size: `3075x1200`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/90-game-boards`
  - `https://help.thegamecrafter.com/article/425-3d-box-viewer`
