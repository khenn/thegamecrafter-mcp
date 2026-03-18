# TGC Skill Routing Map

Use this map to choose the primary skill with minimal context loading.

## Route to `tgc-guided-workflows` (router)
Use when request is broad or cross-workflow:
- create/manage game lifecycle
- combine multiple workflow families in one request
- surfacing/readiness/test reports
- high-level orchestration and sequencing

## Route to `tgc-packaging-workflows`
Use when request centers on packaging:
- choose a box, tin, envelope, insert, or booster-pack style package
- validate required packaging art slots
- compare tuckbox, hookbox, stout/prototype, or face-only packaging options
- review packaging-specific proof or 3D-viewer concerns

## Route to `tgc-card-deck-workflows`
Use when request centers on decks or cards:
- choose a poker, tarot, foil, clear, or specialty deck identity
- decide shared-back vs unique-back strategy
- create decks/cards or bulk card import flows
- warn about randomizer, foil, or clear-stock caveats

## Route to `tgc-board-mat-workflows`
Use when request centers on boards, mats, or screens:
- choose between board, mat, neoprene mat, folding board, or screen formats
- validate required board-like surfaces
- review fold, drift, 3D-viewer, or dry-erase/surfacing caveats
- update existing board/mat/screen art in place

## Route to `tgc-custom-cut-workflows`
Use when request centers on custom-cut geometry or assembly:
- choose between custom punchout, cardstock, sticker, dial, or dual-layer board formats
- validate required custom-cut surfaces and template assumptions
- review standee, hinge, spinner, dial-window, or pocket-alignment concerns
- update existing custom-cut component art in place

## Route to `tgc-parts-dice-workflows`
Use when request centers on acrylic or specialty parts:
- choose between acrylic shapes, printed dice, printed meeples, or play money
- validate required printed sides or die faces
- review acrylic thickness, play-money flip orientation, or die/meeple finish caveats
- update existing part art in place

## Route to `tgc-component-preflight`
Use when request is primarily about generic component validity before mutation and no more specific family skill applies:
- required assets/slots
- finish options
- quantity bounds
- side/page/identity completeness
- create vs in-place update safety

## Route to `tgc-book-rulebook-workflows`
Use when request centers on books/rulebooks or related printed docs:
- booklet/coil/perfectbound optioning
- folio/document/score-pad choice
- page parity or fold/orientation constraints
- cover/interior sequencing
- PDF/page import planning

## Route to `tgc-image-preflight-fit`
Use when request centers on art placement quality:
- safe-zone/bleed/trim checks
- proof clipping remediation
- fit intent selection
- geometry conflicts (including dial-specific readability)

## Tie-break Rules
1. If user asks for one specific domain (packaging, cards/decks, boards/mats, custom-cut, parts, book, generic component, image), pick focused skill.
2. If user asks for a full end-to-end workflow spanning domains, start with router and delegate.
3. If uncertain, ask one clarifying question before mutation.
