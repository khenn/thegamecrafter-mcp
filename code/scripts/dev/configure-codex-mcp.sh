#!/usr/bin/env bash
set -euo pipefail

SERVER_NAME="${1:-thegamecrafter}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LAUNCHER="${PROJECT_ROOT}/code/scripts/dev/run-tgc-mcp.sh"

if ! command -v codex >/dev/null 2>&1; then
  echo "codex CLI not found in PATH." >&2
  exit 1
fi

if [[ ! -x "${LAUNCHER}" ]]; then
  echo "Launcher script is missing or not executable: ${LAUNCHER}" >&2
  exit 1
fi

if codex mcp get "${SERVER_NAME}" >/dev/null 2>&1; then
  codex mcp remove "${SERVER_NAME}" >/dev/null
fi

codex mcp add "${SERVER_NAME}" -- "${LAUNCHER}"
echo "Configured Codex MCP server '${SERVER_NAME}' -> ${LAUNCHER}"

