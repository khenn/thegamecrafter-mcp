---
name: tgc-custom-cut-workflows
description: Guide TGC custom-cut punchouts, stickers, dials, and dual-layer boards with geometry-aware preflight, slot validation, and proof-safe mutation sequencing.
---

# Skill: TGC Custom-Cut Workflows

## Purpose
Guide safe creation and update of TGC custom-cut components by helping the agent choose the right custom-cut family, validate required surfaces and template assumptions, and surface assembly/geometry risks before mutation.

## Use This Skill When
- The user wants a custom punchout, custom cardstock, custom sticker, slugged punchout set, standee, chit, shard, tile, dial, dice sticker, or dual-layer board.
- The workflow includes choosing between sticker vs punchout vs cardstock vs dial vs dual-layer board.
- The user needs help with cutline, slug/template, standee slot, dial window, or pocket-alignment concerns.

## Inputs Required
- Target game or existing custom-cut component context.
- Intended custom-cut outcome or target identity when known.
- Art files for the required surfaces and any cutline/template plan when relevant.
- Desired assembly behavior when relevant:
  - standee,
  - hinge,
  - screw/dial,
  - sticker,
  - dual-layer pocket board.

## Outputs Produced
- Custom-cut recommendation set when identity is unspecified.
- Preflight decision: `proceed`, `block`, or `needs_input`.
- Required-surface and template checklist.
- Post-mutation readback and proof checklist.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Block custom-cut create when required printable surfaces or template assumptions are unresolved unless the user explicitly approves a placeholder/non-print-ready create.
- Warn before assembly-sensitive mutations where standee slots, dial windows, or dual-layer pockets could make the art unusable.
- Require explicit confirmation before destructive or publish-impacting actions.
- Require explicit user confirmation before public sharing/publishing actions.

## Workflow
1. Resolve whether the request is optioning, create, or update for a custom-cut family component.
2. When the type is unspecified, recommend at most 2-3 viable custom-cut families with concise tradeoffs.
3. Validate required surfaces, template/cutline assumptions, and assembly geometry before mutation.
4. Delegate trim, safe-zone, or readability remediation to `tgc-image-preflight-fit` when the art needs proof-fit work.
5. Prefer in-place updates for existing non-deck custom-cut components unless the user explicitly asks for a variant.
6. After mutation, verify required surfaces persisted and recommend an assembly-aware proof pass when the component relies on windows, slots, hinges, or layered pockets.

## Read Additional References Only As Needed
- Read `references/workflows.md` for recommendation order, hard gates, and assembly/readback behavior.
- Read `references/component-profiles.md` when resolving custom-cut identity details, dimensions, slot models, and current TGC help links.
