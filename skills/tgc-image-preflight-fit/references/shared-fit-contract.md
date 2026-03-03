# Shared Fit Engine Contract (Cross-Skill)

This contract is the single source of truth for placement/fit decisions used by:
- `tgc-image-preflight-fit`
- `tgc-book-rulebook-workflows`
- `tgc-component-preflight` (for slot-complete create gating)

## Inputs
- Target geometry (canvas size, product identity/component type).
- Risk zones (trim/safe/bleed/binding/fold/windows/holes where available).
- Source bounds and aspect ratio.
- Fit intent: `safe | near-trim | full-bleed`.

## Outputs
- `fit_intent`
- `content_bounds` (`x_min`, `x_max`, `y_min`, `y_max`)
- `safe_frame_utilization_pct`
- `risk_flags[]`
- `status`: `pass | fail | needs_confirmation`

## Hard Rules
1. Never report success without a post-mutation readback check for required file slots.
2. If `status=fail`, mutation must be blocked.
3. If `status=needs_confirmation`, show explicit risk and wait for user decision.

## Board-Specific Rule
- Default board mode is **maximize within safe frame**.
- Avoid tiny centered content with large neutral padding.
- If `safe_frame_utilization_pct < 85`, auto-remediate once; if still below threshold, block pending user confirmation.

## Book-Page Rule
- Every imported/generated page must pass fit checks before upload.
- Text-heavy pages cannot be edge-fit to full bleed by default.
- Enforce gutter-aware insets for bound products.

## Dial-Specific Rule (DualDial Included)
- Use template/mask-derived geometry when available; heuristic fallback is secondary and must be flagged.
- Functional labels (for example `HP`, `MANA`) must be vertically aligned to corresponding indicator windows in assembled orientation.
- Safe-zone pass alone is insufficient if semantic alignment fails.
- Proof quality gate: if proof indicates misalignment, do not report success until corrected or user explicitly accepts risk.
