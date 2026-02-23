# Session: Component-Intelligence Preflight (Books Seed)

Date: 2026-02-23

## Goal
Embed component-specific production guidance into agent/skills behavior so book creation requests are validated and guided before mutation.

## Source Data Collected
Authoritative metadata endpoints used:
- `https://www.thegamecrafter.com/api/tgc/products/LargeBooklet`
- `https://www.thegamecrafter.com/api/tgc/products/DigestPerfectBoundBook`

Referenced public pages:
- `https://www.thegamecrafter.com/make/products/LargeBooklet`
- `https://www.thegamecrafter.com/make/products/DigestPerfectBoundBook`
- `http://help.thegamecrafter.com/article/80-booklets`
- `https://help.thegamecrafter.com/article/468-setting-up-a-spine`

## Key Rules Added
- `LargeBooklet`:
  - image size `1575x2475`
  - saddle-stitch 4-up rule (page count should be divisible by 4)
  - max page count `40`
  - preflight warns and offers blank-page padding when invalid
- `DigestPerfectBoundBook`:
  - image size `1725x2625`
  - min page count `40`, max `200`
  - odd page totals warned; offer blank-page padding for even parity
  - supports UV and linen on covers

## Files Updated
- `AGENTS.md`
- `context/AGENTS.md`
- `skills/tgc-guided-workflows/SKILL.md`
- `ROADMAP.md`
- `tools/tgc-gap-closure-plan.md`

## Planning/Roadmap Impact
- Added requirement that each new component family must include:
  - source URL capture (`make/products`, `api/tgc/products`, help URL)
  - preflight validation rules
  - warning/correction prompt behavior before create calls

