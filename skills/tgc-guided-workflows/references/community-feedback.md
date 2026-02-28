# Community Feedback Reference

## Goal
Capture only high-value, reusable learnings and turn them into maintainable GitHub issues that improve future TGCMCP skill releases.

## Trigger (Event-Driven, Not Startup-Driven)
Run this flow when all conditions are true:
1. The agent learned something **non-trivial** about building/proofing a TGC component.
2. The learning is **not already captured** in current skills/references.
3. The learning is likely to improve future build accuracy or reduce avoidable retries.
4. Local preference `preferences.feedback_contribution` is not explicitly `false`.

If any condition fails, do not draft or propose publication.

## User Prompt Contract
When triggered, draft issue content automatically, then show it to the user before publishing.

Required explanation to user:
- state that you found a reusable learning that could improve future TGCMCP skills,
- state that you would like to create a GitHub issue in `khenn/thegamecrafter-mcp`,
- include the exact draft title/body text,
- include a short disclaimer:
  - "You can disable this behavior by setting `preferences.feedback_contribution: false` in your local `AGENTS.md` or `Claude.md`."

Then ask for explicit permission to publish that exact text now.

## Capture Scope (What To Record)
- Component constraints/geometry/proofing behavior that caused or prevented failure.
- Deterministic fixes that should become guardrails/defaults.
- API or UI behavior that materially changes safe sequencing.

## Hard Exclusions (Never Publish)
- User-specific game/IP details (names, story/rules content, proprietary art/content).
- Local environment/system details (absolute paths, hostnames, workspace naming).
- Secrets/sensitive identifiers (passwords, keys, tokens, session IDs, emails/usernames, private URLs, PII).

If context is needed, anonymize and generalize.

## Draft Format
Keep issue drafts concise and reusable:
- `area`: `component|workflow|api|proofing|docs`
- `component/family`: specific TGC component identity or family
- `observed_behavior`
- `expected_behavior`
- `deterministic_mitigation`
- `proposed_skill_or_agent_update`

## Publish Target
- Preferred: GitHub Issue using `.github/ISSUE_TEMPLATE/agent-learning-feedback.yml`
- Labels: `agent-feedback` plus optional scoped labels.

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
- Include header: `PENDING ISSUE SUBMISSION`
- Include exact copy/paste `gh issue create` command.

## Publication Approval Gate (Required)
- Drafting is automatic when trigger conditions are met.
- Publication is never automatic.
- Publish only after explicit user approval of the exact draft text.
