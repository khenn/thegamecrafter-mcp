# Release Process

This document defines the TGCMCP release/versioning process.

## Versioning Policy

TGCMCP uses semantic versioning for Git tags and release notes:

- `MAJOR`
  - breaking contract or workflow behavior changes
  - release-train milestones such as the first stable public release
- `MINOR`
  - backward-compatible new tools, workflow coverage, or materially expanded capabilities
- `PATCH`
  - backward-compatible fixes, docs corrections, reliability fixes, or regression repairs

## First Stable Release Recommendation

Recommended first stable public release:

- `v1.0.0`

Rationale:
- Release 1 is defined as the first stable Make/Iterate release
- it represents a stable public baseline rather than a preview-only milestone
- later sell-surface and growth work is already planned as Release 2 / Release 3

## Package Version Note

TGCMCP now ships a public npm installer package from `code/`:

- package: `@tgcmcp/thegamecrafter-mcp`
- installer entrypoint: `npx @tgcmcp/thegamecrafter-mcp@latest`

Because of that:
- Git tags and GitHub releases still matter for source-history releases
- the npm package version is the authoritative public version for installer users
- the Git tag version and `code/package.json` version should stay aligned for every public release

## Release Flow

For each release:

1. Confirm the release scope.
2. Update `CHANGELOG.md`.
3. Bump the version in `code/package.json`.
4. Run the release checklist in `docs/RELEASE_CHECKLIST.md`.
5. Ensure the intended release commit is on `main`.
6. Publish the npm package from `code/`.
7. Verify the published installer path:
   - `npm view @tgcmcp/thegamecrafter-mcp version`
   - `npx @tgcmcp/thegamecrafter-mcp@latest`
8. Create an annotated tag:
   - example: `git tag -a v1.0.0 -m "Release v1.0.0"`
9. Push the tag:
   - `git push origin v1.0.0`
10. Create a GitHub release from that tag using the changelog entry as release notes.

Use `tools/tgcmcp-npm-release-playbook.md` as the step-by-step npm publishing reference.

## Pre-Release Discipline

Before tagging:
- avoid mixing unrelated local-only files into the release commit
- ensure release-facing docs match actual behavior
- ensure known limitations are explicit
- ensure open post-release follow-ups are documented rather than silently omitted
- ensure the install command in public docs matches the currently published npm package

## Post-Release Discipline

After tagging and publishing:
- move the current `Unreleased` entries forward
- start a fresh `Unreleased` section for new work
- record any intentionally deferred validation gates or post-release cleanup tasks
