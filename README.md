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
- Codex CLI `>=0.104.0` (for Codex MCP setup; tested on `0.104.0`)
- TGC account
- TGC API key pair (you must use the **public key ID**)

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

### MCP Install For Codex (Step-by-step)

1. Open the root of the project where you want to use this MCP server (your project root, not this repository root).

```bash
cd /absolute/path/to/your-project
```

2. Register the MCP server directly (standard Codex method):

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

3. Verify:

```bash
codex mcp list
codex mcp get thegamecrafter
```

4. If you need to update the config later, remove and re-add:

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

1. Set path variables:
- Unix-like example:

```bash
export PROJECT_ROOT="/absolute/path/to/your-project"
export CODEX_SKILLS_DIR="$PROJECT_ROOT/.codex/skills"
```

- PowerShell example:

```powershell
$PROJECT_ROOT="C:\absolute\path\to\your-project"
$CODEX_SKILLS_DIR="$PROJECT_ROOT\.codex\skills"
```

2. Copy the entire skill folder (not only `SKILL.md`):

Unix-like:

```bash
mkdir -p "$CODEX_SKILLS_DIR"
cp -R /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows "$CODEX_SKILLS_DIR/"
```

PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path $CODEX_SKILLS_DIR | Out-Null
Copy-Item -Recurse -Force "C:\absolute\path\to\thegamecrafter-mcp\skills\tgc-guided-workflows" `
  "$CODEX_SKILLS_DIR\tgc-guided-workflows"
```

3. Restart Codex so newly installed skills are loaded.

### Skills Install For Claude (Step-by-step)

Claude standard locations (choose one):
- Project-scoped (recommended): `<PROJECT_ROOT>/.claude/skills/`
- User-scoped: `~/.claude/skills/`

1. Set path variables:
- PowerShell example:

```powershell
$PROJECT_ROOT="C:\absolute\path\to\your-project"
$CLAUDE_SKILLS_DIR="$PROJECT_ROOT\.claude\skills"
```

- Unix-like example:

```bash
export PROJECT_ROOT="/absolute/path/to/your-project"
export CLAUDE_SKILLS_DIR="$PROJECT_ROOT/.claude/skills"
```

2. Copy the same skill folder into Claude skills directory:

PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path $CLAUDE_SKILLS_DIR | Out-Null
Copy-Item -Recurse -Force "C:\absolute\path\to\thegamecrafter-mcp\skills\tgc-guided-workflows" `
  "$CLAUDE_SKILLS_DIR\tgc-guided-workflows"
```

Unix-like:

```bash
mkdir -p "$CLAUDE_SKILLS_DIR"
cp -R /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows "$CLAUDE_SKILLS_DIR/"
```

3. Restart Claude Code so newly installed skills are loaded.

## Agent

### Agent Description And Intended Use

`context/AGENTS.md` is the public behavior profile for TGC workflows. It defines:
- interaction style for guided game creation
- option/prefill behavior
- preflight and safety checks
- output conventions (for example, pricing and links)

Use it when you want predictable agent behavior across sessions and tools.

### Agent Install For Codex (Step-by-step)

1. Choose your target project root.
2. Set a project path variable:
   - Unix-like example: `export PROJECT_ROOT="$HOME/my-tgc-project"`
   - PowerShell example: `$PROJECT_ROOT="$HOME\\my-tgc-project"`
3. Copy the public agent profile to project root as `AGENTS.md`.

Unix-like:

```bash
mkdir -p "$PROJECT_ROOT"
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md "$PROJECT_ROOT/AGENTS.md"
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$PROJECT_ROOT" | Out-Null
Copy-Item "C:\absolute\path\to\thegamecrafter-mcp\context\AGENTS.md" `
  "$PROJECT_ROOT\AGENTS.md"
```

4. Start Codex in your target project (`$PROJECT_ROOT`).

### Agent Install For Claude (Step-by-step)

This repository does **not** include a `Claude.md` file directly.

To convert `AGENTS.md` to Claude format:

1. Ensure `PROJECT_ROOT` is set to your target project path.
2. Copy and rename the public profile:

Unix-like:

```bash
cp /absolute/path/to/thegamecrafter-mcp/context/AGENTS.md "$PROJECT_ROOT/Claude.md"
```

Windows (PowerShell):

```powershell
Copy-Item "C:\absolute\path\to\thegamecrafter-mcp\context\AGENTS.md" `
  "$PROJECT_ROOT\Claude.md"
```

3. Open `Claude.md` in your chosen project folder.
4. Remove or adjust any Codex-specific wording if your Claude runtime requires different phrasing.
5. Ensure your Claude runtime/project is configured to load `Claude.md`.

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
Read this README and perform setup in order: prerequisites check, npm build, TGC env var setup, MCP registration, then ask me for my target project path and install Agent plus the skill package into standard locations (.codex/skills and optionally .claude/skills). Stop if any required value is missing, and ask only for that value.
```

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

---

## LLM-Driven Auto-Setup Prompt

You can paste this into your LLM:

```text
Set up The Game Crafter MCP from source on this machine.
1) Clone https://github.com/khenn/thegamecrafter-mcp.git
2) Build with: cd code && npm install && npm run build
3) Configure env vars: TGC_API_BASE_URL, TGC_PUBLIC_API_KEY_ID, TGC_USERNAME, TGC_PASSWORD
4) Register MCP stdio server named thegamecrafter using node and code/dist/index.js
5) Ask me for my target project root path, then install:
   - AGENT profile: copy context/AGENTS.md to <PROJECT_ROOT>/AGENTS.md
   - Codex skill: copy folder skills/tgc-guided-workflows to <PROJECT_ROOT>/.codex/skills/tgc-guided-workflows
   - Claude skill (optional): copy folder skills/tgc-guided-workflows to <PROJECT_ROOT>/.claude/skills/tgc-guided-workflows
6) For Claude usage, convert AGENTS to Claude.md by copying <PROJECT_ROOT>/AGENTS.md to <PROJECT_ROOT>/Claude.md
7) Run smoke test: tgc_auth_login, tgc_designer_list, tgc_game_list
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
