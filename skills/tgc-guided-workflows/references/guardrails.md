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
- For board-style components, also report safe-frame utilization and avoid low-utilization centered art unless user explicitly accepts it.
- Do not report success if required slot readback does not match intended file IDs.
- For dial components, enforce functional label alignment to indicator windows in assembled orientation; safe-zone-only pass is insufficient.

## Bulk Card Creation Resume Safety
For `tgc_deck_bulk_create_cards`:
- Default behavior is still append-only.
- Do not retry blind when `skipExisting` is not enabled.
- For rerun-safe recovery, prefer:
  - `tgc_deck_create` with `resumeIfExists=true`
  - `tgc_deck_bulk_create_cards` with `skipExisting=true`
- `skipExisting=true` only skips exact existing card matches by card fingerprint:
  - name
  - front/face id
  - back id
  - quantity
  - class number
- If deck identity or batch contents materially changed, do not resume into the old deck blindly; create a new target deck or reconcile differences first.
- Validate source-vs-target card totals before declaring success.
- Ensure per-card image field is mapped correctly (`frontFileId` / mapped API `face_id`).

## File Upload + Component Create Resume Safety
- `tgc_file_upload` does not currently provide safe server-side dedupe or lookup for reruns.
- If a prior upload already succeeded and you know the `fileId`, reuse that `fileId` in the follow-up component mutation instead of re-uploading.
- If upload state is unknown, re-upload intentionally and verify the returned `fileId`.
- For rerun-safe component recovery, prefer:
  - `tgc_component_create` with `resumeIfExists=true`
  - and an explicit `relationship` matching the target component family
- `resumeIfExists=true` only reuses an exact existing component match within that relationship scope, based on the provided fields.
- Do not guess the relationship path; if unsure, resolve it before using resume mode.

## Known API Behavior
- `tgc_part_create` can be permission-gated.
- If blocked, prefer linking existing parts with `tgc_gamepart_upsert`.
- Set-child traversal for set families uses `relationship=members`.
