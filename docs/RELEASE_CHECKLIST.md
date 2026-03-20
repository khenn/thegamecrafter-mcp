# Release Checklist

Use this checklist when preparing a TGCMCP release.

## Release 1 Baseline
- Confirm the release is still scoped to Make/Iterate workflows.
- Confirm README install steps still match the current build and client setup flow.
- Confirm README known limitations still match the implemented v1 tool surface.
- Confirm `CHANGELOG.md` has an entry for the release.

## Quality Gates
- Run `npm --prefix code run typecheck`
- Run `npm --prefix code run build`
- Run `TMPDIR=/tmp npm --prefix code test`
- Run `TMPDIR=/tmp npm --prefix code run skills:test`
- Confirm the latest `Core Quality Checks` workflow passed on GitHub.
- Confirm the latest `Skills Policy Checks` workflow passed on GitHub when skill changes are included.

## Workflow / Contract Review
- Confirm new tool inputs/outputs are documented in `tools/tgc-mcp-tool-contract-v1.md`.
- Confirm public guidance changes are reflected in:
  - `context/TGCAGENT.md`
  - relevant `skills/*/SKILL.md`
  - relevant skill references
- Confirm known limitations and non-goals are still accurate.

## Safety / Cleanup Review
- Confirm live disposable test flows still clean up created games/components where applicable.
- Confirm rerun-safe behavior remains opt-in and clearly documented.
- Confirm no new behavior weakens secret handling, privacy boundaries, or publication approval rules.

## Packaging / Publishing
- Confirm branch is clean except for intentional local-only files.
- Confirm the intended release commit is pushed to `main`.
- Create/update the release notes from `CHANGELOG.md`.
- Tag the release only after CI and release notes are ready.
