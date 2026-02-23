# Session: Skill packaging aligned to Codex practices

## Date
- 2026-02-23

## Goal
- Align TGCMCP skill packaging and install instructions with Codex skill best practices and documented install locations.

## Changes Made
- Updated `skills/tgc-guided-workflows/SKILL.md`:
  - added required YAML frontmatter (`name`, `description`).
- Added `skills/tgc-guided-workflows/agents/openai.yaml`:
  - UI metadata and MCP dependency declaration for the skill package.
- Updated `README.md` skills instructions:
  - switched to standard Codex locations (`<PROJECT_ROOT>/.codex/skills` and `~/.codex/skills`).
  - switched to standard Claude locations (`<PROJECT_ROOT>/.claude/skills` and `~/.claude/skills`).
  - changed install to copy entire skill folder (not only `SKILL.md`).
  - added restart guidance after skill install.
- Normalized Agent setup language in `README.md` to use `PROJECT_ROOT` for consistency.

## Notes
- Skill directory now follows the expected Codex shape:
  - `SKILL.md` with frontmatter
  - optional `agents/openai.yaml` metadata
