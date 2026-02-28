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
- The Game Crafter account: [thegamecrafter.com](https://www.thegamecrafter.com/)
- TGC API key pair (use the **public key ID**): [Create API Key](https://www.thegamecrafter.com/developer/APIKey.html)

Optional helper tools (recommended):
- PDF tools:
  - `pdfinfo` (inspect page count/size metadata)
  - `pdftoppm` (convert PDF pages to image files for component uploads)
- Image generation/editing:
  - `ImageMagick` (`magick`/`convert`) for resize/crop/pad/canvas prep and simple text overlays
  - `pngquant` (optional) for PNG size optimization before upload
- LLM workflow utilities:
  - `gh` (GitHub CLI) for issue-based feedback publishing flow
  - `jq` for JSON inspection/transform during debugging and script output review

## Recommended Integration Pattern

Use all three layers together:
- `MCP`: executes TGC API actions.
- `Skills`: provides guardrails, preflight checks, and workflow sequencing.
- `Agent profile`: sets consistent interaction behavior (guided prompts, safety/privacy posture, output style).

Recommended install location:
- Install in the same project where you keep your game files/artwork and prompts.
- Prefer project-local scope over global scope so behavior/config is isolated per game project and easier to audit/reproduce.

## Quick Install Summary

1. Build the MCP server (`code/dist/index.js`).  
Details: [Step 1: Build The MCP Server](#1-build-the-mcp-server)
2. Set required `TGC_*` environment variables in your runtime/shell.  
Details: [Step 2: Configure Authentication Environment Variables](#2-configure-authentication-environment-variables)
3. Register `thegamecrafter` MCP server in your LLM client/runtime using `node .../code/dist/index.js` and pass/inherit the same `TGC_*` environment variables.  
Details: [Step 3: Configure MCP Client](#3-configure-mcp-client)
4. Install `skills/tgc-guided-workflows` in your client’s skills location/tooling.  
Details: [Step 4: Install Skills](#4-install-skills)
5. Reference `context/TGCAGENT.md` from your local project agent file (`AGENTS.md`/`Claude.md`) instead of overwriting your existing file.  
Details: [Step 5: Configure Agent Profile](#5-configure-agent-profile)
6. Run a live verification prompt to confirm auth + basic tool calls.  
Details: [Step 6: Verify End-To-End Setup](#6-verify-end-to-end-setup)
7. (Optional) Enable contribution workflow so reusable learnings can be proposed back to TGCMCP via issue drafts with explicit approval.  
Details: [Step 7: Contribute Agent Learning Feedback](#7-contribute-agent-learning-feedback-optional)

## Detailed Instructions

### 1) Build The MCP Server

1. Clone the repository.
2. Install dependencies.
3. Build the project.
4. Verify the build output exists (while still in `thegamecrafter-mcp/code`).

#### Unix-like (Linux/macOS/WSL)

```bash
git clone https://github.com/khenn/thegamecrafter-mcp.git
cd thegamecrafter-mcp/code
npm install
npm run build
# verify while still in the code directory
test -f dist/index.js && echo "Build OK: dist/index.js" || echo "Build missing: run npm run build"
```

#### Windows (PowerShell)

```powershell
git clone https://github.com/khenn/thegamecrafter-mcp.git
Set-Location thegamecrafter-mcp\code
npm install
npm run build
# verify while still in the code directory
if (Test-Path .\dist\index.js) { "Build OK: dist/index.js" } else { "Build missing: run npm run build" }
```

### 2) Configure Authentication Environment Variables

The MCP server reads TGC auth settings from environment variables.

Required variables:
- `TGC_API_BASE_URL` (normally `https://www.thegamecrafter.com`)
- `TGC_PUBLIC_API_KEY_ID` (your TGC public API key ID)
- `TGC_USERNAME`
- `TGC_PASSWORD`

#### Temporary (current shell only)

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

#### Persistent (new shells)

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

### 3) Configure MCP Client

#### Description And Intended Use

This MCP server exposes TGC operations as callable tools for an LLM, including:
- authentication/session management
- game create/read/update/delete
- deck/card/component/file workflows
- pricing and packaging-related operations supported by the TGC API

Use it when you want an LLM to create or manage your own TGC games through auditable tool calls.

Client compatibility:
- This README provides explicit setup steps for Codex and Claude.
- The same setup is generally adaptable to Gemini or other LLM clients that support MCP, skills, and agent-style project instructions.

#### Codex (Step-by-step)

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

#### Claude (Step-by-step)

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

### 4) Install Skills

#### Description And Intended Use

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

#### Codex (Step-by-step)

Use Codex's built-in skill installer (recommended):

1. From your target project root, run:

```bash
codex skills install /absolute/path/to/thegamecrafter-mcp/skills/tgc-guided-workflows
```

2. Restart Codex so the new skill is loaded.
3. Verify by asking Codex:
   - `"List installed skills and confirm tgc-guided-workflows is available."`

Notes:
- Use `codex skills --help` for current CLI options and scope behavior.
- Codex CLI evolves quickly; this README intentionally uses the standard installer flow instead of custom helper scripts.

#### Claude (Step-by-step)

Use the same skill package and place it where your Claude runtime expects skills.

1. Copy `skills/tgc-guided-workflows` from this repo into your Claude skills location.
2. Restart Claude Code.
3. Verify by asking Claude:
   - `"List installed skills and confirm tgc-guided-workflows is available."`

### 5) Configure Agent Profile

#### Description And Intended Use

`context/TGCAGENT.md` is the public behavior profile for TGC workflows. It defines:
- interaction style for guided game creation
- option/prefill behavior
- preflight and safety checks
- output conventions (for example, pricing and links)
- preference contract keys expected from your local agent file (`AGENTS.md`/`Claude.md`)

Use it when you want predictable agent behavior across sessions and tools.

Agent config note:
- Keep preference values in your local project `AGENTS.md`/`Claude.md` so pulling new TGCMCP versions does not overwrite your choices.
- Recommended local block:
```yaml
preferences:
  currency: USD
  feedback_contribution: true
```
- You can ask your LLM to update these settings for you (for example: "set my TGCMCP preferences in AGENTS.md").

#### Codex (Step-by-step)

Recommended pattern: keep your own `AGENTS.md` and include TGCMCP instructions by reference.

1. Clone this repository somewhere local (inside or outside your project).
2. In your project's `AGENTS.md`, add a short include instruction:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/thegamecrafter-mcp/context/TGCAGENT.md
```

3. Start Codex in your target project.

Why this pattern:
- avoids overwriting your existing `AGENTS.md`,
- allows `git pull` updates to refresh TGCMCP guidance without manual merge churn.

#### Claude (Step-by-step)

This repository does **not** include a `Claude.md` file directly.
Do not create `Claude.md` unless you actively use Claude for that project.

To convert your setup for Claude:

1. In your project's `Claude.md`, add the same include instruction:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/thegamecrafter-mcp/context/TGCAGENT.md
```

2. Ensure your Claude runtime/project is configured to load `Claude.md`.

### 6) Verify End-To-End Setup

After your MCP client loads `thegamecrafter`, verify setup by giving your LLM this prompt:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```

### 7) Contribute Agent Learning Feedback (Optional)

This repo supports a low-friction feedback loop so real usage can improve AGENT + skills behavior over time.

What this means in practice:
- Feedback is event-driven: when the agent discovers a non-trivial, reusable learning that is not already in skills and would improve future build accuracy, it drafts an issue proposal automatically.
- Security and privacy are strict defaults:
  - feedback is scoped to reusable TGC interface learnings only (API/UI behavior),
  - user-specific game/IP content, PII, secrets, session identifiers, and local machine details are excluded from publication,
  - if context is needed, data is generalized/anonymized before sharing.
- Before anything is posted publicly, the agent shows the exact issue text and asks for explicit permission.
  - You can approve or reject each proposed publication.
- Disable this behavior by setting `preferences.feedback_contribution: false` in your local `AGENTS.md`/`Claude.md`.
- If automatic issue publishing is unavailable, the agent writes a pending feedback note under `contrib/feedback/`.
- In that fallback case, users are expected to review and submit a GitHub issue manually.

## LLM Automation (Optional)

### Setup Prompt

Use this when you want an LLM to do setup with minimal custom prompt maintenance.
This prompt tells the LLM to clone first, then follow the README from that clone.

```text
Clone https://github.com/khenn/thegamecrafter-mcp.git, then read the README from the cloned repo and follow it exactly for setup. Ask me only for missing required values. Do not duplicate or invent setup steps not in the README.
```

### Operator Notes

These notes are for LLM-driven setup flows, not required for manual setup.

- Probe before mutate:
  - check whether repo/build artifacts already exist before reinstalling/rebuilding.
  - check current MCP registration before add/remove operations.
- Prefer idempotent behavior:
  - ask the user whether to configure MCP in local project scope or global scope before running Codex MCP config commands.
  - do not remove/re-add MCP unless path/env or scope differs from target state.
  - prefer include-by-reference to `context/TGCAGENT.md` rather than overwriting an existing project agent file.

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
- Public agent profile: `context/TGCAGENT.md`
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
