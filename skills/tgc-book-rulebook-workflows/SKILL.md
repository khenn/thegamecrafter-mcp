---
name: tgc-book-rulebook-workflows
description: Build and validate TGC book/rulebook components with page-count parity checks, cover handling, gutter-safe layout guidance, and page import sequencing.
---

# Skill: TGC Book and Rulebook Workflows

## Purpose
Guide safe, high-quality creation and update of TGC booklet/coil/perfectbound workflows with correct page sequencing and print-safe constraints.

## Use This Skill When
- The user requests a rulebook, booklet, coil book, or perfectbound book.
- The workflow includes PDF/image-to-page import.
- Page parity, cover behavior, or binding-side readability is a concern.

## Inputs Required
- Target game and desired book component type.
- Source content (PDF/pages/images) and intended page range.
- User choices for parity handling (blank page fill, truncation, alternate format).

## Outputs Produced
- Component recommendation (max 2-3 options when component is unspecified).
- Preflight page plan including parity and cover/page sequencing checks.
- Ordered mutation plan for book create/update and page upload.

## Safety and Privacy
- Never expose secrets, local environment values, or proprietary file contents beyond active workflow output.
- Do not infer publication consent from build intent; require explicit confirmation for publish-facing actions.
- Warn before applying auto-padding or page transforms that alter source content.

## Workflow
1. Determine viable book options and ask user to choose when unspecified.
2. Run page parity and binding/gutter checks before create.
3. Build upload plan (cover + interior order) and execute in deterministic sequence.
4. Report residual proofing risks and offer remediation choices.

## Read Additional References Only As Needed
- Read `references/workflows.md` for parity rules, sequencing, and proof-risk checks.
- Read `references/book-component-profiles.md` when selecting among document/booklet/coil/perfectbound options.
