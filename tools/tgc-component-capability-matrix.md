# TGC Component Capability Matrix

Generated: 2026-02-23T21:45:33.075Z

## Scope
This matrix is generated from live `GET /api/tgc/products` data.
Support means the required create APIs are covered by validated MCP write primitives.

## Summary
- Active catalog products discovered: 201
- Fully supported products: 194
- Products with gaps: 7
- Missing create APIs (unique): 5

## Validated Create APIs
- `/api/booklet`
- `/api/bookletpage`
- `/api/boxface`
- `/api/boxtop`
- `/api/boxtopgloss`
- `/api/card`
- `/api/coilbook`
- `/api/coilbookpage`
- `/api/customcutonesidedslugged`
- `/api/customcuttwosidedslugged`
- `/api/deck`
- `/api/dial`
- `/api/document`
- `/api/gamepart`
- `/api/hookbox`
- `/api/onesided`
- `/api/onesidedgloss`
- `/api/onesidedslugged`
- `/api/onesidedsluggedset`
- `/api/part`
- `/api/perfectboundbook`
- `/api/perfectboundbookpage`
- `/api/scorepad`
- `/api/threesidedcustomcut`
- `/api/threesidedcustomcutset`
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
- `/api/customprintedmeeple`

## Product Gaps
| Identity | Name | Category | Required APIs | Missing APIs |
|---|---|---|---|---|
| `AcrylicShape125` | 3mm Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |
| `AcrylicShape250` | 6mm Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |
| `CustomColorD4` | Custom Full Color D4 | Parts | `/api/customcolord4` | `/api/customcolord4` |
| `CustomColorD6` | Custom Full Color 16mm D6 | Parts | `/api/customcolord6` | `/api/customcolord6` |
| `CustomColorD8` | Custom Full Color D8 | Parts | `/api/customcolord8` | `/api/customcolord8` |
| `CustomPrintedMeeple` | Full Color Printed Meeple | Parts | `/api/customprintedmeeple` | `/api/customprintedmeeple` |
| `LargeAcrylicShape125` | 3mm Large Acrylic Shapes | Parts | `/api/acrylicshape` | `/api/acrylicshape` |

