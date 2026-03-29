# TGCMCP LLM Setup Helper

Use this helper when you want another LLM to perform TGCMCP setup with minimal custom prompting.

## Setup Prompt

```text
Run npx @tgcmcp/thegamecrafter-mcp@latest in this project, then follow the TGCMCP README exactly for setup. Ask me only for missing required values. Do not duplicate or invent setup steps not in the README.
```

## Operator Notes

- Probe before mutate:
  - check whether `.tgcmcp/` already exists before reinstalling
  - check current MCP registration before add/remove operations
- Prefer idempotent behavior:
  - ask the user whether to configure MCP in local project scope or global scope before running Codex MCP config commands
  - do not remove/re-add MCP unless path/env or scope differs from target state
  - prefer include-by-reference to `.tgcmcp/TGCAGENT.md` rather than overwriting an existing project agent file
