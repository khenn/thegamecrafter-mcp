# TGCMCP Setup for Codex

Use this guide when you want to use TGCMCP with Codex in one project end to end.

## 1. Install TGCMCP

From your project root:

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

This installs TGCMCP into `.tgcmcp/` in your project.

## 2. Set Required Environment Variables

Required variables:
- `TGC_API_BASE_URL`
- `TGC_PUBLIC_API_KEY_ID`
- `TGC_USERNAME`
- `TGC_PASSWORD`

Unix-like (bash/zsh):

```bash
export TGC_API_BASE_URL="https://www.thegamecrafter.com"
export TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"
export TGC_USERNAME="<YOUR_TGC_USERNAME>"
export TGC_PASSWORD="<YOUR_TGC_PASSWORD>"
```

Windows (PowerShell):

```powershell
$env:TGC_API_BASE_URL="https://www.thegamecrafter.com"
$env:TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"
$env:TGC_USERNAME="<YOUR_TGC_USERNAME>"
$env:TGC_PASSWORD="<YOUR_TGC_PASSWORD>"
```

## 3. Configure Codex MCP

From the same project root:

```bash
codex mcp add thegamecrafter \
  --env TGC_API_BASE_URL="$TGC_API_BASE_URL" \
  --env TGC_PUBLIC_API_KEY_ID="$TGC_PUBLIC_API_KEY_ID" \
  --env TGC_USERNAME="$TGC_USERNAME" \
  --env TGC_PASSWORD="$TGC_PASSWORD" \
  -- node ./.tgcmcp/server/index.js
```

Verify:

```bash
codex mcp list
codex mcp get thegamecrafter
```

## 4. Install Skills

Run:

```bash
codex skills install ./.tgcmcp/skills/tgc-guided-workflows
codex skills install ./.tgcmcp/skills/tgc-packaging-workflows
codex skills install ./.tgcmcp/skills/tgc-card-deck-workflows
codex skills install ./.tgcmcp/skills/tgc-board-mat-workflows
codex skills install ./.tgcmcp/skills/tgc-custom-cut-workflows
codex skills install ./.tgcmcp/skills/tgc-parts-dice-workflows
codex skills install ./.tgcmcp/skills/tgc-component-preflight
codex skills install ./.tgcmcp/skills/tgc-book-rulebook-workflows
codex skills install ./.tgcmcp/skills/tgc-image-preflight-fit
```

Restart Codex after installing the skills.

## 5. Optionally Configure the Agent Profile

In your project's `AGENTS.md`, add:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/your-project/.tgcmcp/TGCAGENT.md
```

## 6. Verify End to End

Ask Codex:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```
