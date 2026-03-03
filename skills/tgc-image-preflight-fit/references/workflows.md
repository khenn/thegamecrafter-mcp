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
5. Compute and report `safe_frame_utilization_pct`.
6. Apply shared-fit contract status (`pass | fail | needs_confirmation`).

## Proof Remediation Loop
- If proofing flags clipping/misalignment:
  - adjust insets/scale/anchor deterministically,
  - preserve visual intent,
  - re-upload in place when possible.

## Required Quality Gates
- For board components, target safe-frame utilization >= 85% unless user explicitly accepts lower utilization.
- For dial components, enforce semantic vertical alignment between functional labels and their indicator windows in assembled orientation.
- After upload/update, read component back and confirm required file slot points to intended file ID before reporting success.
