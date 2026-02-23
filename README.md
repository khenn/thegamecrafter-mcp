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

- Linux, macOS, or Windows
- Node.js `>=20` (tested on Node `24.x`)
- npm
- Git
- LLM client/runtime with MCP support (Codex, Claude, Gemini, or similar)
- Codex CLI `>=0.104.0` (recommended; tested on `0.104.0`)
- The Game Crafter account: [thegamecrafter.com](https://www.thegamecrafter.com/)
- TGC API key pair (use the **public key ID**): [Create API Key](https://www.thegamecrafter.com/developer/APIKey.html)

Optional for PDF workflows:
- `pdfinfo`
- `pdftoppm`

## 1) Build The MCP Server

1. Clone the repository.
2. Install dependencies.
3. Build the project.

### Unix-like (Linux/macOS/WSL)

```bash
git clone https://github.com/khenn/thegamecrafter-mcp.git
cd thegamecrafter-mcp/code
npm install
npm run build
```

### Windows (PowerShell)

```powershell
git clone https://github.com/khenn/thegamecrafter-mcp.git
Set-Location thegamecrafter-mcp\code
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

### Persistent (new shells)

Unix-like (bash):

```bash
cat >> ~/.bashrc <<'ENVVARS'
export TGC_API_BASE_URL="https://www.thegamecrafter.com"
export TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"
export TGC_USERNAME="<YOUR_TGC_USERNAME>"
export TGC_PASSWORD="<YOUR_TGC_PASSWORD>"
ENVVARS

source ~/.bashrc
```

Windows (PowerShell profile):

```powershell
if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
Add-Content -Path $PROFILE -Value '$env:TGC_API_BASE_URL="https://www.thegamecrafter.com"'
Add-Content -Path $PROFILE -Value '$env:TGC_PUBLIC_API_KEY_ID="<YOUR_TGC_PUBLIC_KEY_ID>"'
Add-Content -Path $PROFILE -Value '$env:TGC_USERNAME="<YOUR_TGC_USERNAME>"'
Add-Content -Path $PROFILE -Value '$env:TGC_PASSWORD="<YOUR_TGC_PASSWORD>"'
. $PROFILE
```

Security note:
- The bash/PowerShell profile approach stores secrets in plaintext.
- For stronger security, inject these values at runtime from an OS secret manager.

## MCP

### MCP Description And Intended Use

This MCP server exposes TGC operations as callable tools for an LLM, including:
- authentication/session management
- game create/read/update/delete
- deck/card/component/file workflows
- pricing and packaging-related operations supported by the TGC API

Use it when you want an LLM to create or manage your own TGC games through auditable tool calls.

Client compatibility:
- This README provides explicit setup steps for Codex and Claude.
- The same setup is generally adaptable to Gemini or other LLM clients that support MCP, skills, and agent-style project instructions.

### MCP Install For Codex (Step-by-step)

1. Open the root of the project where you want to use this MCP server (your project root, not this repository root).

```bash
cd /absolute/path/to/your-project
```

2. Choose Codex config scope.
- Global scope: affects shared Codex config.
- Project-local scope: isolates config to one project.

Important:
- If you do not choose project-local scope, Codex uses global config.
- Scope setup commands can change over time; we intentionally keep this README scope-agnostic.
- For current Codex guidance, see:
  - https://developers.openai.com/codex/
  - https://developers.openai.com/codex/skills/
- CLI help:
  - `codex mcp --help`
  - `codex mcp add --help`

3. Register MCP server:

Unix-like:

```bash
codex mcp add thegamecrafter \
  --env TGC_API_BASE_URL="$TGC_API_BASE_URL" \
  --env TGC_PUBLIC_API_KEY_ID="$TGC_PUBLIC_API_KEY_ID" \
  --env TGC_USERNAME="$TGC_USERNAME" \
  --env TGC_PASSWORD="$TGC_PASSWORD" \
  -- node /absolute/path/to/thegamecrafter-mcp/code/dist/index.js
```

Windows (PowerShell):

```powershell
codex mcp add thegamecrafter `
  --env TGC_API_BASE_URL="$env:TGC_API_BASE_URL" `
  --env TGC_PUBLIC_API_KEY_ID="$env:TGC_PUBLIC_API_KEY_ID" `
  --env TGC_USERNAME="$env:TGC_USERNAME" `
  --env TGC_PASSWORD="$env:TGC_PASSWORD" `
  -- node C:\absolute\path\to\thegamecrafter-mcp\code\dist\index.js
```

4. Verify:

```bash
codex mcp list
codex mcp get thegamecrafter
```

5. If you need to update the config later, remove and re-add:

```bash
codex mcp remove thegamecrafter
```

### MCP Install For Claude (Step-by-step)

1. Open the root of the project where you want Claude to use this MCP server (your project root, not this repository root).
2. Identify the absolute server entry point path:
- `/absolute/path/to/thegamecrafter-mcp/code/dist/index.js`

3. Add an MCP stdio server in your Claude client/runtime config for that project:
- name: `thegamecrafter`
- command: `node`
- args: `["/absolute/path/to/thegamecrafter-mcp/code/dist/index.js"]`
- env: include `TGC_API_BASE_URL`, `TGC_PUBLIC_API_KEY_ID`, `TGC_USERNAME`, `TGC_PASSWORD`

4. Example config shape (adapt to your Claude runtime format):

```json
{
  "mcpServers": {
    "thegamecrafter": {
      "command": "node",
      "args": ["/absolute/path/to/thegamecrafter-mcp/code/dist/index.js"],
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

If your Claude runtime inherits environment variables from the parent process, you can omit the `env` block and set `TGC_*` in your shell/session before launch.

5. Restart Claude client/runtime so the MCP server is loaded.

## Skills

### Skills Description And Intended Use

`skills/tgc-guided-workflows/` is a Codex skill package. It provides reusable workflow logic, including:
- guided TGC intent handling
- component preflight checks
- print-safety guardrails
- known API pitfalls and safe sequencing patterns

Package layout:
- `SKILL.md`: concise trigger and workflow router
- `references/`: detailed workflow/component guidance loaded only when needed
- `agents/openai.yaml`: optional UI/dependency metadata

Use this when you want your LLM to behave consistently during game-building tasks.

### Skills Install For Codex (Step-by-step)

Codex standard locations (choose one):
- Project-scoped (recommended): `<PROJECT_ROOT>/.codex/skills/`
- User-scoped: `~/.codex/skills/`

1. Copy the entire skill folder (not only `SKILL.md`) into your project root skills path:

Unix-like:

```bash
mkdir -p /absolute/path/to/your-project/.codex/skills
cp -R /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows \
  /absolute/path/to/your-project/.codex/skills/
```

PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "C:\absolute\path\to\your-project\.codex\skills" | Out-Null
Copy-Item -Recurse -Force "C:\absolute\path\to\thegamecrafter-mcp\skills\tgc-guided-workflows" `
  "C:\absolute\path\to\your-project\.codex\skills\tgc-guided-workflows"
```

2. Restart Codex so newly installed skills are loaded.
3. Ensure your active Codex scope matches where you installed the skill (`<PROJECT_ROOT>/.codex/skills` for project-local scope, or `~/.codex/skills` for global scope).
4. Optional check:

```bash
ls -la /absolute/path/to/your-project/.codex/skills/tgc-guided-workflows
```

### Skills Install For Claude (Step-by-step)

Claude standard locations (choose one):
- Project-scoped (recommended): `<PROJECT_ROOT>/.claude/skills/`
- User-scoped: `~/.claude/skills/`

1. Copy the same skill folder into your project root Claude skills path:

PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "C:\absolute\path\to\your-project\.claude\skills" | Out-Null
Copy-Item -Recurse -Force "C:\absolute\path\to\thegamecrafter-mcp\skills\tgc-guided-workflows" `
  "C:\absolute\path\to\your-project\.claude\skills\tgc-guided-workflows"
```

Unix-like:

```bash
mkdir -p /absolute/path/to/your-project/.claude/skills
cp -R /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows \
  /absolute/path/to/your-project/.claude/skills/
```

2. Restart Claude Code so newly installed skills are loaded.

## Agent

### Agent Description And Intended Use

`context/AGENTS.md` is the public behavior profile for TGC workflows. It defines:
- interaction style for guided game creation
- option/prefill behavior
- preflight and safety checks
- output conventions (for example, pricing and links)

Use it when you want predictable agent behavior across sessions and tools.

### Agent Install For Codex (Step-by-step)

1. Copy the public agent profile to your project root as `AGENTS.md`.
2. If your project already has `AGENTS.md`, do not overwrite blindly:
- copy TGCMCP profile to `AGENTS.tgcmcp.md`,
- merge required sections into existing `AGENTS.md`.

Unix-like:

```bash
mkdir -p /absolute/path/to/your-project
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md /absolute/path/to/your-project/AGENTS.md
```

Unix-like safe merge path if `AGENTS.md` already exists:

```bash
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md /absolute/path/to/your-project/AGENTS.tgcmcp.md
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "C:\absolute\path\to\your-project" | Out-Null
Copy-Item "C:\absolute\path\to\thegamecrafter-mcp\context\AGENTS.md" `
  "C:\absolute\path\to\your-project\AGENTS.md"
```

PowerShell safe merge path if `AGENTS.md` already exists:

```powershell
Copy-Item "C:\absolute\path\to\thegamecrafter-mcp\context\AGENTS.md" `
  "C:\absolute\path\to\your-project\AGENTS.tgcmcp.md"
```

3. Start Codex in your target project.

### Agent Install For Claude (Step-by-step)

This repository does **not** include a `Claude.md` file directly.
Do not create `Claude.md` unless you actively use Claude for that project.

To convert `AGENTS.md` to Claude format:

1. Copy and rename the public profile:

Unix-like:

```bash
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md /absolute/path/to/your-project/Claude.md
```

Windows (PowerShell):

```powershell
Copy-Item "C:\absolute\path\to\thegamecrafter-mcp\context\AGENTS.md" `
  "C:\absolute\path\to\your-project\Claude.md"
```

2. Open `Claude.md` in your chosen project folder.
3. Remove or adjust any Codex-specific wording if your Claude runtime requires different phrasing.
4. Ensure your Claude runtime/project is configured to load `Claude.md`.

## 3) Verify End-To-End Setup

After your MCP client loads `thegamecrafter`, verify setup by giving your LLM this prompt:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```

## LLM Automation Prompt (Optional)

Use this when you want an LLM to do setup with minimal custom prompt maintenance.
This prompt tells the LLM to clone first, then follow the README from that clone.

```text
Clone https://github.com/khenn/thegamecrafter-mcp.git, then read the README from the cloned repo and follow it exactly for setup. Ask me only for missing required values. Do not duplicate or invent setup steps not in the README.
```

## LLM Operator Notes (Optional)

These notes are for LLM-driven setup flows, not required for manual setup.

- Probe before mutate:
  - check whether repo/build artifacts already exist before reinstalling/rebuilding.
  - check current MCP registration before add/remove operations.
- Prefer idempotent behavior:
  - ask the user whether to configure MCP in local project scope or global scope before running Codex MCP config commands.
  - do not remove/re-add MCP unless path/env or scope differs from target state.
  - do not overwrite existing project `AGENTS.md` without merge review.

## Troubleshooting

### MCP startup fails

Check:

```bash
env | grep '^TGC_'
cd /absolute/path/to/thegamecrafter-mcp/code && npm run build
```

Windows (PowerShell):

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like 'TGC_*' }
Set-Location C:\absolute\path\to\thegamecrafter-mcp\code
npm run build
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

### npm permission/cache issues
- If `npm install` fails due to cache permissions, use a local temp cache path:

```bash
npm install --cache /tmp/$USER-npm-cache
```

---

## Repository Map

- MCP source: `code/src/`
- MCP dev scripts: `code/scripts/dev/`
- Public agent profile: `context/AGENTS.md`
- Public skill: `skills/tgc-guided-workflows/SKILL.md`
- Skill references: `skills/tgc-guided-workflows/references/`
- Skill metadata: `skills/tgc-guided-workflows/agents/openai.yaml`
- Local root agent files (`AGENTS.md`, `AGENT.md`) are intentionally local-only and not tracked in git.
- Roadmap: `ROADMAP.md`

---

## Current Security Model

- Auth currently uses username + password + public API key ID.
- Secrets are environment-variable based.
- Secret-manager integration is planned but not default yet.
