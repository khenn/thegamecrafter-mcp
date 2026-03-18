# 2026-03-13 - A5 Claude Micro-Test and Regression Plan Lock-In

## Objective
Begin the A5 closeout phase after family guidance backfill by:
- locking the Claude regression/minimal-context plan into the roadmap,
- running a small downstream Claude smoke test before building automation,
- using the smoke-test findings to shape the future regression harness.

## Scope classification
- Global: A5 parity-validation and regression strategy for downstream Claude installs

## Changes

### Roadmap update
- Updated `ROADMAP.md`
  - expanded A5 Phase 4 to include:
    - manual Claude smoke test before automation,
    - automated Claude regression harness,
    - structured response blocks,
    - non-interactive/no-approval gate,
    - token-telemetry collection and later thresholding

### New planning artifact
- Added `tools/claude-a5-regression-plan.md`
  - captures the downstream Claude validation strategy
  - documents telemetry fields available from the Claude CLI JSON envelope
  - defines suite layers:
    - smoke
    - routing/minimal-context
    - family workflows
    - live sandbox workflows

## Claude micro-tests run

### Micro-test 1: read-only downstream guidance
- Command mode: `claude -p --output-format json`
- Prompt shape:
  - downstream TGC agent behavior
  - read-only question
  - structured JSON response requested
- Result:
  - Claude responded successfully
  - no approval required
  - CLI envelope included runtime token/cost telemetry

Observed useful CLI envelope fields:
- `duration_ms`
- `usage.input_tokens`
- `usage.output_tokens`
- `usage.cache_read_input_tokens`
- `usage.cache_creation_input_tokens`
- `total_cost_usd`
- `permission_denials`

### Micro-test 2: MCP account-context probe without forced login
- Result:
  - Claude used MCP read tools successfully
  - no approval required
  - response returned `NOT_AUTHENTICATED` because the prompt did not explicitly tell Claude to log in first

### Micro-test 3: MCP account-context probe with explicit login permission
- Result:
  - Claude authenticated successfully via `tgc_auth_login`
  - Claude then called `tgc_designer_list`
  - no approval required
  - `needs_user_input=false`
  - account context was available and returned a designer count

## Findings
- Downstream Claude is configured well enough to start automation work.
- The regression harness should not assume an active session already exists.
- For live MCP prompts, the suite should explicitly allow or require login when needed.
- Runtime telemetry should be parsed from the CLI result envelope rather than relying on Claude self-report.

## Next
- Create the Claude prompt pack and results template.
- Implement the first regression runner around Claude CLI `-p --output-format json`.
