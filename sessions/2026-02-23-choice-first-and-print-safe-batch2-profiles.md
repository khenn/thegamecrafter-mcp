# Session: Choice-First Guidance + Print-Safe Rules + Batch2 Profiles

Date: 2026-02-23

## User Request
- If user does not specify a component, suggest best 2-3 relevant options (never exceed 3) and do not auto-decide.
- Add cut/binding-safe behavior for generated images.
- Pull TGC metadata for implemented Batch 2 components and capture it in AGENT/skills docs.

## Screenshot Review
- Reviewed: `logs/screenshots/Screenshot 2026-02-23 062624.png`
- Observed issue: page text extends into trim/binding risk area on the right side.
- Added guardrails requiring safe-zone/gutter-aware composition for generated pages.

## TGC Metadata Sources Used
- `https://www.thegamecrafter.com/api/tgc/products/Document`
- `https://www.thegamecrafter.com/api/tgc/products/LargeBooklet`
- `https://www.thegamecrafter.com/api/tgc/products/MediumCoilBook`
- `https://www.thegamecrafter.com/api/tgc/products/DigestPerfectBoundBook`
- `https://www.thegamecrafter.com/api/tgc/products/MediumScorePadColor`

## Files Updated
- `AGENTS.md`
- `context/TGCAGENT.md`
- `skills/tgc-guided-workflows/SKILL.md`

## Behavior Added
- Choice-first optioning:
  - For outcome-based requests with no component specified, propose up to 3 relevant implemented options and wait for user selection.
- Print-safe generation:
  - preserve safe zones, avoid trim/bleed risk, add binding gutter margin,
  - fallback insets when no machine-readable masks are available:
    - >=5% outer inset
    - >=8% binding-side inset
- Batch 2 references and constraints captured for:
  - Document
  - LargeBooklet
  - MediumCoilBook
  - DigestPerfectBoundBook
  - MediumScorePadColor

