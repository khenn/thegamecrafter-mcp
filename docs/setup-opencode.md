# TGCMCP Setup for OpenCode

Use this guide when you want to use TGCMCP with OpenCode in one project end to end.

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

## 3. Configure OpenCode MCP

Add a local MCP entry to your project `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "thegamecrafter": {
      "type": "local",
      "command": ["node", "./.tgcmcp/server/index.js"],
      "enabled": true,
      "environment": {
        "TGC_API_BASE_URL": "$TGC_API_BASE_URL",
        "TGC_PUBLIC_API_KEY_ID": "$TGC_PUBLIC_API_KEY_ID",
        "TGC_USERNAME": "$TGC_USERNAME",
        "TGC_PASSWORD": "$TGC_PASSWORD"
      }
    }
  }
}
```

## 4. Install Skills

Copy the skill folders you want from `.tgcmcp/skills/` into OpenCode's expected skills location, then restart the client.

## 5. Optionally Configure the Agent Profile

Reference `.tgcmcp/TGCAGENT.md` from the project instruction file or equivalent configuration surface used by your OpenCode setup.

## 6. Verify End to End

Ask OpenCode:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```
