# Session: Local Context Files Untracked + Deprecated Shim Removed

Date: 2026-02-28

## Goal
Keep personal/local context files out of public git history and remove deprecated public-agent shim path.

## Changes
- Added local-ignore entries in `.gitignore`:
  - `context/MEMORY.md`
  - `context/STRUCTURE.md`
- Stopped tracking in git (kept local copies):
  - `context/MEMORY.md`
  - `context/STRUCTURE.md`
- Removed deprecated shim file:
  - `context/AGENTS.md`
- Replaced historical references from `context/AGENTS.md` to `context/TGCAGENT.md` in `sessions/`.

## Validation
- Root local `AGENTS.md` still references:
  - `context/MEMORY.md`
  - `context/STRUCTURE.md`
- `context/TGCAGENT.md` does not reference local personal files.
- No remaining repo references to `context/AGENTS.md`.
