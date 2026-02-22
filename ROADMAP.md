# The Game Crafter MCP - Feature Roadmap

This roadmap is for the public `thegamecrafter-mcp` project and reflects planned delivery phases.

## Guiding Principles
- Stable MCP tool contracts for AI clients.
- Secure-by-default behavior with explicit user control.
- Incremental delivery with working milestones.

## Phase 1 - Core Foundation (Current)
- [x] MCP server scaffold with stdio transport.
- [x] Tool contract defined for core game-management scope.
- [x] TGC auth/session integration (`tgc_auth_login`, `tgc_auth_logout`).
- [x] Basic read tools (`tgc_me`, `tgc_designer_list`, `tgc_game_get`).

## Phase 2 - Authoring Essentials (Next)
- [ ] Game creation and metadata updates (`tgc_game_create`, `tgc_game_update`, `tgc_game_copy`).
- [ ] Publish lifecycle tools (`tgc_game_publish`, `tgc_game_unpublish`).
- [ ] Folder and file asset workflows (`tgc_folder_create`, `tgc_file_upload`).
- [ ] Deck/card creation basics (`tgc_deck_create`, `tgc_card_create`, bulk card create).

## Phase 3 - Discovery and Workflow Usability
- [ ] Add `tgc_game_list` to enumerate a user's games directly.
- [ ] Add preflight checks for common workflow failures.
- [ ] Improve pagination/filter support across list tools.
- [ ] Improve error messages for agent-driven troubleshooting.

## Phase 4 - Reliability and Quality
- [ ] Broader integration and contract test coverage.
- [ ] CI enforcement for typecheck/build/tests.
- [ ] Better retry/backoff strategy and rate-limit resilience.
- [ ] Release/versioning and changelog automation.

## Phase 5 - Security Enhancements (Downstream)
- [ ] Optional local secret-store integrations for unattended automation.
  - Initial target: Linux/WSL-friendly secret manager flow.
  - Goal: avoid plaintext credentials in shell profiles or config files.
- [ ] Document secure credential handling patterns and threat model.
- [ ] Add configurable auth modes (interactive login vs secret-manager-backed).

## Phase 6 - Higher-Level Automation
- [ ] Workflow tools such as `tgc_game_scaffold`.
- [ ] Optional prepublish validation helper (`tgc_prepublish_check`).
- [ ] Additional component support beyond base card/deck flow.

## Not In Scope for Initial Releases
- Full UI/desktop frontend.
- Background daemon as a required runtime.
- Implicit auto-publish behavior without explicit user action.
