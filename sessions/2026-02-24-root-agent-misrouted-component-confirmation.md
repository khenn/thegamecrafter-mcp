# 2026-02-24 - Root Agent Misrouted Component Confirmation Rule

## Summary
Added a root `AGENTS.md` safeguard to reduce accidental cross-session requests intended for `tgcagent`.

## Changes
- Updated `AGENTS.md` under `## Working Rules` with a new intent-check requirement.
- New behavior:
  - If a prompt appears to be end-user component design/build iteration on live TGC (art/layout tweaks, proofing fit, visual tuning), ask for confirmation first.
  - Use confirmation wording similar to:
    - "Are you sure you want me to help you with the design of this component? You might have intended this request for the tgcagent."
  - Do not mutate live TGC state until user confirms this session should proceed.

## Rationale
Prevents accidental execution of gameplay/component design tasks in the MCP-build session when those requests were likely meant for the separate `tgcagent` testing session.
