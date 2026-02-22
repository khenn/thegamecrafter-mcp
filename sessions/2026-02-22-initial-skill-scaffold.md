# Session: Initial Skill Scaffold + Auto-Maintenance Policy

## Date
- 2026-02-22

## Objective
- Add a standard in-repo skills structure for future public sharing.
- Establish automatic skill maintenance behavior in root agent instructions.

## Changes Made
- Updated canonical structure doc:
  - `context/STRUCTURE.md` now defines top-level `skills/` and layout conventions.
- Updated root agent instructions:
  - `AGENTS.md` now references `skills/` under folder expectations.
  - Added "Skills Maintenance Policy" requiring proactive updates to skill files when workflows/contracts change.
- Added initial public/shareable skill:
  - `skills/tgc-guided-workflows/SKILL.md`
  - Includes guided create-game flow, cleanup pattern, and output behavior.

## Notes
- This creates a standard, portable layout similar to public skill repositories (`skills/<name>/SKILL.md`).
