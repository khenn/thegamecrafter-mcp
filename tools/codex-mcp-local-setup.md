# Codex MCP Local Setup

## Goal
Configure Codex CLI to run this project's TGC MCP server locally.

## Prerequisites
- Node 20+ installed.
- Codex CLI `>=0.104.0`.
- Project built at least once:
  - `cd code && npm install && npm run build`
- TGC environment variables exported in your shell:
  - `TGC_API_BASE_URL`
  - `TGC_PUBLIC_API_KEY_ID`
  - `TGC_USERNAME`
  - `TGC_PASSWORD`

## One-Time Setup
From your target project root (where you want Codex to use this MCP server), not from this repository root:

```bash
codex mcp add thegamecrafter \
  --env TGC_API_BASE_URL="$TGC_API_BASE_URL" \
  --env TGC_PUBLIC_API_KEY_ID="$TGC_PUBLIC_API_KEY_ID" \
  --env TGC_USERNAME="$TGC_USERNAME" \
  --env TGC_PASSWORD="$TGC_PASSWORD" \
  -- node /absolute/path/to/thegamecrafter-mcp/code/dist/index.js
```

This registers a Codex MCP server named `thegamecrafter`.

## Verify
```bash
codex mcp list
codex mcp get thegamecrafter
```

## Notes
- This setup reads credentials from your shell environment at runtime.
- Depending on Codex/client behavior, resolved `--env` values may still be persisted in local config.
- Treat local client config as sensitive and avoid storing plaintext secrets when possible.
