# Image Preflight And Fit Reference

## Geometry-Aware Preflight (Required For Image-Bearing Components)
Before upload:
1. Resolve product geometry and guides:
- pixel size,
- side requirements,
- template/overlay/mask paths (when available),
- trim/safe/fold/spine constraints.
2. Validate source:
- dimensions,
- aspect ratio,
- orientation,
- critical-content proximity to risky boundaries.
3. Flag risk conditions:
- likely clipping at trim/cut lines,
- text/icons near binding/fold,
- excessive letterboxing or uncontrolled crop.

## Fit Intent Modes
Use explicit fit modes and tell the user what was chosen:
- `safe` (default): prioritize content safety in legal/safe zones.
- `near-trim`: maximize coverage while keeping minimal safety buffer.
- `full-bleed`: maximize edge-to-edge coverage with accepted trim risk.

If user intent is unspecified, use `safe` and provide concise tradeoffs.

## Padding And Fill Strategy
When aspect mismatch needs padding:
- do not blindly default to white,
- choose/recommend fill that minimizes visible trim artifacts and suits artwork.

## Numeric Fit Report (Before Mutation)
Before upload, provide:
- target canvas size,
- content bounding box,
- minimum clearances to trim/safe/binding zones,
- residual risk notes.

## Print-Safe Defaults
- Text-heavy page imports:
  - use contain-fit, preserve aspect ratio, center in safe frame.
- Fallback insets:
  - non-bound: outer inset >=7%
  - bound: outer inset >=7%, binding inset >=12%
- Bound parity-aware binding inset:
  - odd pages: extra inset on left
  - even pages: extra inset on right

## Post-Proof Deterministic Iteration
When proof/screenshot feedback indicates issues:
1. Treat proof feedback as authoritative.
2. Recompute placement using same fit model + updated parameters.
3. Apply explicit parameter changes only (mode, insets, fill).
4. Re-upload and patch in place.
5. Report exactly what changed:
- previous/new file IDs,
- old/new fit parameters,
- expected improvement.

## Dial Geometry Preflight (Required For `dial` Components)
Before dial artwork upload or revision:
1. Resolve dial geometry:
- canvas size,
- cutline/safe guides,
- punched regions (holes/windows),
- fold/notch geometry (if present),
- expected play orientation.
2. Detect collisions:
- compute text/icon bounding boxes,
- reject/warn on overlap with hole/window/fold/notch regions,
- warn when critical content is too close to trim/safe boundaries.
3. Apply default auto-layout when user did not request exact coordinates:
- place semantic labels near their corresponding windows,
- keep labels outside center-hole and rotating wheel conflict zones,
- keep conservative buffer from fold axis and notch intrusions.
4. Validate post-assembly readability:
- simulate final play orientation,
- ensure labels are readable and semantically aligned in that orientation.
5. Produce concise dial fit report:
- dial canvas,
- label/track clearances to risky geometry,
- orientation/readability status,
- residual risks (if any).
