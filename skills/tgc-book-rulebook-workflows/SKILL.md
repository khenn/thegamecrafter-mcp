---
name: tgc-book-rulebook-workflows
description: Build and validate TGC books, folios, documents, and score pads with parity checks, fold/orientation guidance, cover handling, and page import sequencing.
---

# Skill: TGC Book and Rulebook Workflows

## Purpose
Guide safe, high-quality creation and update of TGC booklet, coil, perfect-bound, folio, document, and score-pad workflows with correct sequencing and print-safe constraints.

## Use This Skill When
- The user requests a rulebook, booklet, coil book, perfectbound book, folio, document, or score pad.
- The workflow includes PDF/image-to-page import.
- Page parity, cover behavior, fold orientation, or binding-side readability is a concern.

## Inputs Required
- Target game and desired book-like component type.
- Source content (PDF/pages/images) and intended page range.
- User choices for parity handling or fold/orientation handling when relevant.

## Outputs Produced
- Component recommendation (max 2-3 options when component is unspecified).
- Preflight plan including parity, fold/orientation, and cover/page sequencing checks.
- Ordered mutation plan for book-like create/update and page upload.

## Safety and Privacy
- Never expose secrets, local environment values, or proprietary file contents beyond active workflow output.
- Do not infer publication consent from build intent; require explicit confirmation for publish-facing actions.
- Warn before applying auto-padding or page transforms that alter source content.

## Workflow
1. Determine viable book-like options and ask user to choose when unspecified.
2. Run page parity, fold orientation, and binding/gutter checks before create.
3. Run each page or printable side through shared fit contract before upload.
4. Build upload plan:
   - cover + interior order for bound books,
   - front/back orientation for folios, documents, and score pads.
5. Execute in deterministic sequence and prefer in-place updates when revising existing non-deck book-like components.
6. Verify required slots/pages persisted as intended and report residual proofing risks.

## Read Additional References Only As Needed
- Read `references/workflows.md` for parity rules, sequencing, and proof-risk checks.
- Read `references/book-component-profiles.md` when selecting among document/booklet/coil/perfectbound options.
- Read `references/shared-fit-contract.md` for cross-skill fit gates applied to page imports.
