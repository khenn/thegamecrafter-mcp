# Session: Image preflight and proof-fit guidance update

## Date
- 2026-02-23

## Goal
- Incorporate practical image-fit lessons from live proofing into public AGENT + skills so agents reduce clipping risk and handle proof feedback deterministically.

## Source
- `logs/2026-02-23-204322-agents-notes-image-preflight-and-fit.md`

## Changes Made
- Updated `context/TGCAGENT.md` with stronger image-bearing workflow rules:
  - geometry-aware preflight before upload,
  - explicit fit intent modes (`safe`, `near-trim`, `full-bleed`),
  - default to `safe` when intent is unspecified,
  - treat padding/fill as a print decision,
  - require concise numeric fit report before upload,
  - deterministic post-proof correction loop with explicit change reporting.
- Updated `skills/tgc-guided-workflows/SKILL.md`:
  - added geometry-aware preflight requirement,
  - added fit mode behavior,
  - added fit-report requirement,
  - linked new image-fit reference.
- Added new reference:
  - `skills/tgc-guided-workflows/references/image-preflight-and-fit.md`
  - includes preflight geometry checks, fit modes, fill strategy, fit report fields, and deterministic post-proof iteration steps.
- Updated related references:
  - `skills/tgc-guided-workflows/references/guardrails.md`
  - `skills/tgc-guided-workflows/references/workflows.md`

## Notes
- These are behavior-level guidance updates only; no API/tool contract changes.
