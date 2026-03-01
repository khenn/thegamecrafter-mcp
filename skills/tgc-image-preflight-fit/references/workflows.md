# TGC Image Preflight/Fit Workflow

## Fit Intents
- `safe`: prioritize readable content safety margins.
- `near-trim`: maximize area while retaining safety for critical text.
- `full-bleed`: fill to bleed with warning if critical content enters high-risk zone.

## Pre-Upload Checks
1. Confirm target dimensions and orientation.
2. Compute safe-frame inset and binding-side inset where applicable.
3. Keep text/icons out of trim/bleed and geometry conflict zones.
4. Emit concise fit report with residual risks.

## Proof Remediation Loop
- If proofing flags clipping/misalignment:
  - adjust insets/scale/anchor deterministically,
  - preserve visual intent,
  - re-upload in place when possible.
