---
name: tgc-image-preflight-fit
description: Preflight and remediate TGC image layout for safe zone, bleed, trim, gutter, and proof-fit constraints before upload.
---

# Skill: TGC Image Preflight and Fit

## Purpose
Ensure generated or imported art is positioned and scaled to survive cutting, bleed, binding, and proof constraints with minimal trial-and-error.

## Use This Skill When
- The user asks to generate or adjust component artwork.
- The workflow includes proof-fit iteration after warnings/clipping.
- Content must be validated against safe zone, bleed, trim, or gutter constraints.
- The request includes dial artwork alignment or readability corrections.

## Inputs Required
- Target component type and image dimensions.
- Source artwork or generation intent.
- Fit intent (`safe`, `near-trim`, or `full-bleed`).

## Outputs Produced
- Fit report (bounds, clearances, known risks).
- Recommended or applied placement/scaling parameters.
- Proof iteration plan when warnings are present.

## Safety and Privacy
- Never expose secrets, local environment values, or proprietary assets in reusable outputs.
- Keep user-specific artwork details out of public guidance artifacts.
- Ask before destructive overwrite of previously approved art.

## Workflow
1. Resolve component geometry and risk zones (trim, bleed, cut, fold, axle/window zones).
2. Apply fit-intent defaults and safe frame placement.
3. Produce fit report before upload.
4. Validate fit against shared contract; block mutation if status is fail.
5. If proof issues appear, apply deterministic parameter updates and patch in place.
6. Verify required target slot persisted intended file id via readback before reporting success.

## Read Additional References Only As Needed
- Read `references/workflows.md` for fit algorithm defaults and proof-remediation loop.
- Read `references/image-preflight-and-fit.md` for geometry-aware checks, fit modes, and dial-specific guardrails.
- Read `references/shared-fit-contract.md` for cross-skill fit/quality gates and utilization thresholds.
