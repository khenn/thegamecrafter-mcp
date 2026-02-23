# Session: Codex standard MCP install docs and helper script untracked

## Date
- 2026-02-23

## Goal
- Replace custom Codex helper-script install guidance with standard Codex MCP commands.
- Stop tracking the Codex install helper script in git while keeping it locally.

## Changes Made
- Updated `README.md`:
  - Added expected Codex CLI version (`>=0.104.0`, tested on `0.104.0`).
  - Replaced helper-script-based Codex MCP setup with direct `codex mcp add` instructions.
  - Added both Unix-like and Windows PowerShell examples for direct Codex MCP registration.
  - Removed bash-helper-specific notes from Codex install section.
- Updated `tools/codex-mcp-local-setup.md`:
  - Replaced helper script setup with direct `codex mcp add` command usage.
  - Added expected Codex CLI version.
- Updated `.gitignore` to ignore:
  - `code/scripts/dev/configure-codex-mcp.sh`
- Untracked helper script from git index while leaving local file in place:
  - `code/scripts/dev/configure-codex-mcp.sh`

## Notes
- This change keeps local convenience scripts possible without requiring repository maintenance of a wrapper install script.
