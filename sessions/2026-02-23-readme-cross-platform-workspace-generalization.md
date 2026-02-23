# Session: README cross-platform and workspace-path generalization

## Date
- 2026-02-23

## Goal
- Update install documentation to avoid Unix-only assumptions and avoid fixed workspace naming assumptions.

## Changes Made
- Updated `README.md` prerequisites to explicitly support Linux/macOS/Windows.
- Added Unix-like and Windows (PowerShell) command examples for build/setup.
- Added Unix-like and Windows instructions for temporary and persistent environment variable configuration.
- Added Windows notes for Codex MCP setup where bash helper scripts are not directly executable.
- Replaced hardcoded `~/tgcagent` usage with a user-defined workspace variable (`AGENT_WORKSPACE`).
- Updated Skill and Agent install examples to target user-chosen workspace paths.
- Updated Claude conversion instructions to use the same user-selected workspace.
- Updated LLM automation prompt text to request workspace path instead of assuming a default folder.
- Added Windows troubleshooting command equivalents.

## Notes
- The README now treats path and shell selection as explicit user choices.
- This makes the setup flow safer for copy/paste and easier for LLM automation across OS environments.
