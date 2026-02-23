# Guardrails Reference

## Mutation Safety
- Prefer explicit failures over silent retries.
- Avoid destructive actions unless requested.
- For test/probe runs, use disposable naming and always plan cleanup.
- TGC delete is soft delete (`trashed: 1`).

## Non-Idempotent Bulk Card Creation
For `tgc_deck_bulk_create_cards`:
- Treat as append-only and non-idempotent.
- Do not retry blind.
- Do not resume into partially populated decks.
- If interrupted, create a fresh target deck/game and rerun from zero.
- Validate source-vs-target card totals before declaring success.
- Ensure per-card image field is mapped correctly (`frontFileId` / mapped API `face_id`).

## Known API Behavior
- `tgc_part_create` can be permission-gated.
- If blocked, prefer linking existing parts with `tgc_gamepart_upsert`.
- Set-child traversal for set families uses `relationship=members`.
