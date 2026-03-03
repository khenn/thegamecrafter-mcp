# Shared Fit Contract (Book Workflows)

Book/rulebook page import must follow the shared fit contract used across TGC workflows.

## Required checks per page
- fit intent selected and recorded,
- safe/gutter clearances computed,
- risk flags emitted,
- decision status (`pass | fail | needs_confirmation`).

## Hard gates
- If page status is `fail`, do not upload that page.
- If status is `needs_confirmation`, request user approval before upload.
- After upload, verify intended page file binding persisted.

## Book-specific
- Honor parity constraints before create.
- For bound products, apply parity-aware gutter margins.
- Text-heavy pages default to safe/contain-fit unless user explicitly requests higher trim risk.
