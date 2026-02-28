# Session: Feedback Flow + Local Preferences Ownership

Date: 2026-02-28

## Goal
1. Switch feedback prompting from startup-gate to event-driven issue drafting.
2. Keep user preference values in local agent files so TGCMCP pulls do not overwrite settings.
3. Keep `context/TGCAGENT.md` orchestration-level and non-procedural.

## Changes
- Updated `context/TGCAGENT.md`:
  - replaced embedded preference values with a local-preference contract,
  - clarified that users should set preferences in local `AGENTS.md`/`Claude.md`,
  - added explicit link to event-driven feedback flow in skill references.
- Updated `skills/tgc-guided-workflows/SKILL.md`:
  - removed startup feedback gate language,
  - added trigger-based automatic issue-draft behavior with explicit publication approval,
  - retained `feedback_contribution` preference as a global toggle.
- Rewrote `skills/tgc-guided-workflows/references/community-feedback.md`:
  - event-driven trigger conditions,
  - automatic drafting + user approval gate,
  - disable disclaimer guidance,
  - strict exclusion/redaction rules retained.
- Updated `skills/tgc-guided-workflows/references/workflows.md` community-feedback section to match new model.
- Updated README agent/feedback sections to:
  - recommend local preference ownership,
  - document event-driven feedback behavior,
  - document disable path via local preference toggle.

## Notes
- No MCP runtime tool contract or API execution logic changed.
- This was behavior-guidance and documentation alignment only.
