# Session: Split Local vs Public Agent Instructions

## Date
- 2026-02-22

## Objective
- Keep local `AGENTS.md` focused on project-specific execution.
- Create a public-facing agent instruction file for later GitHub sharing.

## Changes Made
- Added `context/AGENTS.md` as a reusable/public behavior profile for TGCMCP agents.
- Updated root `AGENTS.md` to explicitly load `context/AGENTS.md`.
- Added precedence rule:
  - root `AGENTS.md` overrides `context/AGENTS.md` for local/project-specific conflicts.

## Notes
- This supports private local directives and a cleaner public instruction artifact in parallel.
