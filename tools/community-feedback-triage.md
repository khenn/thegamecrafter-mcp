# Community Feedback Triage Playbook

## Purpose
Convert field feedback from GitHub Issues into reliable improvements for:
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/`
- `README.md` (if onboarding/usage changes)

## Intake Sources
- Primary: issues labeled `agent-feedback`
- Fallback: `contrib/feedback/*-pending.md`

## Triage Steps
1. Validate signal quality:
- reproducible,
- behavior-level (not just preference),
- includes expected vs observed.
2. Classify:
- `component`, `workflow`, `preflight`, `docs`, `api-contract`.
3. Decide action:
- `accept` (implement now),
- `defer` (needs more evidence),
- `reject` (out of scope/not actionable).
4. If accepted:
- update public behavior docs (`context/AGENTS.md`),
- update skill router/reference files,
- add/adjust tests or verification scripts when feasible,
- close issue with commit reference and outcome summary.

## Acceptance Heuristics
- Repeated user friction avoided by deterministic agent behavior.
- Preventable failures that can be caught in preflight.
- Proven fixes that generalize across sessions.

## Rejection Heuristics
- Single-user stylistic preference with no safety/quality impact.
- Missing reproducibility or unclear expected behavior.

## Release Hygiene
- Batch related feedback into small test-gated increments.
- Keep issue labels current (`accepted`, `deferred`, `needs-info`, `closed-fixed`).
