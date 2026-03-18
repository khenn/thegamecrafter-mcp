# TGC Book/Rulebook Workflow

Use this reference for book-like recommendation, preflight, and sequencing behavior.

## Primary use cases
- choose between booklet, coil, perfect-bound, folio, document, or score pad when the user only knows the gameplay outcome
- validate page-count, page-order, cover, or fold/orientation constraints before create
- patch existing book-like art in place
- explain binding, gutter, spine, and fold-proof risks before prototype order

## Recommendation order when component type is unspecified
1. Clarify the reading/usage pattern:
   - short fold-out rules sheet,
   - stitched booklet,
   - lay-flat coil book,
   - longer glued-spine book,
   - tear-off scoring sheet,
   - fold-out folio that must fit specific packaging.
2. Present at most 2-3 viable options.
3. Prefer these families:
   - `document`: short folded rules sheet on standard letter paper
   - `booklet`: short saddle-stitched rulebook up to 40 pages
   - `coilbook`: lay-flat books; use `MediumMatBook` when inner pages need UV/linen or dry-erase friendliness
   - `perfectboundbook`: longer rulebooks/storybooks that justify a spine
   - `twosidedset` folios: fold-out unbound rules inserts sized to packaging
   - `scorepad`: repeated score sheets / character sheets / deduction pads
4. If only one viable option remains after page-count or fold constraints, explain why and ask for confirmation before create.

## Validation order
1. Resolve create vs in-place update.
2. Resolve book-like identity or narrow to 2-3 candidates.
3. Validate source model:
   - PDF versus page-image import,
   - required page count,
   - front/back orientation,
   - cover and spine expectations.
4. Validate format-specific constraints:
   - booklet parity,
   - coil/perfect-bound page limits,
   - folio back-image rotation for horizontal layouts,
   - score-pad horizontal reverse orientation,
   - document two-page PDF behavior.
5. Route trim, bleed, gutter, or fold-line readability remediation to `tgc-image-preflight-fit`.
6. Execute mutation only after missing or unsafe book-like inputs are resolved.

## Hard gates
- `booklet`: total page count must be a multiple of 4 and no more than 40 pages.
- `coilbook`: paper-page variants must stay within the supported page range; `MediumMatBook` must stay within its lower page cap.
- `perfectboundbook`: require a page plan that supports a spine-aware layout and avoid thin-book spine titles; use page-count increments compatible with TGC sheet handling.
- `document`: require a two-page PDF for a double-sided document; separate page files create separate papers.
- `twosidedset` folios: require `face` and `back`; if the design is horizontal, warn that the back image must be rotated 180 degrees before upload.
- `scorepad`: require `face` and `back`; if used horizontally and the user wants the same printed orientation on both sides, warn that one side must be rotated 180 degrees before upload.

## Block conditions
- Missing required page/cover/surface inputs for the chosen family
- Source page count violates booklet or bound-book constraints and the user has not approved padding or a format change
- Requested perfect-bound layout has spine text but no spine-safe plan
- Folio or score-pad orientation would print upside down on one side and the user has not approved the rotation fix
- Existing book-like revision request would accidentally create a second component instead of updating the current one

## Special notes by family
- Documents are not full bleed and keep a 0.25-inch outer margin; they fold to fit the box and often z-fold.
- Booklets use page images, not one merged PDF, and page 1 is the front cover.
- Booklets with more than 20 pages use a different template than booklets up to 20 pages.
- Coil books lay flat; paper-page coil books can only have UV/linen on covers, while `MediumMatBook` can support UV/linen on inner pages because they are cardstock.
- Perfect-bound books should avoid important spine text on thin books because drift can be noticeable.
- Folios are cheaper fold-out rule sheets that fit popular packaging sizes, but they do not get UV coating, linen texture, or dry-erase compatibility.
- Score pads are good for repeated sheet use, but they also do not receive UV coating or linen texture.

## Update and readback rules
- Default to `tgc_component_update` for existing documents, folios, and score pads.
- For bound books with page children, confirm whether the user intends to update covers, replace pages, or add/remove page entries.
- After create/update, verify:
  - the same component id remains present for updates,
  - each expected cover/surface persisted the intended file id,
  - page-based books still expose the expected `pages` relationship,
  - folios still expose the expected `members` relationship.
- If readback does not match, treat the operation as failed and return remediation steps.

## Output contract
- `selected_component`
- `page_plan` (source range, parity or orientation action, total pages)
- `mutation_sequence`
- `proof_risks`
