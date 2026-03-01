# TGCMCP Skill Review Checklist

Use this checklist before merging any skill change.

## Scope and Intent
- [ ] Skill does one workflow job.
- [ ] Trigger language is explicit and non-overlapping with unrelated skills.
- [ ] Inputs and outputs are defined and testable.

## Structure
- [ ] `SKILL.md` exists and is concise.
- [ ] `references/` exists and contains only relevant detail.
- [ ] `agents/openai.yaml` exists and matches skill purpose.

## Context Efficiency
- [ ] `SKILL.md` does not contain bulk reference content.
- [ ] References are split by workflow/family (not one catch-all file).
- [ ] Instructions direct selective loading of references.

## Safety and Privacy
- [ ] No instruction requires exposing secrets.
- [ ] No reusable content includes user PII/IP/local environment specifics.
- [ ] Feedback/publication guidance requires explicit user approval of outgoing text.

## Determinism and Scripts
- [ ] Scripts are only used where deterministic behavior is needed.
- [ ] Script inputs/outputs/failures are documented.

## Tests and Validation
- [ ] `npm run skills:validate` passes.
- [ ] `npm run skills:test-triggers` passes.
- [ ] Trigger fixture contains positive and negative cases.

## Documentation and Traceability
- [ ] Relevant `sessions/YYYY-MM-DD-*.md` note added/updated.
- [ ] If user-facing behavior changed, related docs updated.

## Scope Classification (Feedback Changes)
- [ ] Change classified as component-specific, family-specific, or global.
- [ ] Highest safe scope applied (avoid narrow fix if global/family fix is justified).
