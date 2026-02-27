# TGC Help Content Knowledge Strategy

## Objective
Use TGC Help Center content to improve agent guidance quality without overloading model context.

## Current Implementation (Now)
- Static catalog + curated references in `skills/tgc-guided-workflows/references/`:
  - `tgc-help-center-catalog.md`
  - `tgc-help-center-catalog.json`
  - `tgc-help-center-guidance.md`
- Triggered, on-demand loading via `SKILL.md` reference rules.
- Public repo does not include automated crawling/scraping scripts.

Why this first:
- No infra overhead.
- Works reliably with Codex/Claude skill patterns.
- Easy to review and version in git.

## When to Introduce RAG
Adopt optional RAG only if one or more are true:
- static reference files become too large/noisy for practical agent retrieval,
- response quality degrades due to missed long-tail topics,
- you need semantic Q&A over all Help Center content with frequent updates.

## Proposed RAG Architecture (Optional, Later)
- Source ingestion:
  - crawl category/article URLs,
  - normalize article content to markdown/text,
  - chunk by headings/paragraph windows.
- Vector store:
  - Supabase Postgres + pgvector.
- Retriever service:
  - lightweight API (self-hosted on VPS) with endpoints:
    - `POST /index` (admin/update)
    - `POST /query` (semantic retrieval)
- MCP integration:
  - add a retrieval tool (for example `tgc_help_search`) that returns:
    - top chunks,
    - source URLs,
    - timestamps.

## Guardrails for RAG
- Do not store user uploads, local project files, or private game data in the shared RAG index.
- Index only public TGC help content and project-authored guidance files.
- Preserve source URLs in all retrieval responses.

## Private Refresh Operations
- Run automated help-content refresh outside this public repository (private VPS service or private repo).
- Commit only reviewed, static reference outputs to this public repo.
- Avoid shipping generic scraping automation publicly unless usage policy is explicitly confirmed.

## Recommendation
- Keep static references as default for Goal A and Release 1.
- Use private VPS refresh automation for periodic updates.
- Re-evaluate after Release 1 using real user feedback.
- If needed, implement RAG as an optional Goal B/Deferred enhancement.
