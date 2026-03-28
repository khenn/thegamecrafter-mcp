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
- LLM client/runtime with MCP support (Codex, Claude, Gemini, or similar)
- The Game Crafter account: [thegamecrafter.com](https://www.thegamecrafter.com/)
- TGC API key pair (use the **public key ID**): [Create API Key](https://www.thegamecrafter.com/developer/APIKey.html)

Optional for source builds only:
- Git

Optional helper tools (recommended):
- PDF tools:
  - `pdfinfo` (inspect page count/size metadata)
  - `pdftoppm` (convert PDF pages to image files for component uploads)
- Image generation/editing:
  - `ImageMagick` (`magick`/`convert`) for resize/crop/pad/canvas prep and simple text overlays
  - `pngquant` (optional) for PNG size optimization before upload

## Recommended Integration Pattern

Use all three layers together:
- `MCP`: executes TGC API actions.
- `Skills`: provides guardrails, preflight checks, and workflow sequencing.
- `Agent profile`: sets consistent interaction behavior (guided prompts, safety/privacy posture, output style).

Recommended install location:
- Install in the same project where you keep your game files/artwork and prompts.
- Prefer project-local scope over global scope so behavior/config is isolated per game project and easier to audit/reproduce.

## Release 1 Scope

TGCMCP Release 1 is focused on **Make and Iterate** workflows:
- create and manage games
- upload files and create components
- deck/card flows
- packaging, board/mat, book, custom-cut, and specialty-part make workflows
- readiness, pricing, and cost-breakdown helpers

This release is intended for guided prototype-building and iteration, not full sell-surface automation.

## Quick Install Summary

1. Run the bootstrap installer in the project where you want to use TGCMCP.  
Details: [Step 1: Install TGCMCP](#1-install-tgcmcp)
2. Configure your LLM client to run the installed local MCP server and pass the required `TGC_*` environment variables.  
Details: [Step 2: Configure Your LLM Client](#2-configure-your-llm-client)
3. Install the TGCMCP skills from the local `.tgcmcp/skills/` directory if you want guided workflows.  
Details: [Step 3: Install Skills](#3-install-skills)
4. Optionally reference the local `.tgcmcp/TGCAGENT.md` from your project agent file.  
Details: [Step 4: Configure Agent Profile Optional](#4-configure-agent-profile-optional)
5. Run a live verification prompt to confirm auth + basic tool calls.  
Details: [Step 5: Verify End-To-End Setup](#5-verify-end-to-end-setup)
6. (Optional) Enable contribution workflow so reusable learnings can be proposed back to TGCMCP via issue drafts with explicit approval.  
Details: [Step 6: Contribute Agent Learning Feedback Optional](#6-contribute-agent-learning-feedback-optional)

## Detailed Instructions

### 1) Install TGCMCP

Run the bootstrap installer from the root of the project where you want TGCMCP available.

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

The installer creates a local `.tgcmcp/` directory in the current project containing:
- `server/index.js`: the local MCP server entry point
- `skills/`: the installable TGCMCP skill packages
- `TGCAGENT.md`: the optional public agent profile
- `manifest.json`: install metadata for future upgrades

This installer is intentionally simple in v1:
- no prompts
- no runtime auto-detection
- no automatic LLM client configuration
- no automatic skill installation
- no automatic agent/profile integration

### 2) Configure Your LLM Client

#### Description And Intended Use

This MCP server exposes TGC operations as callable tools for an LLM, including:
- authentication/session management
- game create/read/update/delete
- deck/card/component/file workflows
- pricing and packaging-related operations supported by the TGC API

Use it when you want an LLM to create or manage your own TGC games through auditable tool calls.

Client compatibility:
- This README provides manual v1 setup steps for Codex, Claude Code, OpenCode, and Gemini CLI.
- Skills and agent/profile integration remain manual in v1.

The local server entry installed by Step 1 is:
- `/absolute/path/to/your-project/.tgcmcp/server/index.js`

Required environment variables:
- `TGC_API_BASE_URL` (normally `https://www.thegamecrafter.com`)
- `TGC_PUBLIC_API_KEY_ID` (your TGC public API key ID)
- `TGC_USERNAME`
- `TGC_PASSWORD`

Temporary shell examples:

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

Security note:
- For stronger security, inject these values at runtime from an OS secret manager rather than storing them in plaintext profiles or config files.

#### Codex (Step-by-step)

From the project where you ran the installer:

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

If you need to reconfigure it later:

```bash
codex mcp remove thegamecrafter
```

#### Claude (Step-by-step)

Add an MCP stdio server in your Claude client/runtime config for that project:
- name: `thegamecrafter`
- command: `node`
- args: `["/absolute/path/to/your-project/.tgcmcp/server/index.js"]`
- env: include `TGC_API_BASE_URL`, `TGC_PUBLIC_API_KEY_ID`, `TGC_USERNAME`, `TGC_PASSWORD`

Example config shape (adapt to your Claude runtime format):

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

If your Claude runtime inherits environment variables from the parent process, you can omit the `env` block and set `TGC_*` in your shell/session before launch.

Restart Claude client/runtime so the MCP server is loaded.

#### OpenCode (Step-by-step)

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

#### Gemini CLI (Step-by-step)

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

### 3) Install Skills

#### Description And Intended Use

TGCMCP now uses a small skill stack instead of a single all-purpose skill. The recommended install set is:
- `skills/tgc-guided-workflows/`
- `skills/tgc-packaging-workflows/`
- `skills/tgc-card-deck-workflows/`
- `skills/tgc-board-mat-workflows/`
- `skills/tgc-custom-cut-workflows/`
- `skills/tgc-parts-dice-workflows/`
- `skills/tgc-component-preflight/`
- `skills/tgc-book-rulebook-workflows/`
- `skills/tgc-image-preflight-fit/`

Together these provide:
- guided TGC intent handling
- focused packaging/component/book workflows
- focused card/deck workflows
- focused board/mat/screen workflows
- focused custom-cut, sticker, dial, and dual-layer-board workflows
- focused acrylic, dice, meeple, and play-money workflows
- print-safety and proof-fit guardrails
- known API pitfalls and safe sequencing patterns

Package layout:
- `SKILL.md`: concise trigger and workflow router
- `references/`: detailed workflow/component guidance loaded only when needed
- `agents/openai.yaml`: optional UI/dependency metadata

Use this when you want your LLM to behave consistently during game-building tasks.

#### Codex (Step-by-step)

Use Codex's built-in skill installer against the locally installed copies in `.tgcmcp/skills`:

From your target project root, run:

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

Restart Codex so the new skills are loaded.

Notes:
- Use `codex skills --help` for current CLI options and scope behavior.
- Codex CLI evolves quickly; v1 keeps skill installation manual on purpose.

#### Claude (Step-by-step)

Use the same skill package and place it where your Claude runtime expects skills.

Copy the skill folders you want from `.tgcmcp/skills/` into your Claude skills location, then restart Claude Code.

### 4) Configure Agent Profile Optional

#### Description And Intended Use

`.tgcmcp/TGCAGENT.md` is the public behavior profile for TGC workflows. It defines:
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

In your project's `AGENTS.md`, add a short include instruction:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/your-project/.tgcmcp/TGCAGENT.md
```

Start Codex in your target project.

Why this pattern:
- avoids overwriting your existing `AGENTS.md`,
- makes future TGCMCP updates easier to adopt without replacing your own local agent file.

#### Claude (Step-by-step)

This repository does **not** include a `Claude.md` file directly.
Do not create `Claude.md` unless you actively use Claude for that project.

To convert your setup for Claude:

1. In your project's `Claude.md`, add the same include instruction:

```md
For The Game Crafter workflows, also follow:
/absolute/path/to/your-project/.tgcmcp/TGCAGENT.md
```

2. Ensure your Claude runtime/project is configured to load `Claude.md`.

### 5) Verify End-To-End Setup

After your MCP client loads `thegamecrafter`, verify setup by giving your LLM this prompt:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```

### 6) Contribute Agent Learning Feedback (Optional)

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
This prompt tells the LLM to run the installer first, then follow the README from the local project.

```text
Run npx @tgcmcp/thegamecrafter-mcp@latest in this project, then follow the TGCMCP README exactly for setup. Ask me only for missing required values. Do not duplicate or invent setup steps not in the README.
```

### Operator Notes

These notes are for LLM-driven setup flows, not required for manual setup.

- Probe before mutate:
  - check whether `.tgcmcp/` already exists before reinstalling.
  - check current MCP registration before add/remove operations.
- Prefer idempotent behavior:
  - ask the user whether to configure MCP in local project scope or global scope before running Codex MCP config commands.
  - do not remove/re-add MCP unless path/env or scope differs from target state.
  - prefer include-by-reference to `.tgcmcp/TGCAGENT.md` rather than overwriting an existing project agent file.

## Troubleshooting

### MCP startup fails

Check:

```bash
env | grep '^TGC_'
test -f ./.tgcmcp/server/index.js && echo "Install OK" || echo "Missing .tgcmcp/server/index.js"
```

Windows (PowerShell):

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like 'TGC_*' }
if (Test-Path .\.tgcmcp\server\index.js) { "Install OK" } else { "Missing .tgcmcp\\server\\index.js" }
```

If the local install is missing or stale, rerun:

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

### Login fails with missing auth input

Most common causes:
- `TGC_PUBLIC_API_KEY_ID` not set
- `TGC_USERNAME` not set
- `TGC_PASSWORD` not set

### MCP server does not appear in client

Most common causes:
- wrong `.tgcmcp/server/index.js` path
- client not restarted after config changes

### TGC transient errors
- Retry after short delay.
- Avoid high request bursts.

### npm permission/cache issues
- If `npx` or `npm` fails due to cache permissions, use a local temp cache path:

```bash
NPM_CONFIG_CACHE=/tmp/$USER-npm-cache npx @tgcmcp/thegamecrafter-mcp@latest
```

## Build From Source (Developers)

Use this path only if you are contributing to TGCMCP itself or need to test unpublished changes.

```bash
git clone https://github.com/khenn/thegamecrafter-mcp.git
cd thegamecrafter-mcp/code
npm install
npm run build
```

## Known Limitations (v1)

- Release 1 is centered on **Make and Iterate** workflows. Broader sell-surface automation is not complete yet.
- `tgc_game_publish` and `tgc_game_unpublish` exist, but guided publish preparation and wider sell metadata workflows are not complete in v1.
- `tgc_file_upload` does not currently dedupe or rediscover prior uploads automatically.
  - If you already know the correct `fileId`, reuse it instead of blindly re-uploading.
- Resumable behavior is opt-in and currently limited to selected workflows:
  - `tgc_deck_create.resumeIfExists`
  - `tgc_deck_bulk_create_cards.skipExisting`
  - `tgc_component_create.resumeIfExists` with explicit `relationship`
- Live TGC mutation tests are intentionally not part of default CI.
  - CI covers deterministic typecheck/build/offline tests.
- Long-lived secret-manager integration is not included in v1.
- MCP `resources/list` / `resources/read` style docs resources are deferred.
- Embedded-game mutation is not implemented.
- Some stock-component and sell/growth workflows still require partial UI/manual handling.

## Upgrade Notes

Use these release-facing docs for future updates:
- [CHANGELOG.md](CHANGELOG.md) for release notes / upgrade summaries
- [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) for release preparation checks
- [docs/RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md) for versioning and tagging policy
