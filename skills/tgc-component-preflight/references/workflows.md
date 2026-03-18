# TGC Component Preflight Workflow

## Validation Order
1. Confirm target object scope: game-level create vs component-level update.
2. If the request falls into a focused family skill (for example packaging, books, custom-cut, parts, or image-fit remediation), route there first.
3. Resolve product constraints for the requested component type.
4. Validate required media slots and quantity limits.
5. Validate option compatibility (finish/surfacing/identity/side counts/page rules).
6. Choose in-place update over duplicate create when editing existing non-deck components.

## Block Conditions
- Missing required art/media slot.
- Side/page requirements not satisfied.
- Invalid quantity or option selection.
- Known high-risk layout/proofing conflict without user approval.
- Attempt to create required-art component without required files attached.

## Required-Art Hard Gate
- For components that require image slots to be printable (for example many box/board surfaces), do not create component until required files are supplied unless user explicitly asks for placeholder creation.
- If user requests placeholder create, warn it may be non-printable and require explicit confirmation.

## Post-Mutation Verification
- After create/update, read the component back and assert required slot/file mappings are present.
- If expected file IDs are not persisted, treat operation as failed and provide remediation path.

## Output Contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list
- `next_actions`: ordered, actionable steps
