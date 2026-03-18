# Session: Claude Live Cleanup Sweep Hardening

Date: 2026-03-17

## Goal
- Ensure Claude live regression tests clean up their disposable TGC games automatically.
- Prevent active leftover `claude-live-*` games from accumulating between runs.

## Findings
- `tgc_game_delete` removes live test games from the active account state, but TGC keeps deleted games in a trashed state for some time.
- The downstream Claude live fixtures were already asking Claude to delete the sandbox game, but interrupted or timed-out runs could still leave active leftovers behind.
- During the first runner verification pass, the final cleanup sweep hit a transient TGC API reachability failure even though all live cases passed.

## Changes
- Updated [code/scripts/dev/run-claude-regression.ts](/home/khenny/tgcmcp/code/scripts/dev/run-claude-regression.ts) to:
  - derive disposable game names from live fixtures,
  - sweep matching active sandbox games before the suite starts,
  - sweep again after the suite finishes,
  - fail the run if any active disposable games remain,
  - retry cleanup verification on transient TGC API failures.
- Updated [tools/claude-a5-regression-plan.md](/home/khenny/tgcmcp/tools/claude-a5-regression-plan.md) with the pre/post sweep requirement and soft-delete semantics.
- Updated [README.md](/home/khenny/tgcmcp/README.md) troubleshooting notes to clarify that deleted TGC test games may remain visible as trashed entries for a while.

## Live Account Cleanup
- Deleted the remaining active disposable `claude-live-*` games seen on the designer account.
- Confirmed the remaining visible `claude-live-*` entries are trashed, not active.

## Verification
- `npm --prefix code run claude:test:live`
- Green baseline with cleanup verification:
  - `/home/khenny/tgcmcp/logs/claude/regression-2026-03-17T14-48-28.367Z/summary.json`
  - pre-run sweep: `remaining_active=0`
  - post-run sweep: `remaining_active=0`
