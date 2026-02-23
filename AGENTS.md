# TGCMCP - Project Build Instructions

You are working inside the TGCMCP repository (The Game Crafter MCP server project).
This root `AGENTS.md` is for local/project build behavior only.

## Scope
- Focus on building and maintaining the MCP server, contracts, tests, docs, and skills in this repo.
- Do not treat this file as the public/end-user interaction profile.
- `context/AGENTS.md` is maintained as a publishable public profile artifact, but it is not the controlling instruction set for local build work unless the user explicitly asks to test that profile.

## Project Priorities
- Contract-first MCP development.
- Safe autonomous usage (clear validation, explicit failure modes).
- Maintainable code organization and testability.
- Public GitHub readiness (clear docs, reproducible setup, examples).

## Memory
- `context/MEMORY.md` is the canonical long-term project/user memory.
- Record only durable preferences/constraints there.
- Do not write transient task state into `context/MEMORY.md`.

## Structure
- Follow `context/STRUCTURE.md` for file/folder placement.
- `code/` for source/scripts, `skills/` for reusable skills, `tools/` for playbooks, `sessions/` for dated session notes.
- `logs/` is runtime artifact space and is gitignored.

## Working Rules
- Use modern, explicit interfaces and typed schemas.
- Keep naming and contracts consistent across service/handler/contract layers.
- Prefer incremental, test-gated delivery.
- For breaking behavior or architecture changes, document the rationale in repo docs.

## Skills Maintenance
- Treat `skills/` as first-class deliverables.
- When workflows/tool behavior changes materially, update the relevant `skills/<skill>/SKILL.md` in the same workstream.
- Proactively update `context/AGENTS.md` whenever reusable public behavior for TGC game-building workflows changes.
- Proactively update both `context/AGENTS.md` and `skills/tgc-guided-workflows/SKILL.md` when new component constraints, options, links, or guardrails are discovered.

## Session Logging
- Record each work session in `sessions/` with a dated markdown note.
