# Session: Feedback Scope Triage + Plan Update

Date: 2026-02-25

## Objective
Add explicit local build-agent instruction for feedback scope triage, then reassess issue #1 for component/family/global applicability.

## Changes
- Updated root `AGENTS.md` with a new `Feedback Triage Rule`:
  - mandatory scope classification (component, family, global),
  - prefer highest safe generalization,
  - include immediate fix + regression tests + docs/skills updates + roadmap impact in proposals.

## Analysis Outcome (Issue #1)
- Component-specific:
  - identity requirement sensitivity observed on `customcolord6`.
- Family-specific:
  - side-slot completeness + identity mapping apply to custom dice families (`customcolord4/6/8`).
- Global:
  - iterative updates are not unique to dice; many components benefit from in-place update contract (`tgc_component_update`) to avoid churn/duplicates.

## Plan Direction
- Expand prior dice-focused fix into a global non-deck update mutation with family-specific guardrails and representative regression tests.
