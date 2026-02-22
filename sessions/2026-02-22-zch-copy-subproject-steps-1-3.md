# Session: ZCH Copy Subproject (Steps 1-3)

## Date
- 2026-02-22

## Objective
- Execute approved subproject plan steps 1-3:
  - local-only workspace
  - target intent contract
  - TGC capability matrix

## Completed
- Created local-only workspace under gitignored path:
  - `subprojects/zch-copy-lab/`
- Added intent contract:
  - `subprojects/zch-copy-lab/INTENT-CONTRACT.md`
- Added capability matrix mapped to TGC docs and current MCP implementation state:
  - `subprojects/zch-copy-lab/CAPABILITY-MATRIX.md`
- Added ordered primitive tool backlog:
  - `subprojects/zch-copy-lab/PRIMITIVE-TOOL-BACKLOG.md`
- Added persistent progress tracker with checklist + strikethrough completion:
  - `subprojects/zch-copy-lab/STATUS.md`

## Key Findings
- TGC has native copy endpoint (`POST /api/game/{id}/copy`), which should be implemented and tested as baseline before deeper manual reconstruction.
- Reliable owned-game discovery should use designer-scoped listing (`/api/designer/{id}/games`).
- Full graph interrogation likely requires multiple relationship-aware reads; a single fetch may not capture everything needed.
