# The Game Crafter MCP (TGCMCP)

MCP server for The Game Crafter (TGC) Developer API, plus a reusable public agent profile and a reusable skill.

Current release focus: Make and Iterate workflows for guided prototype-building.

## Quick Start

Run the bootstrap installer from the root of the project where you want TGCMCP available:

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

This installs TGCMCP into a local `.tgcmcp/` directory in your project.

Recommended install location:
- Install in the same project where you keep your game files/artwork and prompts.
- Prefer project-local scope over global scope so behavior/config is isolated per game project and easier to audit/reproduce.

## Prerequisites

- Linux, macOS, or Windows
- Node.js `>=20` (tested on Node `24.x`)
- npm
- LLM client/runtime with MCP support (Codex, Claude, Gemini, or similar)
- The Game Crafter account: [thegamecrafter.com](https://www.thegamecrafter.com/)
- TGC API key pair (use the **public key ID**): [Create API Key](https://www.thegamecrafter.com/developer/APIKey.html)

Required environment variables:
- `TGC_API_BASE_URL`
- `TGC_PUBLIC_API_KEY_ID`
- `TGC_USERNAME`
- `TGC_PASSWORD`

## Choose Your Client

Use the setup guide for your LLM client:

- [Codex Setup](docs/setup-codex.md)
- [Claude Code Setup](docs/setup-claude-code.md)
- [OpenCode Setup](docs/setup-opencode.md)
- [Gemini CLI Setup](docs/setup-gemini-cli.md)

Each guide is end to end for that client:
- install TGCMCP
- configure MCP
- install skills
- optionally configure the agent profile
- verify setup

## What Gets Installed

The installer creates a local `.tgcmcp/` directory in your project containing:
- `server/index.js`: the local MCP server entry point
- `skills/`: the installable TGCMCP skill packages
- `TGCAGENT.md`: the optional public agent profile
- `manifest.json`: install metadata for upgrades

To refresh or update the local install later, rerun:

```bash
npx @tgcmcp/thegamecrafter-mcp@latest
```

## Verify End-To-End Setup

After your client is configured, use this verification prompt:

```text
Run an installation verification for The Game Crafter MCP.
1) Authenticate with tgc_auth_login.
2) Get my designers with tgc_designer_list.
3) Use the first designerId to call tgc_game_list.
4) Return a short PASS/FAIL summary and include any error details plus the likely fix.
```

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

## Automation Helper

Operator-oriented setup prompt and helper notes are available in [tools/tgcmcp-llm-setup-helper.md](tools/tgcmcp-llm-setup-helper.md).

## Build From Source (Developers)

Use this path only if you are contributing to TGCMCP itself or need to test unpublished changes.

Source-build prerequisites:
- Git

```bash
git clone https://github.com/khenn/thegamecrafter-mcp.git
cd thegamecrafter-mcp/code
npm install
npm run build
```

Optional helper tools (recommended for deeper workflows):
- PDF tools:
  - `pdfinfo` (inspect page count/size metadata)
  - `pdftoppm` (convert PDF pages to image files for component uploads)
- Image generation/editing:
  - `ImageMagick` (`magick`/`convert`) for resize/crop/pad/canvas prep and simple text overlays
  - `pngquant` (optional) for PNG size optimization before upload

## Known Limitations (v1)

- Release 1 is focused on **Make and Iterate** workflows:
  - create and manage games
  - upload files and create components
  - deck/card flows
  - packaging, board/mat, book, custom-cut, and specialty-part make workflows
  - readiness, pricing, and cost-breakdown helpers
- Broader sell-surface automation is not complete yet.
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
