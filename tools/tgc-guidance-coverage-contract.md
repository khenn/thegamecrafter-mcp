# TGC Guidance Coverage Contract

Date: 2026-03-12
Status: Phase 1 foundation for A5

## Purpose
Define what "guidance coverage" means for TGCAGENT and skills so A5 can be completed against a strict, reviewable contract instead of ad hoc reference growth.

## Design goals
- Keep `context/TGCAGENT.md` lean and orchestration-focused.
- Keep broad routing in `skills/tgc-guided-workflows`.
- Keep deep component knowledge in focused family skills and references.
- Prefer progressive disclosure so only workflow-relevant context is loaded for a given task.

## Coverage levels

### Level 0: Unowned
Identity has no assigned workflow-family owner.

### Level 1: Owned
Identity has a target owner workflow family and appears in the generated owner map.

### Level 2: Baseline-guided
Identity has an explicit reference entry in a skill-owned profile file.

Minimum fields:
- identity
- product URL
- primary help/article URL, or best available authoritative fallback
- component slot model or page model
- primary preflight notes

### Level 3: Contract-complete
Identity is baseline-guided and the owning skill family includes enough detail to drive safe user guidance with minimal extra context.

Required elements:
- target owner skill family
- product URL
- product API URL when available
- current user-facing help source
- slot/page model
- image/template dimensions when available
- key hard constraints
- default warning/correction prompts
- fit/proof notes or explicit handoff to `tgc-image-preflight-fit`
- create-vs-update notes when relevant
- at least one prompt/routing fixture covering the family behavior

### Level 4: Parity-validated
Contract-complete guidance has been exercised in a representative live tgcagent workflow and documented in `sessions/`.

## A5 completion target
A5 is complete when every active catalog identity reaches at least `Level 3: Contract-complete`, and every major workflow family has representative `Level 4` live parity evidence.

## Ownership model
The generated owner map must assign every identity to exactly one primary workflow family:
- `tgc-book-rulebook-workflows`
- `tgc-packaging-workflows`
- `tgc-card-deck-workflows`
- `tgc-board-mat-workflows`
- `tgc-custom-cut-workflows`
- `tgc-parts-dice-workflows`

Supporting skills may also apply:
- `tgc-guided-workflows` for orchestration only
- `tgc-image-preflight-fit` for fit/proof/geometry guidance

## Reference placement rules
- Put workflow triggers, inputs/outputs, and delegation behavior in the owning skill `SKILL.md`.
- Put reusable family operating logic in `references/workflows.md`.
- Put identity-specific facts in family `references/component-profiles.md`.
- Put cross-family fit/proof logic in `tgc-image-preflight-fit`.
- Keep `context/TGCAGENT.md` free of per-identity deep detail.

## Regression expectations
Generated A5 artifacts should answer:
- Which identities are active in the live catalog?
- Which workflow family owns each identity?
- Which identities are only owned vs baseline-guided vs contract-complete?
- Which categories or owner families are underserved?
- Which source references look stale and need refresh?

## Review rules
- Do not mark an identity covered solely because a category article exists.
- Do not duplicate large blocks of shared fit/proof text across families.
- Prefer family-level reusable guidance plus identity-level overrides.
- If an identity lacks a direct help article, use the nearest authoritative TGC source and call out the fallback explicitly.
