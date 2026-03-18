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
- Refresh and verification should happen via a private/manual review workflow, then only reviewed static outputs should be committed here.

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

## Phase 1 Refresh Policy (A5)
- Treat `GET /api/tgc/products` as the canonical catalog inventory and identity list.
- Treat TGC Help Center articles, TGC product pages, and product API pages as the canonical user-guidance source set.
- Refresh in this order:
  1. catalog identities and categories,
  2. cross-family help articles (templates, UV, linen, 3D viewer, proofing/process guidance),
  3. family-specific help articles,
  4. identity-level fallbacks where no direct article exists.
- Record refresh date in generated artifacts.
- Preserve stable static references in git; do not depend on live retrieval during normal agent execution.
- When a source cannot be refreshed automatically in public repo workflows, capture the missing refresh as a documented warning rather than silently assuming freshness.

## Minimal-context guidance rule
- `context/TGCAGENT.md` should contain only orchestration behavior, proactive guidance posture, and delegation rules.
- `skills/tgc-guided-workflows` should load broad process references only when needed.
- Component-family skills should own deep component facts and links.
- Cross-family fit/proof rules should stay centralized so family files can stay short.

## Source freshness snapshot
- Phase 1 refreshed against current live TGC Help Center and product references on `2026-03-12`.
- This snapshot is an audit marker, not proof that every article body was re-imported into local generated files on the same day.
- Follow-up work should add generated freshness reporting so stale source sets are visible in coverage outputs.

## Recommendation
- Keep static references as default for Goal A and Release 1.
- Use private VPS refresh automation for periodic updates.
- Re-evaluate after Release 1 using real user feedback.
- If needed, implement RAG as an optional Goal B/Deferred enhancement.

## Decision Snapshot (2026-02-26)
- Outcome: **Do not implement RAG in Release 1**.
- Basis:
  - current static reference footprint is small and practical,
  - progressive disclosure loading in skills is already in place,
  - quality improvements can continue via curated references without extra infra.
- Revisit trigger:
  - missed-answer rate rises on long-tail help topics, or
  - static references become too large/noisy for reliable retrieval in normal sessions.
