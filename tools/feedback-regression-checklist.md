# Feedback Regression Checklist

Use this checklist whenever accepted feedback is being turned into a TGCMCP change.

This checklist is intentionally global-process oriented. It is not tied to any single issue or component.

## 1. Scope Classification (Required)

Before proposing a fix, classify the feedback at the highest justified scope:

- `component-specific`
  - one concrete identity or one isolated behavior
- `component-family specific`
  - shared API family, slot model, relationship model, or workflow family
- `global`
  - cross-family contract, router, safety, docs, or agent behavior

Required output for triage notes / PR summary:
- `scope_classification`
- `why_this_scope`
- `why_not_broader`

Rule:
- prefer the highest scope that safely generalizes
- do not hide a family/global pattern inside a one-off patch

## 2. Acceptance Snapshot

For each accepted feedback item, record:

- `source`
  - issue URL or pending feedback artifact path
- `observed_behavior`
- `expected_behavior`
- `deterministic_mitigation`
- `scope_classification`
- `release_target`
  - `current_release`
  - `post_release`
  - `defer`

If the item is deferred, record:
- `defer_reason`
- `revisit_trigger`

## 3. Immediate Fix Plan

Describe the smallest safe change that resolves the accepted behavior:

- contract change needed?
- handler/service/runtime change needed?
- skill/reference change needed?
- agent profile change needed?
- README/onboarding change needed?

Required output:
- `immediate_fix`
- `affected_surfaces`

## 4. Regression Test Strategy

For each accepted item, state how the regression will be prevented from returning:

- `offline unit/handler test`
- `client/runtime reliability test`
- `skills:test` / routing fixture update
- `live smoke verification`
- `documentation-only verification`

Required output:
- `regression_strategy`
- `why_this_gate_is_sufficient`

Rule:
- if a bug can be covered by a deterministic offline test, do that first
- reserve live verification for cases that genuinely depend on TGC runtime behavior

## 5. Required Artifact Updates

For each accepted item, explicitly answer whether these need updates:

- `context/TGCAGENT.md`
- relevant `skills/*/SKILL.md`
- relevant `skills/*/references/*`
- `tools/tgc-mcp-tool-contract-v1.md`
- `README.md`
- `ROADMAP.md`
- `CHANGELOG.md`

Required output:
- `artifact_updates_required`
- `artifact_updates_completed`

## 6. Safety / Privacy Review

Confirm the change does not weaken:

- secret handling
- privacy / IP boundaries
- explicit approval rules
- cleanup expectations for live disposable artifacts
- proofing / preflight guardrails

Required output:
- `safety_review`
- `new_risks`
- `mitigations`

## 7. Sequencing Impact

State whether the accepted feedback changes roadmap order:

- `no sequencing change`
- `pull forward`
- `push back`
- `split into follow-up`

Required output:
- `roadmap_sequencing_decision`
- `why`

## 8. Closure Evidence

Do not close the loop until all applicable evidence exists:

- fix landed
- tests/verification passed
- docs/skills/agent updates landed if required
- issue or pending feedback artifact updated with outcome

Required output:
- `closure_evidence`

## 9. Post-Release Validation Gate

For the Goal B3 gate "at least one full feedback cycle validated from issue to merged guidance update":

- choose one accepted feedback item after release
- run this full checklist
- link:
  - source issue
  - merged commit(s)
  - verification evidence
  - artifact updates
- record the outcome in `sessions/`

Until that happens:
- treat the checklist as implemented
- treat the full-cycle validation gate as still open
