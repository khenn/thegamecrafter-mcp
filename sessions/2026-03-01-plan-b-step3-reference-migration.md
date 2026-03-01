# Session: Plan B step 3 - reference re-scoping

## Goal
Reduce context loading by moving deep guidance from router skill references into family-owned skill references.

## Changes
- Router reference slim-down:
  - Rewrote `skills/tgc-guided-workflows/references/workflows.md` as orchestration-only routing + global workflows.
  - Removed large deep-detail refs from router:
    - `skills/tgc-guided-workflows/references/component-profiles.md`
    - `skills/tgc-guided-workflows/references/image-preflight-and-fit.md`
  - Updated `skills/tgc-guided-workflows/SKILL.md` reference-loading list accordingly.

- Component-family ownership:
  - Added `skills/tgc-component-preflight/references/component-profiles.md`
  - Updated `skills/tgc-component-preflight/SKILL.md` to load it as needed.

- Book-family ownership:
  - Added `skills/tgc-book-rulebook-workflows/references/book-component-profiles.md`
  - Updated `skills/tgc-book-rulebook-workflows/SKILL.md` to load it as needed.

- Image-family ownership:
  - Added `skills/tgc-image-preflight-fit/references/image-preflight-and-fit.md`
  - Updated `skills/tgc-image-preflight-fit/SKILL.md` to load it as needed.

- Roadmap progress update:
  - Marked initial B.3 migration milestone in `ROADMAP.md`.

## Validation
- `npm --prefix code run skills:test` -> pass
  - skill package validation pass (4 skills)
  - trigger tests pass (4 skill fixture sets)
  - fixture tests pass
