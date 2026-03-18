---
name: tgc-packaging-workflows
description: Guide TGC packaging selection and preflight for boxes, tins, envelopes, and booster packs with slot-completeness checks and proof-safe packaging guidance.
---

# Skill: TGC Packaging Workflows

## Purpose
Guide safe creation and update of TGC packaging components by narrowing packaging options, validating required art slots, and surfacing packaging-specific proofing risks before mutation.

## Use This Skill When
- The user wants a box, tuckbox, hookbox, mint tin, envelope, booster pack, insert, or other packaging component.
- The workflow is primarily about packaging choice, packaging art slots, spot-gloss behavior, or packaging proof review.
- The user needs help matching a deck/component payload to the right packaging form factor.

## Inputs Required
- Target game or existing packaging component context.
- Intended packaging goal or target identity when known.
- Art files for required packaging faces.
- Desired finish/surfacing choices when relevant.

## Outputs Produced
- Packaging recommendation set when component type is unspecified.
- Preflight decision: `proceed`, `block`, or `needs_input`.
- Required slot checklist and mutation sequence.
- Post-mutation readback/proof checklist.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Block packaging creation when required printable surfaces are missing unless the user explicitly approves a placeholder/non-print-ready create.
- Require explicit confirmation before destructive or publish-impacting actions.
- Require explicit user confirmation before public sharing/publishing actions.

## Workflow
1. Resolve whether the request is for packaging selection, packaging create, or packaging update.
2. When packaging type is unspecified, recommend at most 2-3 viable packaging options with concise tradeoffs.
3. For create/update calls, resolve the packaging API family `componentType` separately from the catalog `identity`.
   - Example: a poker tuckbox uses `componentType=tuckbox` and `identity=PokerTuckBox54`
   - Never send `PokerTuckBox54` or any other packaging identity as the `componentType`
4. Validate required packaging art slots, finish compatibility, and any special packaging caveats before mutation.
5. Delegate fit/safe-zone work to `tgc-image-preflight-fit` when packaging art needs bleed/trim/proof remediation.
6. Prefer in-place update for existing non-deck packaging components unless the user explicitly asks for a new variant.
7. After mutation, verify expected packaging slots persisted and recommend 3D viewer/proof review when appropriate.

## Read Additional References Only As Needed
- Read `references/workflows.md` for packaging preflight order, recommendation heuristics, and mutation/readback checks.
- Read `references/component-profiles.md` when resolving packaging identity details, slot models, sizes, and current TGC help links.
