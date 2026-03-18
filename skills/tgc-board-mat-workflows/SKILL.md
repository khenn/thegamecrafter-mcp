---
name: tgc-board-mat-workflows
description: Guide TGC board, mat, and screen selection with fold/surface-aware preflight, proof-readiness checks, and 3D-viewer guidance for board-like components.
---

# Skill: TGC Board, Mat, and Screen Workflows

## Purpose
Guide safe creation and update of TGC boards, mats, and screens by helping the agent choose the right board-like form factor, validate side/face requirements, and surface fold/proof/surfacing caveats before mutation.

## Use This Skill When
- The user wants a game board, game mat, neoprene mat, folding board, folding mat, or screen.
- The workflow includes choosing between board and mat form factors, fold counts, or screen formats.
- The user needs help with board-like proofing concerns such as fold behavior, drift, 3D viewer review, or dry erase / surfacing caveats.

## Inputs Required
- Target game or existing board/mat/screen component context.
- Intended form factor or target identity when known.
- Art files for the required printable faces/sides.
- Desired surfacing behavior when relevant.

## Outputs Produced
- Board/mat/screen recommendation set when identity is unspecified.
- Preflight decision: `proceed`, `block`, or `needs_input`.
- Required-side checklist and mutation sequence.
- Post-mutation proof/readback checklist.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Block creation when required board/mat/screen art surfaces are missing unless the user explicitly approves a placeholder/non-print-ready create.
- Require explicit confirmation before destructive or publish-impacting actions.
- Require explicit user confirmation before public sharing/publishing actions.

## Workflow
1. Resolve whether the request is optioning, create, or update for a board, mat, or screen.
2. When the type is unspecified, recommend at most 2-3 viable form factors with concise tradeoffs.
3. Validate required surfaces, folding/readability implications, and surfacing caveats before mutation.
4. Delegate trim/safe-zone/geometry work to `tgc-image-preflight-fit` when art fit or proof remediation is required.
5. Prefer in-place updates for existing non-deck board-like components unless the user explicitly asks for a variant.
6. After mutation, verify required surfaces persisted and recommend 3D viewer/proof review when the component has fold behavior or board-like assembly risk.

## Read Additional References Only As Needed
- Read `references/workflows.md` for recommendation heuristics, preflight order, and proof/readback behavior.
- Read `references/component-profiles.md` when resolving board/mat/screen identity details, dimensions, surface models, and current TGC help links.
