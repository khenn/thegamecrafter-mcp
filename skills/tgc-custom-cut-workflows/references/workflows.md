# TGC Custom-Cut Workflows

Use this reference for custom-cut recommendation, preflight, and readback behavior.

## Primary use cases
- choose between custom punchout, cardstock, sticker, dial, or dual-layer board when the user only knows the gameplay outcome
- validate required custom-cut surfaces and template assumptions before create
- patch existing custom-cut art in place
- explain assembly-sensitive proofing concerns before prototype order

## Recommendation order when custom-cut family is unspecified
1. Clarify what the finished part must do:
   - sticker vs rigid piece,
   - single-face vs double-face,
   - custom cutline vs stock shape,
   - layered pocket board vs flat component,
   - standee, hinge, or dial behavior.
2. Present at most 2-3 viable options.
3. Prefer these families:
   - `customcutonesidedslugged`: bespoke single-face sticker
   - `customcuttwosidedslugged`: bespoke double-face punchout or cardstock slug
   - `twosidedsluggedset`: stock-shape punchout sets such as tiles, chits, shards, and standees
   - `onesidedsluggedset`: stock-shape specialty sticker sets
   - `dial`: score/health/decoder dial
   - `threesidedcustomcutset`: layered board with recessed pockets
4. If only one viable option remains after fit and assembly constraints, explain why and ask for confirmation before create.

## Validation order
1. Resolve create vs in-place update.
2. Resolve custom-cut identity or narrow to 2-3 family candidates.
3. Validate required printable surface set for the chosen family.
4. Validate geometry and assembly assumptions:
   - custom cutline/template intent,
   - standee slot fit,
   - hinge or spinner viability,
   - dial window readability,
   - dual-layer pocket alignment.
5. Route trim, bleed, and geometry remediation to `tgc-image-preflight-fit`.
6. Execute mutation only after missing or unsafe custom-cut inputs are resolved.

## Required-art hard gates
- `customcuttwosidedslugged`: require `face` and `back` art plus explicit confirmation that a custom cutline/template workflow is ready.
- `customcutonesidedslugged`: require `face` art plus explicit confirmation that a custom cutline/template workflow is ready.
- `twosidedsluggedset`: require member `face` and `back` art for each printed child component.
- `onesidedsluggedset`: require member `face` art for each printed child component.
- `dial`: require `outside` art and an assembled-orientation readability check.
- `threesidedcustomcutset`: require `face`, `back`, and `inner` art plus explicit confirmation that the pocket layer alignment is intended.

## Block conditions
- Missing required printable surface for the chosen custom-cut family
- No confirmed template or cutline plan for bespoke custom-cut slug workflows
- Requested art places critical content inside dial windows, axle holes, slot openings, hinge zones, or dual-layer pockets
- User asks for a custom sticker when they actually need a rigid chipboard or cardstock piece
- Existing custom-cut revision request would accidentally create a duplicate component instead of updating the current one

## Special custom-cut notes
- For bespoke custom punchouts, confirm whether the user wants chipboard punchout thickness or thinner black-core cardstock before mutating.
- For hinges, prefer ties thick enough to bend without breaking; if the user is drawing custom hinge geometry, point them to the hinge guidance before create.
- For standees, warn that the slot geometry is precision-sensitive and should not be improvised after artwork is finished.
- For spinner concepts, note that TGC's custom spinner article assumes a snap-fit spinner mechanism and a tile sized to clear the spinner arm.
- For dice stickers, recommend full-bleed backgrounds and avoid hairline borders because even slight cut drift will be visible.
- For dials, keep labels adjacent to windows instead of centered across rotating wheels unless the user explicitly wants wheel text.
- For dual-layer boards, confirm whether the `back` layer should show through the pockets and whether the `inner` layer artwork is decorative, structural, or both.

## Update and readback rules
- Default to `tgc_component_update` for existing non-deck custom-cut changes.
- For set families, prefer updating the container only when set-level art changes; otherwise confirm whether the user intends to update child `members`.
- After create/update, verify:
  - the same component id remains present for updates,
  - each expected surface persisted the intended file id,
  - set families still expose the expected child relationship,
  - dual-layer boards still report all three printed surfaces.
- If readback does not match, treat the operation as failed and return remediation steps.

## Output contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list of custom-cut-specific blockers or cautions
- `next_actions`: ordered steps
- `recommended_options`: present only when the custom-cut family is still undecided
