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

`code/package.json` is currently private and not published as a public npm package.

Because of that:
- Git tags and GitHub releases are the primary public version markers
- the `package.json` version can be aligned during release preparation, but Git tag version is the authoritative public release identity

## Release Flow

For each release:

1. Confirm the release scope.
2. Update `CHANGELOG.md`.
3. Run the release checklist in `docs/RELEASE_CHECKLIST.md`.
4. Ensure the intended release commit is on `main`.
5. Create an annotated tag:
   - example: `git tag -a v1.0.0 -m "Release v1.0.0"`
6. Push the tag:
   - `git push origin v1.0.0`
7. Create a GitHub release from that tag using the changelog entry as release notes.

## Pre-Release Discipline

Before tagging:
- avoid mixing unrelated local-only files into the release commit
- ensure release-facing docs match actual behavior
- ensure known limitations are explicit
- ensure open post-release follow-ups are documented rather than silently omitted

## Post-Release Discipline

After tagging:
- move the current `Unreleased` entries forward
- start a fresh `Unreleased` section for new work
- record any intentionally deferred validation gates or post-release cleanup tasks
