# Session: TGC Catalog + Component Build Gap Assessment

Date: 2026-02-22

## Question
Can we interrogate all available TGC parts/components, and what components cannot yet be added via current MCP tools?

## Findings
- TGC API provides catalog schema endpoint:
  - `GET /api/tgc/products`
  - docs: `https://www.thegamecrafter.com/developer/TGC.html`
- Our MCP exposes `tgc_tgc_products_list` contract, but handler implementation is currently missing (returns `implemented: false`).

## Current Add Coverage (Implemented)
- Deck/card pipelines:
  - `tgc_deck_create`, `tgc_card_create`, `tgc_deck_bulk_create_cards`
- Set-based printed components (validated live):
  - `twosidedset` + `twosided`
  - `twosidedsluggedset` + `twosidedslugged`
  - `onesidedsluggedset` + `onesidedslugged`
- Stock parts links:
  - `tgc_gamepart_upsert` (using `part_id`)

## Major Gaps
- No implemented MCP read for full catalog yet (`tgc_tgc_products_list` not implemented).
- No dedicated tools for many component families listed by TGC docs (booklets/pages, coil books/pages, dial, one sided, gloss variants, tuckbox/hookbox/twosidedbox, custom printed/custom cut/custom dice families, scorepad, document, etc.).
- Current generic component tools are proven for the three set-based families above, but not proven/parameter-complete for other families with unique required fields.
