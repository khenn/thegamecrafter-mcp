# Session: README formatting hardening for humans + LLMs

## Date
- 2026-02-23

## Goal
- Rework `README.md` so installation and usage instructions are explicit, consistently sectioned, and easy for both humans and LLMs to execute.

## Changes Made
- Rewrote `README.md` with clear top-level sections for:
  - `MCP`
  - `Skills`
  - `Agent`
- Added step-by-step instructions for both Codex and Claude under each relevant section.
- Added explicit MCP purpose/intended-use text.
- Added explicit skill purpose/intended-use text.
- Added explicit agent purpose/intended-use text.
- Added clear AGENTS-to-`Claude.md` conversion instructions.
- Kept repo policy that this project does not ship a `Claude.md` file directly.
- Added a small "LLM automation prompt" block to enable guided setup execution.
- Kept troubleshooting focused on common setup failures.

## Notes
- README now follows an ordered setup flow:
  1. Build
  2. Auth env vars
  3. MCP install
  4. Skills install
  5. Agent install
  6. Verification
- Auth examples continue to use environment variables for parity with current MCP server behavior.
