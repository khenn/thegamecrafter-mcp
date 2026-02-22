#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SERVER_ENTRY="${PROJECT_ROOT}/code/dist/index.js"

# Ensure non-interactive launches (like Codex MCP) still load user TGC env vars.
if [[ -f "${HOME}/.bashrc" ]]; then
  # shellcheck disable=SC1090
  source "${HOME}/.bashrc"
fi

if [[ ! -f "${SERVER_ENTRY}" ]]; then
  echo "TGC MCP build artifact not found at ${SERVER_ENTRY}" >&2
  echo "Run: cd ${PROJECT_ROOT}/code && npm run build" >&2
  exit 1
fi

exec node "${SERVER_ENTRY}"
