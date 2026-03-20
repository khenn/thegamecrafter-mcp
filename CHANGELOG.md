# Changelog

This file is the release-facing change log for TGCMCP.

## Unreleased

### Added
- 

### Changed
- 

### Fixed
- 

### Notes
- 

## v1.0.0 - 2026-03-20

### Added
- Core CI workflow for deterministic code quality checks.
- Contract, handler, response, and client reliability test suites.
- Opt-in resumable deck-create and bulk-card-create workflow controls.
- Opt-in relationship-scoped resumable component-create workflow control.
- GitHub community baseline files:
  - `CONTRIBUTING.md`
  - `CODE_OF_CONDUCT.md`
  - `SECURITY.md`
  - issue templates
  - PR template
- Feedback regression checklist and updated triage process.
- Release checklist and release-process docs.

### Changed
- Hardened TGC client timeout, retry, and diagnostics behavior.
- Expanded README release scope and known limitations guidance.
- Updated GitHub Actions workflows to Node 24-based action versions.
- Updated public agent/skill guidance for resumable deck and component workflows.
- Formalized release/versioning discipline for future tagged releases.

### Fixed
- Implemented missing `tgc_game_copy` contract/handler/service path.
- Fixed README release-doc links for GitHub rendering.
- Hardened live disposable fixture cleanup with stale fixture sweep by prefix.

### Notes
- First stable public release focused on Make/Iterate workflows.
- One real post-release feedback item still needs to be validated end to end to close the remaining B3 gate.

## Release Template

Copy this block for the next tagged release:

```md
## vX.Y.Z - YYYY-MM-DD

### Added
- 

### Changed
- 

### Fixed
- 

### Notes
- 
```
