# Session Note - 2026-02-26 - Help Center Crawl and Guidance Seed

## Summary
Added a crawler-backed TGC Help Center knowledge seed and wired agent/skill references for process guidance.

## Implemented
- Added crawler script:
  - `code/scripts/crawl-tgc-help-center.mjs`
- Added npm script:
  - `npm run report:help-center-catalog`
- Generated catalog references:
  - `skills/tgc-guided-workflows/references/tgc-help-center-catalog.json`
  - `skills/tgc-guided-workflows/references/tgc-help-center-catalog.md`
- Added curated guidance:
  - `skills/tgc-guided-workflows/references/tgc-help-center-guidance.md`
- Updated skill and agent instructions to consult help-center references for non-API process guidance.
- Updated roadmap Goal A5 with in-progress help-content integration track.
- Added strategy doc for optional future RAG:
  - `tools/tgc-help-knowledge-strategy.md`

## Crawl Scope
Seeded categories provided by user:
- Getting Started
- Frequently Asked Questions
- File Preparation
- Game Editor
- Production
- Design Tools & Artwork

## Crawl Result
- 69 unique articles indexed.
- Includes pagination handling and request pacing/retry for rate limiting.

## Notes
- Static references are now the primary strategy for Release 1.
- Optional Supabase/pgvector RAG remains a later decision based on observed need.
