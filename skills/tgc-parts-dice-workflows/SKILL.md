---
name: tgc-parts-dice-workflows
description: Guide TGC parts workflows for acrylic shapes, printed dice, printed meeples, and play money with surface validation, orientation checks, and finish-aware preflight.
---

# Skill: TGC Parts and Dice Workflows

## Purpose
Guide safe creation and update of TGC parts workflows by helping the agent choose the right parts family, validate required printable sides, and surface finish/orientation/material risks before mutation.

## Use This Skill When
- The user wants custom acrylic shapes, printed dice, printed D6/D4/D8 components, printed meeples, or play money.
- The workflow includes choosing between thicknesses, side counts, die face coverage, or part-specific material/long-edge-flip behavior.
- The user needs help with face-count completeness, acrylic double-sided art, printed-meeple side choice, or play-money long edge flip orientation.

## Inputs Required
- Target game or existing part component context.
- Intended part identity when known.
- Art files for all required printed sides.
- Desired material, thickness, or part behavior when relevant.

## Outputs Produced
- Part recommendation set when identity is unspecified.
- Preflight decision: `proceed`, `block`, or `needs_input`.
- Required-side checklist and mutation sequence.
- Post-mutation readback and proof checklist.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Block create when required printed sides are missing unless the user explicitly approves a placeholder/non-print-ready create.
- Warn before workflows where orientation, white printing, or low-resolution face art could make the finished part unusable.
- Require explicit confirmation before destructive or publish-impacting actions.
- Require explicit user confirmation before public sharing/publishing actions.

## Workflow
1. Resolve whether the request is part optioning, create, or update.
2. When the type is unspecified, recommend at most 2-3 viable part identities with concise tradeoffs.
3. Validate required sides, face counts, orientation rules, and finish/material caveats before mutation.
4. Delegate trim, safe-zone, or per-face readability remediation to `tgc-image-preflight-fit` when art needs proof-fit work.
5. Prefer in-place updates for existing non-deck parts unless the user explicitly asks for a variant.
6. After mutation, verify required sides persisted and recommend a proof pass when the part depends on per-face readability, acrylic edge clearance, or flip orientation.

## Read Additional References Only As Needed
- Read `references/workflows.md` for recommendation order, hard gates, and part-specific readback behavior.
- Read `references/component-profiles.md` when resolving part identity details, dimensions, side models, and current TGC help links.
