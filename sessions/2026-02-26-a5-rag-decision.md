# Session Note - 2026-02-26 - A5 RAG Decision

## Summary
Completed the A5 decision item for optional Help Center RAG.

## Decision
- Do not implement RAG in Release 1.
- Keep static references + curated guidance as primary approach.
- Use private VPS refresh workflow for periodic updates.

## Basis
- Current reference corpus remains lightweight and manageable.
- Skill progressive-disclosure design already prevents context overload.
- Additional infra complexity is not justified before release hardening.

## Revisit Conditions
- Increased misses on long-tail help queries.
- Static references become too large/noisy for reliable retrieval.
- Clear post-release need for semantic retrieval over rapidly changing docs.

## Files Updated
- `ROADMAP.md`
- `tools/tgc-help-knowledge-strategy.md`
