# Session: Batch 2 PDF Rulebook Import Test

Date: 2026-02-23

## Goal
Validate Phase/Batch 2 printed-book workflows by importing `logs/MD_Rulebook_web.pdf` into two book components, with parity constraints:
- first component even page count
- last component odd page count with blank trailing page

## Source Asset
- PDF: `logs/MD_Rulebook_web.pdf`
- Converted page images reused from:
  - `logs/batch2-pdf-test/booklet_1575x2475/page-01.png` ... `page-46.png`
  - `logs/batch2-pdf-test/perfectbound_1725x2625/page-01.png` ... `page-46.png`
  - `logs/batch2-pdf-test/perfectbound_1725x2625/blank-1725x2625.png`

## Components Chosen
- `booklet` (`identity: LargeBooklet`) -> even page count (46)
- `perfectboundbook` (`identity: DigestPerfectBoundBook`) -> odd page count (47, trailing blank)

## Live Run Result
- Game: `EA10E49E-10A1-11F1-A86E-A397F2699619`
- Name: `tgcmcp-md-rulebook-import-2026-02-23T10:25:03.133Z`
- Asset folder: `EB5ABB4A-10A1-11F1-A86E-D097F2699619`
- Booklet component: `EB8C2D2E-10A1-11F1-A1F5-4692F591B138`
  - pages created: `46`
- Perfectbound component: `EBD919EA-10A1-11F1-B02A-A9953C541315`
  - pages created: `47` (includes blank page 47)

## Notes
- No additional local tool installation was required.
- Script used: `code/scripts/dev/test-batch2-pdf-rulebook.ts`
- Script updated to include progress logging and zero-padded page filename handling.
