# Session: Unbundle governance skill from TGCMCP repo

## Summary
Removed `skill-governance` from the TGCMCP source tree so it is not published as part of this MCP project, and installed it as a user Codex skill under `~/.codex/skills` for in-client usage.

## Changes
- Removed repo-packaged skill folder:
  - `skills/skill-governance/`
- Restored repo-local Plan A validation tooling under:
  - `code/scripts/skills/`
- Repointed npm scripts in `code/package.json` back to `code/scripts/skills/*`.
- Updated roadmap to track portable skill packaging as external/separate repo work.
- Updated `AGENTS.md` to remove repo dependency on `skills/skill-governance`.
- Installed project-agnostic skill for Codex discovery:
  - `/home/khenny/.codex/skills/skill-governance/`

## Verification
- Repo no longer includes governance skill package.
- Installed skill files exist in user Codex skills directory.
- Plan A test gate passes:
  - `npm --prefix code run skills:test`
