# The Game Crafter MCP (TGCMCP)

MCP server for The Game Crafter (TGC) Developer API, plus a reusable public agent profile and a reusable skill.

- TGC Developer API: https://www.thegamecrafter.com/developer/
- Repository: https://github.com/khenn/thegamecrafter-mcp

This README is optimized for both:
- humans setting this up manually
- LLMs following step-by-step setup instructions

## What You Are Installing

1. `MCP` (required): the tool server that exposes TGC API operations.
2. `Skills` (recommended): workflow and guardrail instructions for TGC tasks.
3. `Agent` (recommended): public behavior profile for guided, safe game-building workflows.

## Prerequisites

- Linux/macOS/WSL (Windows works with path adjustments)
- Node.js `>=20` (tested on Node `24.x`)
- npm
- Git
- TGC account
- TGC API key pair (you must use the **public key ID**)

Optional for PDF workflows:
- `pdfinfo`
- `pdftoppm`

## 1) Build The MCP Server

1. Clone the repository.
2. Install dependencies.
3. Build the project.

```bash
git clone https://github.com/khenn/thegamecrafter-mcp.git
cd thegamecrafter-mcp/code
npm install
npm run build
```

Expected output artifact:
- `code/dist/index.js`

## 2) Configure Authentication Environment Variables

The MCP server reads TGC auth settings from environment variables.

Required variables:
- `TGC_API_BASE_URL` (normally `https://www.thegamecrafter.com`)
- `TGC_PUBLIC_API_KEY_ID` (your TGC public API key ID)
- `TGC_USERNAME`
- `TGC_PASSWORD`

### Temporary (current shell only)

```bash
export TGC_API_BASE_URL="https://www.thegamecrafter.com"
export TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"
export TGC_USERNAME="<YOUR_TGC_USERNAME>"
export TGC_PASSWORD="<YOUR_TGC_PASSWORD>"
```

### Persistent (new shells too, bash)

```bash
cat >> ~/.bashrc <<'ENVVARS'
export TGC_API_BASE_URL="https://www.thegamecrafter.com"
export TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"
export TGC_USERNAME="<YOUR_TGC_USERNAME>"
export TGC_PASSWORD="<YOUR_TGC_PASSWORD>"
ENVVARS

source ~/.bashrc
```

Security note:
- The `.bashrc` approach stores secrets in plaintext.
- For stronger security, inject these values at runtime from an OS secret manager.

## MCP

### MCP Description And Intended Use

This MCP server exposes TGC operations as callable tools for an LLM, including:
- authentication/session management
- game create/read/update/delete
- deck/card/component/file workflows
- pricing and packaging-related operations supported by the TGC API

Use it when you want an LLM to create or manage your own TGC games through auditable tool calls.

### MCP Install For Codex (Step-by-step)

1. Go to repository root:

```bash
cd /absolute/path/to/thegamecrafter-mcp
```

2. Ensure helper scripts are executable:

```bash
chmod +x code/scripts/dev/run-tgc-mcp.sh code/scripts/dev/configure-codex-mcp.sh
```

3. Register MCP server in Codex:

```bash
code/scripts/dev/configure-codex-mcp.sh thegamecrafter
```

4. Verify:

```bash
codex mcp list
codex mcp get thegamecrafter
```

### MCP Install For Claude (Step-by-step)

1. Identify the absolute server entry point path:
- `/absolute/path/to/thegamecrafter-mcp/code/dist/index.js`

2. Add an MCP stdio server in your Claude client/runtime config:
- name: `thegamecrafter`
- command: `node`
- args: `["/absolute/path/to/thegamecrafter-mcp/code/dist/index.js"]`
- env: include `TGC_API_BASE_URL`, `TGC_PUBLIC_API_KEY_ID`, `TGC_USERNAME`, `TGC_PASSWORD`

3. Example config shape (adapt to your Claude runtime format):

```json
{
  "mcpServers": {
    "thegamecrafter": {
      "command": "node",
      "args": ["/absolute/path/to/thegamecrafter-mcp/code/dist/index.js"],
      "env": {
        "TGC_API_BASE_URL": "https://www.thegamecrafter.com",
        "TGC_PUBLIC_API_KEY_ID": "<YOUR_TGC_PUBLIC_KEY_ID>",
        "TGC_USERNAME": "<YOUR_TGC_USERNAME>",
        "TGC_PASSWORD": "<YOUR_TGC_PASSWORD>"
      }
    }
  }
}
```

4. Restart Claude client/runtime so the MCP server is loaded.

## Skills

### Skills Description And Intended Use

`skills/tgc-guided-workflows/SKILL.md` provides reusable workflow logic, including:
- guided TGC intent handling
- component preflight checks
- print-safety guardrails
- known API pitfalls and safe sequencing patterns

Use this when you want your LLM to behave consistently during game-building tasks.

### Skills Install For Codex (Step-by-step)

1. Choose your working folder (example: `~/tgcagent`).
2. Create the Codex skills path.
3. Copy the skill file.

```bash
mkdir -p ~/tgcagent/skills/tgc-guided-workflows
cp /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows/SKILL.md \
  ~/tgcagent/skills/tgc-guided-workflows/SKILL.md
```

4. Start Codex in `~/tgcagent` so it can discover local skills.

### Skills Install For Claude (Step-by-step)

Claude runtimes do not universally support Codex-native `SKILL.md` loading. Use one of these standard approaches:

1. Project instruction method:
- copy `SKILL.md` content into your Claude project instructions.

2. File reference method:
- keep `SKILL.md` in your workspace and instruct Claude to apply it at session start.

Recommended minimal instruction for Claude:
- "Apply instructions from `skills/tgc-guided-workflows/SKILL.md` before responding."

## Agent

### Agent Description And Intended Use

`context/AGENTS.md` is the public behavior profile for TGC workflows. It defines:
- interaction style for guided game creation
- option/prefill behavior
- preflight and safety checks
- output conventions (for example, pricing and links)

Use it when you want predictable agent behavior across sessions and tools.

### Agent Install For Codex (Step-by-step)

1. Choose your working folder (example: `~/tgcagent`).
2. Copy the public agent profile to workspace root as `AGENTS.md`.

```bash
mkdir -p ~/tgcagent
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md ~/tgcagent/AGENTS.md
```

3. Start Codex in `~/tgcagent`.

### Agent Install For Claude (Step-by-step)

This repository does **not** include a `Claude.md` file directly.

To convert `AGENTS.md` to Claude format:

1. Copy and rename the public profile:

```bash
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md ~/tgcagent/Claude.md
```

2. Open `~/tgcagent/Claude.md`.
3. Remove or adjust any Codex-specific wording if your Claude runtime requires different phrasing.
4. Ensure your Claude runtime/project is configured to load `Claude.md`.

## 3) Verify End-To-End Setup

After your MCP client loads `thegamecrafter`:

1. Call `tgc_auth_login`.
2. Call `tgc_designer_list`.
3. Call `tgc_game_list` with your `designerId`.

Expected result:
- login succeeds
- at least one designer record is returned
- your game list is returned

## LLM Automation Prompt (Optional)

You can give this prompt to an LLM to execute setup from this README:

```text
Read this README and perform setup in order: prerequisites check, npm build, TGC env var setup, MCP registration, then install Agent and Skills into ~/tgcagent. Stop if any required value is missing, and ask only for that value.
```

## Troubleshooting

### MCP startup fails

Check:

```bash
env | grep '^TGC_'
cd /absolute/path/to/thegamecrafter-mcp/code && npm run build
```

### Login fails with missing auth input

Most common causes:
- `TGC_PUBLIC_API_KEY_ID` not set
- `TGC_USERNAME` not set
- `TGC_PASSWORD` not set

### MCP server does not appear in client

Most common causes:
- wrong `dist/index.js` path
- client not restarted after config changes

### TGC transient errors
- Retry after short delay.
- Avoid high request bursts.

---

## LLM-Driven Auto-Setup Prompt

You can paste this into your LLM:

```text
Set up The Game Crafter MCP from source on this machine.
1) Clone https://github.com/khenn/thegamecrafter-mcp.git
2) Build with: cd code && npm install && npm run build
3) Configure env vars: TGC_API_BASE_URL, TGC_PUBLIC_API_KEY_ID, TGC_USERNAME, TGC_PASSWORD
4) Register MCP stdio server named thegamecrafter using node and code/dist/index.js
5) Create ~/tgcagent and install:
   - AGENT profile: copy context/AGENTS.md to ~/tgcagent/AGENTS.md
   - Skill: copy skills/tgc-guided-workflows/SKILL.md to ~/tgcagent/skills/tgc-guided-workflows/SKILL.md
6) For Claude usage, convert AGENTS to Claude.md by copying ~/tgcagent/AGENTS.md to ~/tgcagent/Claude.md
7) Run smoke test: tgc_auth_login, tgc_designer_list, tgc_game_list
```

---

## Repository Map

- MCP source: `code/src/`
- MCP helper scripts: `code/scripts/dev/`
- Public agent profile: `context/AGENTS.md`
- Public skill: `skills/tgc-guided-workflows/SKILL.md`
- Local build profile: `AGENTS.md`
- Roadmap: `ROADMAP.md`

---

## Current Security Model

- Auth currently uses username + password + public API key ID.
- Secrets are environment-variable based.
- Secret-manager integration is planned but not default yet.
