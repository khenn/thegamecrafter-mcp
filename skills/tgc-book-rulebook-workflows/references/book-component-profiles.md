# Book and Rulebook Component Profiles

Use this reference for optioning and preflight of rulebook-like components.

## Current source set
- Books: `https://help.thegamecrafter.com/article/602-books`
- Booklets: `https://help.thegamecrafter.com/article/80-booklets`
- Folios: `https://help.thegamecrafter.com/article/496-folios`
- Documents: `https://help.thegamecrafter.com/article/89-documents`
- Adding Documents: `https://help.thegamecrafter.com/article/44-adding-documents`
- Score Pads: `https://help.thegamecrafter.com/article/95-score-pads`
- Setting Up A Spine (Perfect Bound Books): `https://help.thegamecrafter.com/article/468-setting-up-a-spine`
- Templates: `https://help.thegamecrafter.com/article/39-templates`
- UV Coating: `https://help.thegamecrafter.com/article/169-uv-coating`
- Linen Texture: `https://help.thegamecrafter.com/article/178-linen-texture`

## Product API patterns
- Product page URL pattern:
  - `https://www.thegamecrafter.com/make/products/<Identity>`
- Product API URL pattern:
  - `https://www.thegamecrafter.com/api/tgc/products/<Identity>`

## Shared guardrails
- Use `tgc-image-preflight-fit` when the user needs gutter, fold-line, safe-frame, or spine-title remediation.
- Booklets require total page counts divisible by 4 and cap at 40 pages.
- Perfect-bound books need a spine-safe plan; thin books should avoid important spine titles because drift is visible.
- Folios, documents, and score pads have front/back orientation rules that can print upside down if ignored.
- Documents, folios, booklet pages, and score pads do not receive UV coating or linen texture; covers-only exceptions apply to some bound books.

## Family slot models

### Document (`/api/document`)
- Primary help:
  - `https://help.thegamecrafter.com/article/89-documents`
  - `https://help.thegamecrafter.com/article/44-adding-documents`
- Required printable surfaces: `face`, `back`
- Default notes:
  - standard US letter size rules sheet
  - not full bleed; maintain the document margin
  - double-sided documents should be supplied as one two-page PDF

### Booklet (`/api/booklet` + child `/api/bookletpage`)
- Primary help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required page model:
  - child relationship `pages`
  - each page is uploaded as an image
- Default notes:
  - page 1 is the front cover
  - total pages must be a multiple of 4
  - separate template sizing applies above 20 pages

### Coil book (`/api/coilbook` + child `/api/coilbookpage`)
- Primary help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required printable surfaces:
  - book covers `face`, `back`
  - child relationship `pages`
- Default notes:
  - lay-flat design
  - paper-page coil books allow UV/linen on covers only
  - `MediumMatBook` uses cardstock pages and can support UV/linen on inner pages

### Perfect bound book (`/api/perfectboundbook` + child `/api/perfectboundbookpage`)
- Primary help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/468-setting-up-a-spine`
- Required printable surfaces:
  - covers `face`, `back`
  - child relationship `pages`
- Default notes:
  - use for longer manuals with a glued spine
  - covers may receive UV/linen, but inner pages do not
  - spine text/images need conservative drift tolerance

### Folio (`/api/twosidedset` + child `/api/twosided`)
- Primary help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required printable surfaces:
  - set/member `face`, `back`
  - child relationship `members`
- Default notes:
  - fold-out unbound rules insert
  - horizontal designs need the back image rotated 180 degrees before upload
  - folios are not compatible with UV, linen, or dry erase

### Score pad (`/api/scorepad`)
- Primary help:
  - `https://help.thegamecrafter.com/article/95-score-pads`
  - `https://help.thegamecrafter.com/article/39-templates`
- Required printable surfaces: `face`, `back`
- Default notes:
  - good for repeated scoring or character sheets
  - available in multiple page-count variants
  - horizontal two-sided layouts may need one side rotated 180 degrees

## Identity profiles

### Documents
- (`Document`) Product: `https://www.thegamecrafter.com/make/products/Document`; size: `2550x3300`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/89-documents`
  - `https://help.thegamecrafter.com/article/44-adding-documents`

### Booklet identities
- (`JumboBooklet`) Product: `https://www.thegamecrafter.com/make/products/JumboBooklet`; size: `2475x3075`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`LargeBooklet`) Product: `https://www.thegamecrafter.com/make/products/LargeBooklet`; size: `1575x2475`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MediumBooklet`) Product: `https://www.thegamecrafter.com/make/products/MediumBooklet`; size: `1125x1575`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SmallBooklet`) Product: `https://www.thegamecrafter.com/make/products/SmallBooklet`; size: `825x1125`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`TallBooklet`) Product: `https://www.thegamecrafter.com/make/products/TallBooklet`; size: `1425x2475`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`TarotBooklet`) Product: `https://www.thegamecrafter.com/make/products/TarotBooklet`; size: `900x1500`; page model: child `pages`; help:
  - `https://help.thegamecrafter.com/article/80-booklets`
  - `https://help.thegamecrafter.com/article/39-templates`

### Coil-bound identities
- (`JumboCoilBook`) Product: `https://www.thegamecrafter.com/make/products/JumboCoilBook`; size: `2550x3075`; covers: `face`, `back`; child `pages`; help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MediumCoilBook`) Product: `https://www.thegamecrafter.com/make/products/MediumCoilBook`; size: `1575x2325`; covers: `face`, `back`; child `pages`; help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MediumMatBook`) Product: `https://www.thegamecrafter.com/make/products/MediumMatBook`; size: `1575x2325`; covers: `face`, `back`; child `pages`; help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/39-templates`

### Perfect-bound identities
- (`DigestPerfectBoundBook`) Product: `https://www.thegamecrafter.com/make/products/DigestPerfectBoundBook`; size: `1725x2625`; covers: `face`, `back`; child `pages`; help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/468-setting-up-a-spine`
- (`LetterPerfectBoundBook`) Product: `https://www.thegamecrafter.com/make/products/LetterPerfectBoundBook`; size: `2625x3375`; covers: `face`, `back`; child `pages`; help:
  - `https://help.thegamecrafter.com/article/602-books`
  - `https://help.thegamecrafter.com/article/468-setting-up-a-spine`

### Folio identities
- (`BridgeFolio`) Product: `https://www.thegamecrafter.com/make/products/BridgeFolio`; size: `2775x1125`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MediumFolio`) Product: `https://www.thegamecrafter.com/make/products/MediumFolio`; size: `4875x2475`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MintTinFolio`) Product: `https://www.thegamecrafter.com/make/products/MintTinFolio`; size: `2625x1050`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`PokerFolio`) Product: `https://www.thegamecrafter.com/make/products/PokerFolio`; size: `3075x1125`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SmallFolio`) Product: `https://www.thegamecrafter.com/make/products/SmallFolio`; size: `4275x1725`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SquareFolio`) Product: `https://www.thegamecrafter.com/make/products/SquareFolio`; size: `4275x1125`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`TarotFolio`) Product: `https://www.thegamecrafter.com/make/products/TarotFolio`; size: `3375x1500`; surfaces: `face`, `back`; child `members`; help:
  - `https://help.thegamecrafter.com/article/496-folios`
  - `https://help.thegamecrafter.com/article/39-templates`

### Score pad identities
- (`LargeScorePadColor`) Product: `https://www.thegamecrafter.com/make/products/LargeScorePadColor`; size: `2475x3075`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/95-score-pads`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`MediumScorePadColor`) Product: `https://www.thegamecrafter.com/make/products/MediumScorePadColor`; size: `1425x2475`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/95-score-pads`
  - `https://help.thegamecrafter.com/article/39-templates`
- (`SmallScorePadColor`) Product: `https://www.thegamecrafter.com/make/products/SmallScorePadColor`; size: `1125x1725`; surfaces: `face`, `back`; help:
  - `https://help.thegamecrafter.com/article/95-score-pads`
  - `https://help.thegamecrafter.com/article/39-templates`
