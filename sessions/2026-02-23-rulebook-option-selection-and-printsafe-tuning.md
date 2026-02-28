# Session: Rulebook option-selection and print-safe tuning

## Date
- 2026-02-23

## Goal
- Prevent auto-selection of rulebook component for outcome-based requests.
- Improve print-safe behavior for PDF/image imports to reduce trim/binding clipping risk.

## Changes Made
- Updated `context/TGCAGENT.md`:
  - reinforced outcome-based component selection behavior:
    - present 2-3 options when component type is not specified,
    - if only one viable option remains, explain exclusions and request explicit confirmation.
  - added stronger print-safe rules for PDF/image imports:
    - contain-fit (no default full-bleed for text-heavy pages),
    - safe-frame fallback insets (>=7% outer, >=12% binding for bound products),
    - parity-aware gutter inset for bound books,
    - pre-upload clipping-risk check and auto-remediation offer.
  - added explicit rulebook-from-PDF behavior to require optioning/confirmation.
- Updated `skills/tgc-guided-workflows/SKILL.md`:
  - mirrored the one-viable-option confirmation rule.
  - mirrored strengthened print-safe defaults and remediation behavior.
- Updated `skills/tgc-guided-workflows/references/workflows.md`:
  - added `Rulebook From PDF (Outcome-Based)` workflow with optioning and confirmation gates.
- Updated `skills/tgc-guided-workflows/references/guardrails.md`:
  - added `Print-Safe Upload Guardrail` section with concrete rendering and remediation requirements.
- Updated `skills/tgc-guided-workflows/references/component-profiles.md`:
  - added rulebook suitability notes for booklet/coil/perfectbound options.

## Notes
- This tuning is behavior-level guidance for LLM execution paths.
- No MCP API/tool contract changes were required for this iteration.
