# TGCMCP Skill Authoring Policy

This policy defines how skills are created and maintained in this repository.

## Purpose
- Keep skills consistent, small, and composable.
- Ensure only the minimum context is loaded for each workflow.
- Protect user privacy, IP, and local secrets by default.

## Required Authoring Workflow
1. Draft or update the skill using Codex built-in `skill-creator`.
2. Apply this policy and `docs/skills/SKILL_REVIEW_CHECKLIST.md` before commit.
3. Run repository skill validators and trigger tests.
4. Record outcome in a `sessions/` note.

## Skill Scope Rules
- One skill = one workflow family.
- Do not create one skill per component by default.
- Create a new skill only when at least one applies:
  - Distinct trigger vocabulary.
  - Distinct dependency/tooling profile.
  - Distinct safety posture.
- Keep orchestration skills thin and route to focused skills/references.

## SKILL.md Rules
- Keep `SKILL.md` concise and trigger-oriented.
- Include clear:
  - Purpose and when to use.
  - Trigger phrases/signals.
  - Inputs required.
  - Outputs produced.
  - Safety/privacy constraints.
- Avoid embedding large procedural details in `SKILL.md`.

## References Rules
- Place detailed content in `references/`.
- Use workflow- or family-scoped files (avoid monoliths).
- Prefer index files that route to specific references.
- Load only needed reference files at runtime.
- Keep files fact-dense and operational.

## Scripts Rules
- Prefer instruction-only skills unless deterministic tooling is needed.
- Use scripts for deterministic transforms/checks only.
- Document script input/output and failure modes.

## Agent Metadata Rules
- Include `agents/openai.yaml` for project skills.
- Keep metadata aligned with skill purpose and constraints.

## Privacy, Security, and IP Rules
- Never require exposing user secrets in skill instructions.
- Never include user-local paths, environment values, proprietary content, or PII in reusable references.
- Ensure contribution/feedback flows require user review and approval before publication.

## Naming and Structure
- Skill directory name: `skills/<workflow-name>/`.
- Required files:
  - `SKILL.md`
  - `references/` (at least one file)
  - `agents/openai.yaml`

## Validation Gate (Required)
A skill change is not complete until all pass:
- `npm run skills:validate`
- `npm run skills:test-triggers`
- Checklist completed in PR/session notes.

## Migration Rule
When refactoring skill architecture:
- Preserve behavior parity first.
- Then reduce context size and tighten triggers.
- Document split/merge rationale in `sessions/`.
