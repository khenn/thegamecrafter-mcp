# Session: Massive Darkness Full Rulebook Import

Date: 2026-02-23

## Cleanup Requested
Deleted prior test games (soft-delete on TGC):
- `8574251A-10A5-11F1-A86E-DB42F2699619`
- `EA10E49E-10A1-11F1-A86E-A397F2699619`

## New Build
Created game:
- Name: `Massive Darkness`
- Game ID: `BAF4D9D8-10A9-11F1-A1F5-126DF591B138`

Added full rulebook from `logs/MD_Rulebook_web.pdf` as:
- Component: `DigestPerfectBoundBook`
- Name: `MD Rulebook - PerfectBound`
- Component ID: `BC2F44D2-10A9-11F1-A86E-0173F2699619`
- Page count created: `46`
- Asset folder: `BBFE30C2-10A9-11F1-B02A-6C713C541315`

## Preflight Decision
PDF pages = 46.
- `LargeBooklet` unsuitable for full book because max page count is 40 and pages must be in multiples of 4.
- `DigestPerfectBoundBook` supports 40-200 pages; 46 is valid and even.

Reference URLs:
- `https://www.thegamecrafter.com/make/products/LargeBooklet`
- `https://www.thegamecrafter.com/api/tgc/products/LargeBooklet`
- `http://help.thegamecrafter.com/article/80-booklets`
- `https://www.thegamecrafter.com/make/products/DigestPerfectBoundBook`
- `https://www.thegamecrafter.com/api/tgc/products/DigestPerfectBoundBook`
- `https://help.thegamecrafter.com/article/468-setting-up-a-spine`
