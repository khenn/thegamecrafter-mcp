# Session: Skill structure best-practice refactor and local root-agent privacy

## Date
- 2026-02-23

## Goal
- Adopt Codex skill best practices (concise router + references).
- Keep local root agent files private (not pushed to public repo).

## Changes Made
- Refactored `skills/tgc-guided-workflows/SKILL.md` into a concise orchestration/router skill.
- Added progressive-disclosure references:
  - `skills/tgc-guided-workflows/references/workflows.md`
  - `skills/tgc-guided-workflows/references/guardrails.md`
  - `skills/tgc-guided-workflows/references/component-profiles.md`
- Updated `README.md` to document skill package layout (`SKILL.md`, `references/`, `agents/openai.yaml`).
- Updated `README.md` repository map to clarify that root `AGENTS.md` and `AGENT.md` are local-only.
- Added `.gitignore` rules for root `AGENTS.md` and `AGENT.md`.
- Removed root `AGENTS.md` and `AGENT.md` from git tracking while keeping local copies.
- Updated local root `AGENTS.md` policy with explicit skill writing/splitting guidance.

## Notes
- Public reusable agent profile remains `context/AGENTS.md`.
- Skill split policy now defaults to one orchestration skill unless a distinct workflow family justifies a new skill.
