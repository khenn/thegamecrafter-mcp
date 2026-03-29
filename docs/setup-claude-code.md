# TGCMCP Setup for Claude Code

Use this guide when you want to use TGCMCP with Claude Code in one project end to end.

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

## 3. Configure Claude Code MCP

Add an MCP stdio server in your Claude client/runtime config for that project:
- name: `thegamecrafter`
- command: `node`
- args: `["/absolute/path/to/your-project/.tgcmcp/server/index.js"]`
- env: include `TGC_API_BASE_URL`, `TGC_PUBLIC_API_KEY_ID`, `TGC_USERNAME`, `TGC_PASSWORD`

Example config shape:

```json
{
  "mcpServers": {
    "thegamecrafter": {
      "command": "node",
      "args": ["/absolute/path/to/your-project/.tgcmcp/server/index.js"],
      "env": {
        "TGC_API_BASE_URL": "${TGC_API_BASE_URL}",
        "TGC_PUBLIC_API_KEY_ID": "${TGC_PUBLIC_API_KEY_ID}",
        "TGC_USERNAME": "${TGC_USERNAME}",
        "TGC_PASSWORD": "${TGC_PASSWORD}"
      }
    }
  }
}
```

Restart Claude Code after updating the config.

## 4. Install Skills

Copy the skill folders you want from `.tgcmcp/skills/` into Claude Code's expected skills location, then restart Claude Code.

Recommended set:
- `tgc-guided-workflows`
- `tgc-packaging-workflows`
- `tgc-card-deck-workflows`
- `tgc-board-mat-workflows`
- `tgc-custom-cut-workflows`
- `tgc-parts-dice-workflows`
- `tgc-component-preflight`
- `tgc-book-rulebook-workflows`
- `tgc-image-preflight-fit`

## 5. Optionally Configure the Agent Profile

In your project's `Claude.md`, add:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/your-project/.tgcmcp/TGCAGENT.md
```

## 6. Verify End to End

Ask Claude Code:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```
