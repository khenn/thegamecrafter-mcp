# Session Log - 2026-02-22 - Box Finish Linen Test

## Summary
Attempted to set `surfacing_treatment = Linen Finish` for all box packaging components in game `95787064-1033-11F1-9676-457BF2699619`.

## Result
Accepted + persisted:
- `boxtopgloss` (`782446C4-1037-11F1-AB9F-65A3F591B138`) -> `Linen Finish`
- `twosidedboxgloss` (`78C7CF38-1037-11F1-9676-2AAAF2699619`) -> `Linen Finish`

No persisted `surfacing_treatment` field after update attempt:
- `tuckbox` (`774003BA-1037-11F1-AB9F-6FA3F591B138`)
- `hookbox` (`77849FB6-1037-11F1-8061-CF263C541315`)
- `twosidedbox` (`77D1241C-1037-11F1-9676-48AAF2699619`)
- `boxtop` (`786CF748-1037-11F1-8061-D6263C541315`)

## Interpretation
For this API surface, linen finish appears supported on gloss box families and not exposed for non-gloss families.
