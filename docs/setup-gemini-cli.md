# TGCMCP Setup for Gemini CLI

Use this guide when you want to use TGCMCP with Gemini CLI in one project end to end.

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

## 3. Configure Gemini CLI MCP

Add an MCP stdio server to your `settings.json`:

```json
{
  "mcpServers": {
    "thegamecrafter": {
      "command": "node",
      "args": ["/absolute/path/to/your-project/.tgcmcp/server/index.js"],
      "env": {
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

Copy the skill folders you want from `.tgcmcp/skills/` into Gemini CLI's expected skills location, then restart the client.

## 5. Optionally Configure the Agent Profile

Reference `.tgcmcp/TGCAGENT.md` from your `GEMINI.md` or the equivalent project instruction surface used by your Gemini CLI setup.

## 6. Verify End to End

Ask Gemini CLI:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```
