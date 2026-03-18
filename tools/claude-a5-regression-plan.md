# Claude A5 Regression Plan

Date: 2026-03-13
Status: Baseline established, local normal-flow gate wired, thresholds pending

## Goal
Close the remaining A5 work by validating the installed downstream Claude `tgcagent` behavior as a real user would experience it:
- correct agent/skill behavior,
- minimal-context loading,
- no human-in-the-loop approval requirement for normal supported prompts,
- reusable automated regression coverage for future skill changes.

## Scope
- Use the downstream Claude project install, not the repo-builder context.
- Treat Claude as if the user downloaded TGCMCP from GitHub and followed the README.
- Validate both read-only/routing behavior and live sandbox workflow behavior.
- Keep this suite opt-in/manual for now; do not fold downstream-LLM parity into the general MCP build/test path.

## Ground rules
- Start a fresh Claude session per regression prompt to prevent context bleed.
- Require a compact structured response block for every test prompt.
- Prefer Claude CLI runtime telemetry over Claude self-reported token usage.
- Keep live workflow tests sandboxed, disposable, and low-volume.
- Before downstream Claude regression, sync the current repo `skills/` folders into Claude's installed skills directory and restart Claude Code if needed.
  - Claude evaluates the installed copies from its skills directory, not the repo working tree.
- Treat usable Claude CLI API auth as a separate prerequisite from `claude auth status`; a locally cached login can still fail at runtime if the underlying OAuth token has expired.
- Live suites must sweep disposable sandbox games both before and after the run so timed-out or interrupted cases do not leave active leftovers behind.
- Treat TGC game deletion as soft-delete/trash semantics for regression purposes:
  - the unattended gate is "no active disposable games remain"
  - trashed entries may still remain visible in TGC for a while after deletion

## Micro-test findings that shape the harness
- Claude CLI works in non-interactive `-p` mode from this project.
- Claude can answer without approval for normal read-only prompts.
- Claude can use the configured TGC MCP without approval when the prompt explicitly permits login/use.
- Claude CLI JSON result envelopes expose usable telemetry:
  - `duration_ms`
  - `usage.input_tokens`
  - `usage.output_tokens`
  - `usage.cache_read_input_tokens`
  - `usage.cache_creation_input_tokens`
  - `total_cost_usd`
  - `permission_denials`
- Claude self-report fields such as `references_loaded` and `token_usage_visible` are useful but not authoritative.

## Regression suite layers

### 1. Non-interactive smoke gate
Purpose:
- verify Claude can respond without approval or manual intervention before running the full suite

Assertions:
- command exits successfully
- `permission_denials` is empty
- response does not ask for approval
- structured block reports `approval_required=false`
- response returns useful initial guidance without requiring approval
- runtime telemetry is present in the CLI envelope

### 2. Routing and minimal-context suite
Purpose:
- verify the correct skill family is selected with the least necessary context

Coverage:
- one or more read-only prompts per family:
  - packaging
  - cards/decks
  - boards/mats/screens
  - custom-cut
  - books/rulebooks/folios/score pads
  - parts/dice/meeples/play money
- router/orchestration prompts spanning multiple families

Assertions:
- expected `primary_skill`
- acceptable `secondary_skills`
- no unrelated family references loaded
- no mutation requested
- no approval required

### 3. Family workflow suite
Purpose:
- verify each focused family produces the expected guardrails and next-step behavior

Coverage examples:
- packaging slot completeness
- deck/shared-back guidance
- board/mat fold or 3D-viewer proofing
- custom-cut geometry checks
- book parity/orientation checks
- parts/dice side-completeness/orientation checks

Assertions:
- asks only for missing required inputs
- emits family-appropriate blockers/warnings
- does not leak repo-builder knowledge

### 4. Sandbox live workflow suite
Purpose:
- collect `Level 4` parity evidence for A5

Coverage:
- one disposable live workflow per major family
- create/update/readback flow
- cleanup or deterministic disposable naming

Assertions:
- expected tool path completes
- readback matches the intended change
- no unsafe mutation occurs without confirmation
- pre-run sweep removes any active disposable leftovers from prior runs
- post-run sweep verifies zero active disposable leftovers remain

## Structured response block
Each Claude regression prompt should request a compact machine-readable block with:
- `primary_skill`
- `secondary_skills`
- `references_loaded`
- `needs_user_input`
- `approval_required`
- `requested_mutation`
- `notes`

Important:
- treat this as Claude-reported context, not the sole source of truth
- runtime telemetry comes from the CLI envelope

## Telemetry collection
Per test capture:
- raw prompt
- raw Claude result envelope
- parsed structured block
- `duration_ms`
- `input_tokens`
- `output_tokens`
- `cache_read_input_tokens`
- `cache_creation_input_tokens`
- `total_cost_usd`
- `permission_denials`

## Token-efficiency plan
- Initial gate: collect telemetry, do not fail on hard token thresholds yet.
- First full Claude run establishes baseline token ranges by workflow family.
- After the baseline run:
  - set soft warning ranges by family
  - set hard regression thresholds only after observing stable patterns
- Current implementation choice:
  - warning-only token thresholds are enabled
  - warnings should not fail the suite
  - downstream LLM parity remains a deliberate/manual run, not a default MCP build gate

## Pass/fail model
Fail a test if any of these are true:
- Claude asks for approval on a normal supported prompt
- Claude requires human intervention for the expected happy path
- wrong primary skill/family behavior
- unrelated family context is loaded without justification
- mutation happens when the prompt should be read-only
- runtime telemetry disappears unexpectedly

## Proposed repo artifacts
- `tools/claude-a5-prompt-pack.md`
- `tools/claude-a5-results-template.md`
- `code/scripts/dev/run-claude-regression.ts`
- `tests/claude/fixtures/*.json`
- `sessions/YYYY-MM-DD-*.md` closure evidence

## Proposed implementation order
1. Create prompt pack and results template.
2. Implement a small Claude CLI runner that:
   - starts fresh sessions,
   - runs prompts,
   - captures JSON envelopes,
   - parses structured blocks,
   - reports pass/fail.
3. Add the non-interactive smoke gate.
4. Add routing/minimal-context fixtures.
5. Run the suite manually once and adjust prompts/fixtures.
6. Add sandbox live workflow fixtures.
7. Record closure evidence in `sessions/`.

## A5 closeout target
A5 is complete when:
- family baseline coverage remains `201/201`,
- Claude smoke gate passes,
- routing/minimal-context suite passes,
- representative live sandbox parity runs pass,
- failure triage patches are landed and protected by regression fixtures.
