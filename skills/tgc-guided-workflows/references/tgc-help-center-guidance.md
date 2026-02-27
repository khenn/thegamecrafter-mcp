# TGC Help Center Guidance (Curated)

Use this file for practical guidance distilled from the TGC Help Center categories below:
- Getting Started
- Frequently Asked Questions
- File Preparation
- Game Editor
- Production
- Design Tools & Artwork

Primary catalog/index source:
- `references/tgc-help-center-catalog.md`
- `references/tgc-help-center-catalog.json`

## How To Use This Guidance
- Treat this as user-facing workflow guidance, not as an API contract.
- Prefer direct MCP mutations only where API support exists.
- If Help Center guidance conflicts with API behavior, report both and ask the user which path to follow.
- Always include the relevant Help Center article URL in user guidance for high-impact warnings.

## High-Impact Rules

### 1) IP and Content Legality
- Do not advise users to upload copyrighted/trademarked content they do not have rights to.
- If user intent appears risky, warn and point to IP guidance.
- Source:
  - https://help.thegamecrafter.com/article/9-intellectual-property
  - https://help.thegamecrafter.com/article/5-getting-started

### 2) Template and File Discipline
- Require product templates and exact image dimensions for component uploads.
- Prefer PNG over JPG for critical print assets.
- Remind users to keep critical content inside safe zones and backgrounds beyond cut lines.
- Source:
  - https://help.thegamecrafter.com/article/39-templates
  - https://help.thegamecrafter.com/article/42-utility-templates
  - https://help.thegamecrafter.com/article/5-getting-started

### 3) Color Expectations and Proofing
- Warn users that screen-to-print color will vary; color profile helps but is not perfect.
- Recommend proofing before ordering multiples or publishing.
- Source:
  - https://help.thegamecrafter.com/article/30-color-profile
  - https://help.thegamecrafter.com/article/196-color-filter
  - https://help.thegamecrafter.com/article/425-3d-box-viewer

### 4) Prototype-First Ordering
- Recommend ordering one copy first, review physical output, then iterate.
- Source:
  - https://help.thegamecrafter.com/article/429-how-to-order-your-game

### 5) Surfacing Decisions (UV/Linen)
- Surface UV/Linen options explicitly and mention cost impact.
- UV and linen applicability can vary by product type and sheet.
- Source:
  - https://help.thegamecrafter.com/article/169-uv-coating
  - https://help.thegamecrafter.com/article/178-linen-texture

### 6) Production and Fulfillment Expectations
- Explain queue-based production timelines and that estimated ship dates can change.
- Source:
  - https://help.thegamecrafter.com/article/94-production-queues
  - https://help.thegamecrafter.com/article/82-why-has-my-estimated-ship-date-changed

### 7) Downloadables and Embedded Games
- Download-only / print-and-play is a supported TGC workflow; in MCP use upload + game download attach.
- Embedded games are a TGC concept but currently unsupported as a dedicated mutation in this MCP.
- Source:
  - https://help.thegamecrafter.com/article/49-download-only-print-and-play-items
  - https://help.thegamecrafter.com/article/348-embedded-games

### 8) Component-Specific Production Notes
- Use help articles for production caveats and constraints for cards, boxes, dials, booklets, boards, etc.
- Source examples:
  - https://help.thegamecrafter.com/article/85-cards
  - https://help.thegamecrafter.com/article/83-boxes
  - https://help.thegamecrafter.com/article/87-dials
  - https://help.thegamecrafter.com/article/80-booklets
  - https://help.thegamecrafter.com/article/90-game-boards

## Recommended Agent Behavior
- If a user asks for “best practices,” “why did this print weird,” or “what should I do before ordering,” load this file and the catalog.
- Keep recommendations short and actionable:
  - issue
  - likely cause
  - next 1-3 fixes
  - source link
- Do not overwhelm users with long policy text; summarize and link out.

## Refresh Procedure
- Rebuild catalog from upstream Help Center with:
  - `cd code && npm run report:help-center-catalog`
- Review diff in `references/tgc-help-center-catalog.md`.
- Update this curated guidance when major Help Center changes appear.
