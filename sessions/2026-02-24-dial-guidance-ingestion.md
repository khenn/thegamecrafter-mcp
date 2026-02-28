# 2026-02-24 - Dial Guidance Ingestion (tgcagent feedback)

## Source
- `logs/agent-dial-artwork-guidance.md`

## What Was Updated
- `context/TGCAGENT.md`
  - Added dial-specific preflight/layout expectations.
  - Added `DualDial` reference and validated size/slot notes.
- `skills/tgc-guided-workflows/SKILL.md`
  - Added dial auto-layout behavior (focus on visual intent, not XY micro-positioning).
- `skills/tgc-guided-workflows/references/component-profiles.md`
  - Added detailed `DualDial` profile and practical placement constraints.
- `skills/tgc-guided-workflows/references/image-preflight-and-fit.md`
  - Added deterministic dial-geometry preflight checklist.
- `skills/tgc-guided-workflows/references/workflows.md`
  - Added dial artwork workflow section for guided, low-friction UX.
- `skills/tgc-guided-workflows/references/guardrails.md`
  - Reinforced revision behavior: in-place updates by default when supported.

## Outcome
TGC agents are now instructed to treat dial positioning as an internal geometry problem and to ask users primarily about design intent/content rather than placement details.
