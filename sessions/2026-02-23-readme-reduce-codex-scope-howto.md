# Session: Reduce Codex scope-specific how-to detail in README

## Date
- 2026-02-23

## Goal
- Avoid maintaining brittle Codex scope command details while still warning users to choose local vs global scope.

## Changes Made
- Simplified Codex MCP install section:
  - removed prescriptive project-local `CODEX_HOME` command variants.
  - removed duplicate global-vs-local command blocks.
  - retained explicit requirement to choose local or global scope before setup.
- Added links to Codex docs and CLI help for current scope configuration details:
  - `https://developers.openai.com/codex/`
  - `https://developers.openai.com/codex/skills/`
  - `codex mcp --help`
  - `codex mcp add --help`
- Updated skills scope note to be guidance-only (match runtime scope to install location).
- Updated LLM operator notes to explicitly ask user local vs global scope before Codex MCP config changes.

## Notes
- README remains actionable while reducing maintenance burden from fast-moving Codex scope mechanics.
