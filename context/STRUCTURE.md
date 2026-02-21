# Folder purposes

This document defines the canonical folder structure and file placement rules for this repository.  
All agents must obey these rules when creating, modifying, or relocating files.

---

## context/
- Canonical, durable project truth. Audience: CLI first, humans second.
- Contents: only stable, authoritative, normative facts (architecture, invariants, non-negotiable rules). Treat as a project-specific system prompt.
- Use when: anchoring all work; resolving ambiguity; restating what must remain true if rebuilding from scratch.
- Canonical file: `context/MEMORY.md`  
  This is the primary long-term project memory and should be consulted first.
- Do not include: how-tos, temporary workarounds, debug notes, history, speculation, or anything expected to change soon.
- This folder represents *timeless truth*. If something changes frequently or is only true “right now,” it does not belong here.
- Update only when a fundamental rule or architecture truly changes, or a new invariant is introduced.

---

## sessions/
- Point-in-time checkpoints of state. Audience: CLI resuming after breaks or context loss.
- Contents: what was working, what wasn’t, decisions made, what’s explicitly out-of-scope at that moment.
- Use when: you need “state of the world” without replaying long history; before/after risky changes; to ground refactors.
- Examples: `2025-03-odds-ingestion-working.md`, `phase-a-pre-props-stable.md`, `pre-refactor-map-ids.md`.
- Snapshots may become outdated by design; never treat them as authoritative beyond their timestamp.
- Avoid turning snapshots into living docs; create new snapshots instead of editing old ones heavily.

---

## tools/
- Reusable playbooks for how work gets done. Audience: CLI-as-worker.
- Contents: when to use, steps to follow, invariants to respect, common failure modes for recurring tasks.
- Use when: executing multi-step changes or risky operations; reducing guesswork and hallucination.
- Examples: `n8n_ingestion_playbook.md`, `supabase_upsert_rules.md`, `how_to_add_new_market.md`, `debugging_500_errors.md`.
- Keep concise, actionable, and up to date; note prerequisites and rollback steps where relevant.
- Do not include narrative documentation or architectural explanation; those belong in `context/`.

---

## code/
- All project code lives under `code/`. No other top-level folder should contain source code.
- Mandatory subfolders:
  - `code/src/`  
    Only shippable, executable, or buildable sources.  
    If it runs, compiles, deploys, or is packaged, it belongs here.  
    Keep free of logs, caches, build outputs, and one-off experiments.  
    Production builds and deployment pipelines should target `code/src` only.
    - `code/src/supabase/`  
      Canonical, no-data Supabase schema snapshots for architecture/reference.  
      Use when discussing DB details or generating SQL; treat as authoritative.
  - `code/scripts/`  
    Developer and ops automation that supports the project (setup, maintenance, data pulls, builds, releases, etc.).  
    Scripts are not shipped as product runtime, but must be reliable, reusable, and safe to run repeatedly.  
    Organize with subfolders that make purpose clear (e.g., `code/scripts/dev/` for day-to-day helpers, `code/scripts/ci/` for CI entrypoints/wrappers like lint/test/build/package).
- Additional subfolders under `code/` may be defined per project, but only `code/src/` is guaranteed to contain ship-ready sources.

---

## logs/
- Exists in every project but is gitignored.
- Contents: runtime logs, debug dumps, CLI traces, temp diagnostics, or other artifacts that help build, manage, or maintain the project.
- Must not contain secrets or anything required to reproduce the project.
- Nothing in this folder should ever be required in source control.
