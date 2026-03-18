# TGC Parts and Dice Workflows

Use this reference for parts-family recommendation, preflight, and readback behavior.

## Primary use cases
- choose between acrylic shapes, printed dice, printed meeples, and play money when the user only knows the gameplay outcome
- validate required side counts and orientation rules before create
- patch existing part artwork in place
- explain material, finish, and proofing concerns before prototype order

## Recommendation order when part family is unspecified
1. Clarify what the part must do:
   - rigid transparent/translucent custom shape,
   - printable die,
   - wooden stand-up character token,
   - paper money/bills.
2. Present at most 2-3 viable options.
3. Prefer these families:
   - `acrylicshape`: custom plastic pieces with two printable sides and thickness choice
   - `customcolord4|d6|d8`: full-color printed dice when each die face needs unique art
   - `customprintedmeeple`: small wooden figure with front/back print
   - `twosidedset` play money: paper bills with long-edge flip behavior
4. If only one viable option remains after material or face-count constraints, explain why and ask for confirmation before create.

## Validation order
1. Resolve create vs in-place update.
2. Resolve part identity or narrow to 2-3 candidates.
3. Validate required printed sides and face counts for the chosen family.
4. Validate part-specific constraints:
   - acrylic thickness and contour clearance,
   - die face count and white-print expectations,
   - meeple front/back readability,
   - play-money long-edge flip orientation.
5. Route trim, bleed, and face readability remediation to `tgc-image-preflight-fit`.
6. Execute mutation only after missing or unsafe part inputs are resolved.

## Required-art hard gates
- `acrylicshape`: require both `side1` and `side2`.
- `customcolord4`: require `side1` through `side4`.
- `customcolord6`: require `side1` through `side6`.
- `customcolord8`: require `side1` through `side8`.
- `customprintedmeeple`: require `face` and `back`.
- `twosidedset` play money: require `face` and `back`; if the design should read in the same direction on both sides, require a 180-degree rotation plan for one side.

## Block conditions
- Missing required printed side for the chosen part family
- Printed die request with incomplete face art
- Acrylic art extends too close to the outer contour and the user has not approved the risk
- Play-money front/back orientation would be upside down after the long-edge flip and the user has not approved the correction
- Existing part revision request would accidentally create a duplicate component instead of updating the current one

## Special notes
- Acrylic shapes do not receive UV coating or linen texture and should keep important art inset from the cut contour.
- Printed dice require clean PNG art without compression artifacts; white printing needs a deliberate design plan.
- Printed dice and printed meeples are excluded from UV coating; do not promise dry-erase behavior.
- Play Money is also excluded from UV and linen, and it flips along the long edge during production.
- If the user asks to mimic real currency on Play Money, warn about TGC's intellectual-property/legal constraints before proceeding.
- Recommend 3D viewer review for printed dice when the user cares about face orientation and assembled appearance.

## Update and readback rules
- Default to `tgc_component_update` for existing part changes.
- After create/update, verify:
  - the same component id remains present for updates,
  - each expected side persisted the intended file id,
  - part-specific side counts still match the chosen identity.
- If readback does not match, treat the operation as failed and return remediation steps.

## Output contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list of part-specific blockers or cautions
- `next_actions`: ordered steps
- `recommended_options`: present only when the part family is still undecided
