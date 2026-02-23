# Session: PDF Books Import Fix + First11 Validation

Date: 2026-02-23

## User Report
Prior large PDF tests created three broken games:
- blank/duplicate pages
- wrong page counts and ordering anomalies

Games deleted:
- `FCEF0CEA-10A0-11F1-A1F5-1087F591B138` (`tgcmcp-batch2-pdf-review-2026-02-23T10:18:26.900Z`)
- `3E894FBC-10A1-11F1-A1F5-C389F591B138` (`tgcmcp-md-rulebook-import-2026-02-23T10:20:16.352Z`)
- `EA10E49E-10A1-11F1-A86E-A397F2699619` (`tgcmcp-md-rulebook-import-2026-02-23T10:25:03.133Z`)

## Root Cause + Fix
TGC book page endpoints expect page artwork as `image_id`.
Our service was sending `face_id` for `createComponentPage`, causing blank/duplicate rendering behavior.

Code changes:
- `code/src/tgc/service.ts`
  - `createComponentPage` now sends `image_id`.
  - added optional `sequenceNumber` -> `sequence_number`.
- `code/src/mcp/handlers.ts`
  - added `sequenceNumber` to `tgc_component_page_create` schema/pass-through.
- `code/src/mcp/contract.ts`
  - exposed `sequenceNumber` in tool contract.

## Focused Validation Run (first 11 PDF pages)
Source PDF: `logs/MD_Rulebook_web.pdf`

Generated page images:
- `logs/batch2-pdf-sample/booklet_1575x2475/page-01.png ... page-11.png`
- `logs/batch2-pdf-sample/perfectbound_1725x2625/page-01.png ... page-11.png`
- blank: `logs/batch2-pdf-sample/perfectbound_1725x2625/blank-1725x2625.png`

Created game:
- `8574251A-10A5-11F1-A86E-DB42F2699619`
- `tgcmcp-md-rulebook-first11-2026-02-23T10:50:54.191Z`

Components:
- `MD Rulebook - Booklet`
  - component id: `87268DD0-10A5-11F1-B02A-B2403C541315`
  - pages: 10 (PDF pages 1..10)
- `MD Rulebook - PerfectBound`
  - component id: `8757E0EC-10A5-11F1-A86E-E442F2699619`
  - pages: 12 (PDF pages 1..11 + blank page 12)

Asset folder:
- `86F783C8-10A5-11F1-A1F5-6FBBF591B138`

## Skills / Agent Notes Updated
- `skills/tgc-guided-workflows/SKILL.md`
  - added guardrail: use `image_id` for book page artwork and set `sequenceNumber` explicitly.
- `context/AGENTS.md`
  - added default for book page creation mapping and ordering.

## Tooling
No additional package install required. Existing tools (`pdftoppm`) were sufficient.
