# TGC Board, Mat, and Screen Workflows

Use this reference for board/mat/screen recommendation, preflight, and proof behavior.

## Primary use cases
- choose between board, mat, neoprene mat, folding board, folding mat, and screen formats
- validate required printable surfaces before create/update
- surface fold, drift, 3D-viewer, dry-erase, and linen/UV caveats before mutation
- patch existing board-like art in place after proof feedback

## Recommendation order when identity is unspecified
1. Clarify what the component must do:
   - rigid play surface vs flexible low-cost surface
   - foldable storage vs flat component
   - dry-erase expectation
   - whether the component is a player screen instead of a play surface
2. Present at most 2-3 viable options.
3. Prefer these families:
   - `onesidedgloss` folding boards when the user wants classic folding board presentation
   - `twosidedset` boards or mats when both sides matter or when the form factor is simpler than a gloss-fold board
   - `onesided` neoprene mats when the user explicitly wants neoprene feel and accepts single-face workflow
   - screen identities when the request is for hidden information / GM screen behavior rather than a table surface
4. If only one viable option remains, explain why and ask for confirmation before create.

## Validation order
1. Resolve create vs in-place update.
2. Resolve board/mat/screen identity or narrow to 2-3 options.
3. Validate required surface set:
   - `onesidedgloss` boards: `face`
   - `onesided` neoprene mats: `face`
   - `twosidedset` boards/screens/traditional mats: usually `face` + `back`
   - folding `twosidedset` mats: often `inside` + `outside`
4. Validate surfacing and use-case caveats:
   - linen does not pair well with dry-erase usage
   - folding board proofing should use 3D viewer when available
   - neoprene mats are a different cost/feel/storage choice than cardstock mats
5. Route fit, drift, and readability concerns to `tgc-image-preflight-fit`.
6. Execute mutation only after required surfaces and risks are resolved.

## Block conditions
- Missing required board/mat/screen printable surfaces
- User asks for dry-erase behavior but also wants linen texture without acknowledging the conflict
- Folding board or folding mat art is likely unreadable at folds and the user has not approved the risk
- Existing revision request would accidentally create a duplicate board-like component instead of updating the current one

## Special family notes
- Recommend 3D viewer review for folding boards, folding mats, and other multi-panel components before prototype order.
- For screens, default to privacy/readability framing rather than table-surface framing.
- For neoprene mats, make sure the user actually wants neoprene; do not silently substitute a cardstock mat or vice versa.
- Dual-layer boards remain owned by the custom-cut workflow family because their creation path and cut-line behavior differ materially.

## Update and readback rules
- Default to `tgc_component_update` for existing non-deck board/mat/screen changes.
- After create/update, verify:
  - the same component id remains present for updates,
  - each expected printable surface persisted the intended file id,
  - required fold/surface slots are still present after update.
- If readback does not match, treat the operation as failed and provide remediation steps.

## Output contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list of board/mat/screen-specific blockers or cautions
- `next_actions`: ordered steps
- `recommended_options`: present only when the board-like identity is still undecided
