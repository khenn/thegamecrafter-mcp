# Contributing

Thanks for contributing to TGCMCP.

## Scope

This repository prioritizes:
- contract-first MCP changes
- safe autonomous usage
- test-gated improvements
- clear public docs and reproducible setup

## Good Contribution Targets

- MCP contract/schema improvements
- handler/service reliability fixes
- test coverage
- workflow/guardrail updates in skills and `context/TGCAGENT.md`
- onboarding/docs clarity improvements

## Before Opening A PR

Run the applicable checks:

- `npm --prefix code run typecheck`
- `npm --prefix code run build`
- `TMPDIR=/tmp npm --prefix code test`
- `TMPDIR=/tmp npm --prefix code run skills:test` when skills or skill references changed

If the change affects public behavior, also update the relevant docs:
- `context/TGCAGENT.md`
- affected `skills/*/SKILL.md`
- affected skill references
- `tools/tgc-mcp-tool-contract-v1.md`
- `README.md` when setup/onboarding/limitations changed

## PR Expectations

Keep PRs:
- focused
- explicit about scope
- backed by verification

Each PR should state:
- what changed
- why it changed
- what was verified
- any remaining risks or follow-up items

For feedback-driven changes, include:
- scope classification:
  - `component-specific`
  - `component-family specific`
  - `global`
- link to `tools/feedback-regression-checklist.md`

## Review And Merge Expectations

Before merge to `main`:
- relevant CI must be green
- local-only files must not be included
- docs/skills/tool-contract updates must be included when behavior changed
- security/privacy boundaries must remain intact

Prefer small merges over large batches.

## Reporting Bugs And Ideas

Use the GitHub issue templates for:
- bug reports
- feature requests
- agent learning feedback

For reusable field feedback, see:
- `tools/community-feedback-triage.md`
- `tools/feedback-regression-checklist.md`

## Security Reports

Do not file public issues with sensitive exploit details.

See:
- [SECURITY.md](SECURITY.md)
