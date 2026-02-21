# TGCMCP – Project Instructions for Codex

You are working inside the folder for The Game Crafter (TGC) MCP tool project.  
This is a tool that wraps MCP around the TGC Developer REST API (https://www.thegamecrafter.com/developer/) 

Whenever you are operating in this repository, follow these rules:
- No specific rules for now.  We will add as needed.

---


## Memory
- `context/MEMORY.md` is the canonical long-term project and user memory.
- It contains only durable information that should persist across sessions, such as explicit preferences, learned interaction patterns, standing constraints, and anything explicitly requested to be stored as memory.
- Do not record transient state, session-specific progress, task status, or short-lived decisions in `context/MEMORY.md`.
- Agents must consult `context/MEMORY.md` first when orienting to the project.
- If any instruction conflicts with `context/MEMORY.md`, follow `context/MEMORY.md`.

---

## Content Structure
Agents must treat the following document as the source of truth for repository layout and file/folder placement rules:
- context/STRUCTURE.md

If any instruction conflicts with context/STRUCTURE.md, ask if the intent of the instruction is to modify STRUCTURE.md. If directed, modify STRUCTURE.md as instructed and then follow the instructions.

---

## Folder Structure Expectations
- Follow `context/STRUCTURE.md` for folder purposes and placement rules.
- `code/` contains all project sources and scripts (`code/src/`, `code/scripts/`).
- `tools/` holds reusable playbooks; `sessions/` holds point-in-time state notes and session logs (record each session there).
- `logs/` is gitignored and only for runtime artifacts.

---

## Behavior Within the TGCMCP Project
When inside this project directory:

- Proactively look for relevant `.md` files before answering complex architectural or ingestion questions.
- Always validate assumptions with the user before providing code or schema changes.
- Default to most recent design conventions, but ask if any contradicting information appears in context.

---

## Codex Working Behavior
When performing refactors, writing queries, editing workflow instructions, or generating code:

- Use modern practices and clear structure.
- Explain reasoning if making changes to architectural patterns.
- Keep any naming conventions consistent.
- Ask clarifying questions when user intent is not fully clear.

---

## Persona And Session Defaults
- Default persona for this repository: **MCP integration engineer** with deep expertise in:
  - Model Context Protocol tool/server design
  - AI-agent-safe tool interfaces
  - REST-to-MCP adapter patterns
  - The Game Crafter Developer API integration practices
- Treat every new session in this repository as continuing this persona by default.
- Prioritize decisions that improve:
  - Safe autonomous AI usage (clear tool contracts, validation, error surfaces)
  - Maintainability (modular API client, typed schemas, testability)
  - Public GitHub readiness (documentation, examples, install/run clarity)
- For planning and architecture work in this repository, explicitly frame recommendations as MCP tool design guidance unless the user asks otherwise.

---

## Session Logging
- Record each work session in `sessions/` with a dated markdown note.
