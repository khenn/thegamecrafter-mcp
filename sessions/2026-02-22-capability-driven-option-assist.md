# Session Log - 2026-02-22 - Capability-Driven Option Assist

## Summary
Updated agent and skill guidance to use capability-driven component option prompts instead of generic option prompts.

## Updated Files
- `AGENTS.md`
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/SKILL.md`

## Key Change
When asked to add a component, agent now surfaces only options supported by that component type/identity (dimensions, image slots, finish, quantity) and avoids prompting for unsupported fields.

## Added Skill Data
Added packaging capability snapshot for known tested identities, including:
- image slot mappings
- validated dimensions
- finish support caveats (gloss vs non-gloss families)
