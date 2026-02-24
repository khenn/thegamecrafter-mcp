# 2026-02-24 - Community Feedback Loop Setup

## Goal
Enable opt-in, low-friction user feedback so TGCMCP agent/skill behavior can improve from real-world sessions without granting direct write access to canonical docs.

## Implemented
- Added GitHub Issue intake template:
  - `.github/ISSUE_TEMPLATE/agent-learning-feedback.yml`
  - `.github/ISSUE_TEMPLATE/config.yml`
- Added fallback staging area guidance:
  - `contrib/feedback/README.md`
- Added maintainer triage playbook:
  - `tools/community-feedback-triage.md`
- Updated public behavior profile:
  - `context/AGENTS.md` with one-time opt-in flow, local preference persistence, and issue/fallback publishing rules.
- Updated skill docs:
  - `skills/tgc-guided-workflows/SKILL.md`
  - `skills/tgc-guided-workflows/references/workflows.md`
  - `skills/tgc-guided-workflows/references/guardrails.md`
  - `skills/tgc-guided-workflows/references/community-feedback.md` (new)
- Updated repo structure doc:
  - `context/STRUCTURE.md` to include `.github/` and `contrib/`
- Updated onboarding doc:
  - `README.md` with optional feedback contribution section.
- Updated `.gitignore`:
  - ignore local opt-in storage at `.tgc-feedback/`.

## Outcome
Contributors can opt in once per session and submit structured, reproducible learning feedback through GitHub Issues while maintainers retain full control over canonical sources.
