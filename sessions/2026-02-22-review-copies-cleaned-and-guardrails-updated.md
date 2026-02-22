# Session: Review Copies Cleanup + Bulk Copy Guardrails

Date: 2026-02-22

## Cleanup Per User Request
Deleted both temporary review-copy games, leaving original untouched:
- Deleted: `DF208064-101D-11F1-8061-F06C3C541315` (`Zombicide Character Help - copy review 2026-02-22`)
- Deleted: `7C13999C-101E-11F1-8061-D0743C541315` (`Zombicide Character Help - copy review 2 2026-02-22`)
- Not deleted: original `Zombicide Character Help`

## Pitfall Captured
Observed overfill risk when copy run is interrupted/retried:
- `tgc_deck_bulk_create_cards` behaves append-only/non-idempotent.
- Retrying or resume-on-partial-target can duplicate cards.

## Policy Updates
Updated:
- `AGENTS.md`
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/SKILL.md`

New guidance requires:
- no resume into partially populated target decks,
- fresh-target restart after interruption,
- source-vs-target per-deck count validation before success.
