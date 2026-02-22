# Session: Guided Agent Behavior + Skill Roadmap Item

## Date
- 2026-02-22

## Objective
- Make local Codex behavior more guided/collaborative for TGC game creation.
- Add roadmap note for publishing reusable Game Crafter skill.

## Changes Made
- Updated `AGENTS.md` with guided workflow defaults:
  - Ask only for missing required inputs.
  - For `tgc_game_create`, ask for game name and auto-resolve `designerId` via `tgc_designer_list`.
  - Return created game ID and suggest immediate next steps.
- Updated `ROADMAP.md`:
  - Added Milestone 8 item to package/publish a reusable Codex skill for Game Crafter workflows.

## Notes
- User requested local/private behavior tuning first; publication can happen later.
