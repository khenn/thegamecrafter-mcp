# Community Feedback Intake

This folder is the fallback staging area for agent-learning feedback when automatic GitHub Issue publishing is unavailable.

## Preferred Path
- Preferred intake is GitHub Issues using:
  - `.github/ISSUE_TEMPLATE/agent-learning-feedback.yml`

## Fallback Path
- Write a pending note here with filename:
  - `<YYYY-MM-DD>-<short-topic>-pending.md`
- First line should be:
  - `PENDING ISSUE SUBMISSION`
- Include a ready-to-run `gh issue create` command in the note.

## Important
- Do not include secrets, passwords, tokens, or private credentials.
- Notes in this folder are not canonical behavior docs. Maintainers promote accepted learnings into:
  - `context/AGENTS.md`
  - `skills/tgc-guided-workflows/`
