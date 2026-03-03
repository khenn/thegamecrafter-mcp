# Session: Fix bundle implemented from live prompt failures (5/7/8/9)

## Scope
Implemented skill-layer guardrails and routing-test coverage for failures observed in live tgcagent runs:
- duplicate game creation risk,
- missing required box art slot handling,
- board fit under-utilization,
- booklet page overspill risk,
- dual dial semantic alignment failures.

## Implemented updates

### Cross-skill fit contract
- Added shared fit contract references:
  - `skills/tgc-image-preflight-fit/references/shared-fit-contract.md`
  - `skills/tgc-book-rulebook-workflows/references/shared-fit-contract.md`
  - `skills/tgc-component-preflight/references/shared-fit-contract.md`
- Standardized fit outputs and pass/fail/needs-confirmation behavior.

### Component hard gates + readback
- Updated `skills/tgc-component-preflight/SKILL.md`
- Updated `skills/tgc-component-preflight/references/workflows.md`
- Added required-art create gate and post-mutation slot readback assertion requirements.

### Image/dial fit quality gates
- Updated `skills/tgc-image-preflight-fit/SKILL.md`
- Updated `skills/tgc-image-preflight-fit/references/workflows.md`
- Updated `skills/tgc-image-preflight-fit/references/image-preflight-and-fit.md`
- Added board utilization threshold guidance and dial semantic alignment requirements.

### Book workflow fit integration
- Updated `skills/tgc-book-rulebook-workflows/SKILL.md`
- Added/used shared fit contract for per-page checks before upload.

### Router orchestration guardrails
- Updated `skills/tgc-guided-workflows/references/workflows.md`
  - duplicate-name game create guard,
  - end-to-end build acceptance gate (partial success with remediation on failures).
- Updated `skills/tgc-guided-workflows/references/guardrails.md`
  - readback mismatch = failure,
  - board utilization and dial alignment guardrails.

### Regression routing coverage
- Expanded routing/trigger fixtures:
  - `tests/skills/prompts/trigger-matrix.json`
  - 12 routing cases total.

## Validation
- `npm --prefix code run skills:test` -> pass
  - validate: pass
  - triggers/routing: pass (4 fixtures, 12 routing cases)
  - validator fixture tests: pass

## Next
- Run live retest prompts in tgcagent (especially 5/7/8/9 equivalents) and verify proof outcomes.
- If live parity holds, close roadmap item B.5.
