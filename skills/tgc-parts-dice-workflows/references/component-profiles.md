# Parts and Dice Component Profiles

Use this reference for parts-family optioning and preflight.

## Current source set
- Custom Acrylic Shapes: `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
- Custom Printed Meeples: `https://help.thegamecrafter.com/article/366-custom-printed-meeples`
- Custom Dice: `https://help.thegamecrafter.com/article/370-custom-dice`
- Custom Color Printed Dice: `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
- How to Make and Order Custom Printed Dice: `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
- Play Money: `https://help.thegamecrafter.com/article/168-play-money`
- Intellectual Property: `https://help.thegamecrafter.com/article/9-intellectual-property`
- UV Coating: `https://help.thegamecrafter.com/article/169-uv-coating`
- Linen Texture: `https://help.thegamecrafter.com/article/178-linen-texture`
- 3D Viewer: `https://help.thegamecrafter.com/article/425-3d-box-viewer`

## Product API patterns
- Product page URL pattern:
  - `https://www.thegamecrafter.com/make/products/<Identity>`
- Product API URL pattern:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared guardrails
- Use `tgc-image-preflight-fit` whenever the art needs trim, edge-clearance, or small-face readability work.
- Require all printed sides for dice, acrylic shapes, and printed meeples; do not assume mirrored or blank fallback art unless the user explicitly asks for it.
- Acrylic shapes, printed dice, printed meeples, and play money are excluded from UV coating; Play Money is also excluded from linen texture.
- If the user requests real-currency imagery for Play Money, warn about TGC's intellectual-property/legal restrictions before mutating.

## Family slot models

### Acrylic shapes (`/api/acrylicshape`)
- Primary help:
  - `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
  - `https://help.thegamecrafter.com/article/169-uv-coating`
- Required sides: `side1`, `side2`
- Default notes:
  - use when the user wants rigid custom plastic shapes
  - keep critical art inset from the cut contour
  - choose thickness intentionally; 3mm and 6mm are different products

### Printed dice (`/api/customcolord4`, `/api/customcolord6`, `/api/customcolord8`)
- Primary help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
- Required faces:
  - D4: `side1`-`side4`
  - D6: `side1`-`side6`
  - D8: `side1`-`side8`
- Default notes:
  - use high-quality PNG art
  - white printing needs deliberate handling
  - recommend 3D viewer review when orientation matters

### Printed meeple (`/api/customprintedmeeple`)
- Primary help:
  - `https://help.thegamecrafter.com/article/366-custom-printed-meeples`
  - `https://help.thegamecrafter.com/article/169-uv-coating`
- Required sides: `face`, `back`
- Default notes:
  - small wood piece with front/back print
  - use when the user wants a character-like wooden silhouette instead of acrylic or punchout

### Play Money (`/api/twosidedset` + child `/api/twosided`)
- Primary help:
  - `https://help.thegamecrafter.com/article/168-play-money`
  - `https://help.thegamecrafter.com/article/9-intellectual-property`
- Required sides: `face`, `back`
- Default notes:
  - flips along the long edge during production
  - rotate one side 180 degrees when the user wants both sides to read in the same direction
  - legal/IP constraints apply when imitating real currency

## Identity profiles

### Acrylic identities
- (`AcrylicShape125`) Product: `https://www.thegamecrafter.com/make/products/AcrylicShape125`; size: `2400x1200`; sides: `side1`, `side2`; help:
  - `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
  - `https://help.thegamecrafter.com/article/169-uv-coating`
- (`AcrylicShape250`) Product: `https://www.thegamecrafter.com/make/products/AcrylicShape250`; size: `2400x1200`; sides: `side1`, `side2`; help:
  - `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
  - `https://help.thegamecrafter.com/article/169-uv-coating`
- (`LargeAcrylicShape125`) Product: `https://www.thegamecrafter.com/make/products/LargeAcrylicShape125`; size: `3150x2700`; sides: `side1`, `side2`; help:
  - `https://help.thegamecrafter.com/article/379-custom-acrylic-shapes`
  - `https://help.thegamecrafter.com/article/169-uv-coating`

### Printed dice identities
- (`CustomColorD4`) Product: `https://www.thegamecrafter.com/make/products/CustomColorD4`; face size: `300x300`; faces: `side1`, `side2`, `side3`, `side4`; help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
- (`CustomColorD6`) Product: `https://www.thegamecrafter.com/make/products/CustomColorD6`; face size: `180x180`; faces: `side1`, `side2`, `side3`, `side4`, `side5`, `side6`; help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`
- (`CustomColorD8`) Product: `https://www.thegamecrafter.com/make/products/CustomColorD8`; face size: `300x300`; faces: `side1`, `side2`, `side3`, `side4`, `side5`, `side6`, `side7`, `side8`; help:
  - `https://help.thegamecrafter.com/article/370-custom-dice`
  - `https://help.thegamecrafter.com/article/349-custom-color-printed-dice`
  - `https://help.thegamecrafter.com/article/441-how-to-make-and-order-custom-printed-dice`

### Meeple identity
- (`CustomPrintedMeeple`) Product: `https://www.thegamecrafter.com/make/products/CustomPrintedMeeple`; size: `300x300`; sides: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/366-custom-printed-meeples`
  - `https://help.thegamecrafter.com/article/169-uv-coating`

### Paper-parts identity
- (`PlayMoney`) Product: `https://www.thegamecrafter.com/make/products/PlayMoney`; size: `675x1125`; sides: `face`, `back`; child API: `/api/twosided`; help:
  - `https://help.thegamecrafter.com/article/168-play-money`
  - `https://help.thegamecrafter.com/article/9-intellectual-property`
