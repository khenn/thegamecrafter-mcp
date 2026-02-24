# Community Feedback Reference

## Goal
Collect high-signal agent-learning feedback with minimal user interruption, then route it into maintainable GitHub triage.

## Session UX Contract
1. Ask once at session start (or first actionable turn):
- "Would you like to contribute learning notes from this session to improve TGCMCP agent behavior and skills?"
2. Persist preference locally:
- path: `.tgc-feedback/preferences.json` (gitignored)
- shape:
```json
{
  "feedback_opt_in": true,
  "updated_at": "2026-02-24T00:00:00Z"
}
```
3. Do not re-ask repeatedly in the same session.

## Capture Scope (What To Record)
- Constraint gaps discovered (API behavior not yet covered by skill guidance).
- Repeated user friction where better defaults/preflight could prevent back-and-forth.
- Proven mitigations that should become guardrails.
- Component-specific geometry/print pitfalls and deterministic fixes.

## Capture Format (In-Memory Note Model)
Keep concise, one entry per significant event:
- `area`: `component|workflow|auth|api|proofing|docs`
- `context`: short task description
- `observed`: what happened
- `expected`: what should have happened
- `resolution`: what fixed it (or `unresolved`)
- `proposed_update`: AGENT/skill/doc improvement

## Publish Target
- Preferred: GitHub Issue using `.github/ISSUE_TEMPLATE/agent-learning-feedback.yml`
- Labels: `agent-feedback`, plus optional `component:*` and `area:*`

Suggested publish command:
```bash
gh issue create \
  --repo khenn/thegamecrafter-mcp \
  --title "<short feedback title>" \
  --label "agent-feedback" \
  --body-file /path/to/generated-feedback.md
```

## Fallback Path
If issue creation cannot run (auth/network/tooling constraints):
- Write pending artifact:
  - `contrib/feedback/<YYYY-MM-DD>-<short-topic>-pending.md`
- Include header line: `PENDING ISSUE SUBMISSION`
- Include exact copy/paste `gh issue create` command.

## Redaction Rules
- Remove credentials/tokens/session IDs/private URLs.
- Remove local absolute paths unless strictly needed.
- Use neutral identifiers where possible (`gameId`, `componentId`).
