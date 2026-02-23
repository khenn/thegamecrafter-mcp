# Session: Simplify README skill/agent copy instructions

## Date
- 2026-02-23

## Goal
- Reduce setup verbosity by removing path-variable setup in Skills and Agent sections.

## Changes Made
- Updated `README.md`:
  - removed `PROJECT_ROOT`, `CODEX_SKILLS_DIR`, and `CLAUDE_SKILLS_DIR` variable setup steps from Skills install instructions.
  - replaced with direct copy-to-path examples for Unix-like and PowerShell.
  - removed `PROJECT_ROOT` variable setup from Agent install instructions.
  - replaced with direct project-root copy examples for `AGENTS.md` and `Claude.md` conversion.
- Kept project-scoped and user-scoped destination guidance, but made execution steps shorter and more direct.
