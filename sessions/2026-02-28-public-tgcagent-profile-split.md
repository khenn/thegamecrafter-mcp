# Session: Public TGC Agent Profile Split

Date: 2026-02-28

## Objective
Separate local repo-build agent behavior from public end-user TGC agent behavior, and avoid overwrite-based AGENTS installation patterns.

## Changes
- Added canonical public profile: `context/TGCAGENT.md`.
- Converted `context/AGENTS.md` into a compatibility shim pointing to `context/TGCAGENT.md`.
- Updated local root `AGENTS.md` (local-only, gitignored) to:
  - keep repo-build behavior,
  - load `context/TGCAGENT.md` only when explicitly simulating end-user TGC workflows,
  - maintain proactive update rules for `context/TGCAGENT.md` + skills.
- Updated docs and playbooks to reference `context/TGCAGENT.md`:
  - `README.md`
  - `ROADMAP.md`
  - `tools/community-feedback-triage.md`
  - `tools/tgc-gap-closure-plan.md`
  - `contrib/feedback/README.md`

## README Alignment
- Agent install now recommends include-by-reference to `context/TGCAGENT.md` rather than overwriting project `AGENTS.md`.
- Skills install now recommends Codex built-in installer flow (`codex skills install ...`).
- Claude guidance kept compatible with the same skill and include-by-reference pattern.

## Verification
- Searched repository for active docs/playbooks referencing canonical `context/AGENTS.md` and migrated them.
- No runtime/server code changes in this session.
