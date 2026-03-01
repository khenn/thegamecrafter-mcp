# TGC Component Preflight Workflow

## Validation Order
1. Confirm target object scope: game-level create vs component-level update.
2. Resolve product constraints for the requested component type.
3. Validate required media slots and quantity limits.
4. Validate option compatibility (finish/surfacing/identity/side counts/page rules).
5. Choose in-place update over duplicate create when editing existing non-deck components.

## Block Conditions
- Missing required art/media slot.
- Side/page requirements not satisfied.
- Invalid quantity or option selection.
- Known high-risk layout/proofing conflict without user approval.

## Output Contract
- `status`: `proceed | block | needs_input`
- `reasons`: concise list
- `next_actions`: ordered, actionable steps
