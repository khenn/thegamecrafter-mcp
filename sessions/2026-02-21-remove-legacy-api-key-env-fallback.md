# Session Note - 2026-02-21 (Remove Legacy API Key Env Fallback)

## Change
- Removed legacy `TGC_API_KEY_ID` support.
- MCP now uses only `TGC_PUBLIC_API_KEY_ID` for environment-based key input.

## Why
- Project is in first-release phase with no installed user base.
- Keeping a single canonical variable avoids unnecessary logic and confusion.

## Verification
- `npm run typecheck` passed.
- `npm run build` passed.
