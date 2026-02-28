# Session: Agent Maintenance Policy Restored

Date: 2026-02-23

## Request
Ensure the AGENT separation did not lose critical guidance and explicitly restore proactive update direction for public agent/skill artifacts.

## Actions
- Reviewed root `AGENTS.md`, `context/TGCAGENT.md`, and `skills/tgc-guided-workflows/SKILL.md`.
- Confirmed key end-user behavior and component guidance remains in `context/TGCAGENT.md` and `skills/tgc-guided-workflows/SKILL.md`.
- Updated root `AGENTS.md` to explicitly require proactive updates to:
  - `context/TGCAGENT.md`
  - `skills/tgc-guided-workflows/SKILL.md`
  when new TGC component constraints/options/guardrails are discovered.
- Updated `context/TGCAGENT.md` documentation section to require synchronized updates with skill docs when guidance changes.

## Result
- Local build agent remains separated from public interaction profile.
- Proactive maintenance requirement for public AGENT + skill is now explicit again.
