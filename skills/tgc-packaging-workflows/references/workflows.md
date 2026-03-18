# TGC Packaging Workflows

Use this reference for packaging-specific recommendation, preflight, and readback behavior.

## Primary use cases
- choose packaging when the user only knows deck/component payload or target presentation
- validate required art slots before box/tin/envelope creation
- patch existing packaging art in place
- explain packaging-specific proofing concerns before prototype order

## Recommendation order when packaging type is unspecified
1. Clarify what must fit:
   - deck/card count and size,
   - whether loose components or books must also fit,
   - whether the user needs retail-style tuck/hook packaging or sturdier box packaging.
2. Present at most 2-3 viable options.
3. Prefer these packaging families:
   - `tuckbox`: leanest paperboard option for deck-first packaging
   - `hookbox`: adds interior + hang-tab style layout, useful when inside art matters
   - `twosidedbox` / `twosidedboxgloss`: sturdier full box print with top/bottom art
   - `boxtop` / `boxtopgloss`: top-only or top-and-side print when bottom art is not needed
   - `boxface`: single-face packaging such as booster packs or envelopes
   - `onesided` (`VHSBox`): packaging outlier with one printable face sheet
4. If only one viable option remains after fit constraints, explain why and ask for confirmation before create.

## Validation order
1. Resolve create vs in-place update.
2. Resolve packaging identity or narrow to 2-3 packaging candidates.
3. Resolve the API family `componentType` separately from the chosen catalog `identity`.
   - Example: `PokerTuckBox54` maps to `componentType=tuckbox` and `identity=PokerTuckBox54`
   - Do not pass `PokerTuckBox54` as `componentType`
4. Validate required printable slot set for the chosen family.
5. Validate finish/surfacing compatibility:
   - game-level UV/linen settings can affect packaging proof expectations,
   - gloss families allow optional spot-gloss overlays,
   - do not assume `surfacing_treatment` persists on every packaging API family.
6. Route art fit or proof concerns to `tgc-image-preflight-fit`.
7. Execute mutation only after missing/invalid packaging inputs are resolved.

## Required-art hard gates
- `tuckbox`: require `outsideFileId`
- `hookbox`: require `outsideFileId` and `insideFileId`
- `twosidedbox`: require `topFileId` and bottom-side art:
  - usually `bottomFileId`
  - for mint tins, use TGC's `back`/bottom surface expectations and verify readback carefully
- `boxtop`: require `topFileId`
- `boxtopgloss`: require `topFileId`; `spotGlossFileId` is optional but should align exactly if provided
- `twosidedboxgloss`: require `topFileId` and `bottomFileId`; `spotGlossFileId` and `spotGlossBottomFileId` are optional overlays
- `boxface`: require `faceFileId`
- `onesided` packaging (`VHSBox`): require `frontFileId` for the single printable face sheet

## Block conditions
- Missing required printable slot for the chosen packaging family
- User requests packaging create with only card/board art and no box art
- Requested spot-gloss overlay is provided without matching base art
- Packaging art is likely to clip at fold/flap lines and user has not approved the risk
- Existing packaging revision request would accidentally create a second package instead of updating the current one

## Special packaging notes
- Always recommend 3D viewer review for boxes, tins, and fold-heavy packaging before prototype order.
- For mint tins and other non-paper packaging surfaces, warn about white-ink behavior and avoid assuming pure white will print as visible white.
- For booster packs and envelopes, treat packaging as single-face art; make sure the user understands there is no second printable outer panel in this API family.
- For insert-style tuckboxes (`SmallProTarotInsert`, `SmallStoutTarotInsert`), confirm the user really wants an insert and not a full outer box.

## Update and readback rules
- Default to `tgc_component_update` for existing non-deck packaging changes.
- After create/update, verify:
  - the same packaging component id remains present for updates,
  - each expected slot persisted the intended file id,
  - optional gloss overlays are only reported as applied when readback confirms them.
- If slot readback does not match, treat the operation as failed and return remediation steps.

## Output contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list of packaging-specific blockers or cautions
- `next_actions`: ordered steps
- `recommended_options`: present only when packaging type is still undecided
