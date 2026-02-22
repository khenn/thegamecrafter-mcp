# TGC Component Capability Matrix

Generated: 2026-02-22T23:04:21.742Z

## Scope
This matrix is generated from live `GET /api/tgc/products` data.
Support means the required create APIs are covered by validated MCP write primitives.

## Summary
- Active catalog products discovered: 201
- Fully supported products: 170
- Products with gaps: 31
- Missing create APIs (unique): 12

## Validated Create APIs
- `/api/booklet`
- `/api/bookletpage`
- `/api/boxface`
- `/api/boxtop`
- `/api/boxtopgloss`
- `/api/card`
- `/api/coilbook`
- `/api/coilbookpage`
- `/api/deck`
- `/api/document`
- `/api/gamepart`
- `/api/hookbox`
- `/api/onesidedslugged`
- `/api/onesidedsluggedset`
- `/api/part`
- `/api/perfectboundbook`
- `/api/perfectboundbookpage`
- `/api/scorepad`
- `/api/tuckbox`
- `/api/twosided`
- `/api/twosidedbox`
- `/api/twosidedboxgloss`
- `/api/twosidedset`
- `/api/twosidedslugged`
- `/api/twosidedsluggedset`

## Missing Create APIs
- `/api/acrylicshape`
- `/api/customcolord4`
- `/api/customcolord6`
- `/api/customcolord8`
- `/api/customcutonesidedslugged`
- `/api/customcuttwosidedslugged`
- `/api/customprintedmeeple`
- `/api/dial`
- `/api/onesided`
- `/api/onesidedgloss`
- `/api/threesidedcustomcut`
- `/api/threesidedcustomcutset`

## Product Gaps
| Identity | Name | Category | Required APIs | Missing APIs |
|---|---|---|---|---|
| `AcrylicShape125` | 3mm Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |
| `AcrylicShape250` | 6mm Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |
| `BiFoldBoard` | Bi-Fold Game Board | Boards | `/api/onesidedgloss` | `/api/onesidedgloss` |
| `CustomColorD4` | Custom Full Color D4 | Parts | `/api/customcolord4` | `/api/customcolord4` |
| `CustomColorD6` | Custom Full Color 16mm D6 | Parts | `/api/customcolord6` | `/api/customcolord6` |
| `CustomColorD8` | Custom Full Color D8 | Parts | `/api/customcolord8` | `/api/customcolord8` |
| `CustomLargeCardstock` | Custom Large Cardstock | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomLargePunchout` | Custom Large Punchout | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomLargeSticker` | Custom Large Sticker | Stickers | `/api/customcutonesidedslugged` | `/api/customcutonesidedslugged` |
| `CustomMediumCardstock` | Custom Medium Cardstock | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomMediumPunchout` | Custom Medium Punchout | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomMediumSticker` | Custom Medium Sticker | Stickers | `/api/customcutonesidedslugged` | `/api/customcutonesidedslugged` |
| `CustomMiniCardstock` | Custom Mini Cardstock | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomMiniSticker` | Custom Mini Sticker | Stickers | `/api/customcutonesidedslugged` | `/api/customcutonesidedslugged` |
| `CustomPrintedMeeple` | Full Color Printed Meeple | Parts | `/api/customprintedmeeple` | `/api/customprintedmeeple` |
| `CustomSmallCardstock` | Custom Small Cardstock | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomSmallPunchout` | Custom Small Punchout | Punchouts | `/api/customcuttwosidedslugged` | `/api/customcuttwosidedslugged` |
| `CustomSmallSticker` | Custom Small Sticker | Stickers | `/api/customcutonesidedslugged` | `/api/customcutonesidedslugged` |
| `DualDial` | Dual Dial | Dials | `/api/dial` | `/api/dial` |
| `LargeAcrylicShape125` | 3mm Large Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |
| `LargeDualLayerBoard` | Large Dual Layer Board Set | Boards | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` |
| `LargeQuadFoldBoard` | Large Quad-Fold Game Board | Boards | `/api/onesidedgloss` | `/api/onesidedgloss` |
| `MediumDualLayerBoard` | Medium Dual Layer Board Set | Boards | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` |
| `MediumGameMat` | Medium Neoprene Mat | Mats | `/api/onesided` | `/api/onesided` |
| `MediumSixFoldBoard` | Medium Six-Fold Game Board | Boards | `/api/onesidedgloss` | `/api/onesidedgloss` |
| `QuadFoldBoard` | Quad-Fold Game Board | Boards | `/api/onesidedgloss` | `/api/onesidedgloss` |
| `SixFoldBoard` | Six-Fold Game Board | Boards | `/api/onesidedgloss` | `/api/onesidedgloss` |
| `SmallDial` | Small Dial | Dials | `/api/dial` | `/api/dial` |
| `SmallDualLayerBoard` | Small Dual Layer Board Set | Boards | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` | `/api/threesidedcustomcutset`, `/api/threesidedcustomcut` |
| `SmallGameMat` | Small Neoprene Mat | Mats | `/api/onesided` | `/api/onesided` |
| `VHSBox` | VHS Box | Packaging | `/api/onesided` | `/api/onesided` |

