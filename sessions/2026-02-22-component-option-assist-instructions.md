# Session Log - 2026-02-22 - Component Option Assist Instruction Update

## Summary
Updated agent and skill instructions so component build requests proactively surface configurable options before mutation.

## Updated Files
- `AGENTS.md`
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/SKILL.md`

## Behavior Added
For component-create prompts where options are not specified, agent should first present:
- expected image dimensions
- available finish/surface choices and default behavior when known
- quantity default and override

Then gather missing selections in one concise prompt and execute.
If optional values remain unspecified, proceed with defaults and report what defaults were applied.

## Additional Skill Note
Added tested finish behavior caveat:
- Linen finish persisted for `boxtopgloss` and `twosidedboxgloss`.
- Linen finish did not persist for tested `tuckbox`, `hookbox`, `twosidedbox`, `boxtop` update flow.
