# Session: TGCAGENT Orchestration Slim-Down

Date: 2026-02-28

## Goal
Keep `context/TGCAGENT.md` high-level and move procedural/how-to detail to skills references.

## Changes
- Rewrote `context/TGCAGENT.md` from detailed procedural catalog to orchestration-level profile.
- Preserved global preferences (`currency`, `feedback_contribution`).
- Kept high-level behavior:
  - guided workflow defaults,
  - preflight-first policy,
  - privacy/safety publication rules,
  - user-facing output conventions.
- Added explicit delegation boundary to `skills/tgc-guided-workflows/references/*` for detailed execution instructions.

## Rationale
- Reduces duplication and drift between AGENT profile and skills.
- Keeps the public profile concise and reusable.
- Ensures component-specific/how-to content stays in skill references where it is easier to maintain.

## Private Follow-Up (not committed)
- Added local-only note `subprojects/private-roadmap-security.md` to track pre-Goal-B security cleanup tasks.
