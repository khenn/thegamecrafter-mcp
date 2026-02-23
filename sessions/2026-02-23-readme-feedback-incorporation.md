# Session: Incorporate LLM setup feedback into README

## Date
- 2026-02-23

## Goal
- Apply improvements from `logs/2026-02-23-readme-llm-setup-improvements.md` while keeping LLM-only guidance separate from manual setup guidance.

## Changes Made
- Updated Codex MCP section with explicit config scope guidance:
  - global vs project-local scope
  - warning that missing `CODEX_HOME` writes to global `~/.codex`
  - project-local install command provided first
  - scope-matched verify/remove examples
- Updated Codex Skills section:
  - clarified active-scope requirement when skills are installed under project-local `.codex`
  - added optional install path check command
- Updated Agent section:
  - added safe behavior when project already has `AGENTS.md` (copy to `AGENTS.tgcmcp.md` and merge)
- Updated Claude conversion note:
  - explicitly optional (only if Claude is used)
- Consolidated and simplified LLM setup prompt strategy:
  - prompt now tells LLM to clone repo, read README, and follow it exactly
  - removed duplicate long-form auto-setup prompt block
- Added LLM-only section:
  - `LLM Operator Notes (Optional)` with probe-before-mutate and idempotent setup guidance
- Added troubleshooting fallback for npm permission/cache issues:
  - `npm install --cache /tmp/$USER-npm-cache`

## Notes
- Manual installers get shorter direct steps.
- LLM-specific operational guidance is now explicitly segmented.
