# Session: Clarify project-root scope for MCP setup

## Date
- 2026-02-23

## Goal
- Correct setup docs so users configure MCP from their own project root, not from the TGCMCP repository root.

## Changes Made
- Updated `README.md` MCP install steps:
  - Codex section now explicitly says to run setup from the user's target project root.
  - Claude section now explicitly says to place/configure MCP in the user's target project context.
- Updated `tools/codex-mcp-local-setup.md`:
  - clarified "from your target project root" wording.

## Notes
- This aligns setup guidance with typical per-project MCP configuration workflows.
