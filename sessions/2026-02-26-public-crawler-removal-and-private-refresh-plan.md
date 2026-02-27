# Session Note - 2026-02-26 - Public Crawler Removal and Private Refresh Plan

## Summary
Removed public crawler tooling from repository and moved automation planning to a private roadmap.

## Public Repo Changes
- Removed `code/scripts/crawl-tgc-help-center.mjs` from git.
- Removed npm script `report:help-center-catalog` from `code/package.json`.
- Updated `tools/tgc-help-knowledge-strategy.md` to reflect:
  - public repo keeps static references only,
  - periodic refresh automation should run privately.

## Private Planning
- Created private roadmap in gitignored path:
  - `logs/private-vps-help-refresh-roadmap.md`
- Roadmap covers VPS service setup, safety gates, delivery workflow, and optional future RAG.
