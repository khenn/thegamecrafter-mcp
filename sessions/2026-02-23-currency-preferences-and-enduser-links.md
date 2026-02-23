# Session: Currency Preference + End-User Link Rules

Date: 2026-02-23

## User Request
- Add global configurable preferences block with `currency` defaulting to `USD`.
- Always show currency code in money outputs.
- Convert from USD when preference is non-USD; fallback to USD with warning on invalid/unavailable FX.
- For end users, prioritize product/help/video links over API links.
- Include YouTube links when possible; otherwise indicate video content and provide IDs/titles.

## Files Updated
- `AGENTS.md`
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/SKILL.md`

## Implemented Behavior
- Added `preferences.currency` as global variable in both AGENT and skill docs.
- Added conversion/fallback rules for monetary outputs.
- Added end-user link policy:
  - default to product/help/video links,
  - include API URLs only when user asks for technical details.
- Added video-link handling guidance with fallback when titles are unavailable.
- Normalized component pricing examples in skill docs to include explicit `USD` units.
