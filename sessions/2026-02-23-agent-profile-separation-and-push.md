# Session: Root/Public AGENT Separation + Push

Date: 2026-02-23

## Goal
Separate local build-agent behavior from public end-user agent behavior to avoid blended directives during MCP development.

## Changes
- Replaced root `AGENTS.md` with a build-focused, local-only instruction file.
- Removed cross-file dependency that made root behavior hinge on `context/AGENTS.md`.
- Kept `context/AGENTS.md` as the public-facing behavior profile artifact for downstream testing/use.

## Notes
- Root agent now governs MCP/tool development workflow only.
- Public interaction profile remains available for external simulation/testing in separate environments.
