# Guardrails Reference

## Mutation Safety
- Prefer explicit failures over silent retries.
- Avoid destructive actions unless requested.
- For test/probe runs, use disposable naming and always plan cleanup.
- TGC delete is soft delete (`trashed: 1`).
- For revisions to existing components, default to in-place update behavior when supported; only create a duplicate when user explicitly asks for a variant/copy.

## Feedback Publishing Safety
- Never publish credentials, tokens, session IDs, or private file paths.
- Redact usernames/emails unless the user explicitly asks to include them.
- Keep issue content technical and reproducible:
  - component/workflow,
  - observed behavior,
  - expected behavior,
  - suggested guardrail/skill update.
- If uncertain whether content is sensitive, keep it in local pending note form and ask once before publication.

## Print-Safe Upload Guardrail
- Never auto-upload text-heavy PDF/image pages that are edge-fit to full bleed.
- Use contain-fit render into a safe frame before upload.
- Use explicit fit intent (`safe`, `near-trim`, `full-bleed`) and default to `safe` when unspecified.
- Default fallback safe frame:
  - non-bound products: outer inset >=7%
  - bound products: outer inset >=7%, binding-side inset >=12%
- For bound books, apply parity-aware gutter inset:
  - odd pages: extra inset on left
  - even pages: extra inset on right
- If proof/clipping risk is detected, stop and offer:
  1. auto-remediation (re-render with larger safe insets), or
  2. user-provided revised source pages.
- Before upload, provide concise fit metrics (target, bounds, clearances, residual risk).

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
