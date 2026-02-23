---
name: tgc-guided-workflows
description: Guided workflows and guardrails for The Game Crafter MCP usage, including game creation, component preflight checks, print-safe asset handling, and safe mutation sequencing.
---

# Skill: TGC Guided Workflows

## Purpose
Use this skill to run safe, guided TGC workflows over MCP tools with minimal back-and-forth and explicit preflight checks before mutations.

## Use This Skill When
- The user asks for TGC game creation/maintenance in natural language.
- The user asks for component setup, books/rulebooks, or game interrogation.
- The task requires multiple MCP calls with ordering and validation constraints.

## Core Defaults
- Ask only for missing required inputs.
- Resolve obvious context automatically (for example `designerId` via `tgc_designer_list`).
- Prefer the smallest valid sequence of tool calls.
- After each mutation, report what changed and key IDs.
- For outcome-based requests without explicit component type, suggest 2-3 relevant implemented options, then wait for user selection.
  - if only one viable option remains, explain why alternatives were excluded and ask for explicit confirmation before create.

## Component Preflight (Required)
Before any component mutation:
- Resolve product metadata and user-facing references.
- Validate request against dimensions, page rules, min/max bounds, finish support, and required assets.
- If request is likely to fail or warn, stop and provide corrective options.
- For user-facing responses, include product/help/video links; include API links only if requested.

## Print-Safe Rules (Required)
- Keep critical content inside safe zones; avoid trim/bleed for essential text.
- For bound products, reserve extra gutter margin.
- If explicit template-safe zones are unavailable, use conservative defaults:
  - outer inset >= 7%
  - binding-side inset >= 12%
- For PDF/image imports of text-heavy pages:
  - use contain-fit (not full-bleed fit) and preserve aspect ratio,
  - center content in a safe frame before export,
  - apply parity-aware gutter inset for bound books:
    - odd pages: extra inset on left edge,
    - even pages: extra inset on right edge.
- If clipping risk is detected before upload, warn and offer auto-remediation by re-rendering with larger insets.

## Preferences (Global)
```yaml
preferences:
  currency: USD
```

Rules:
- Treat source TGC prices as USD.
- Always include currency code in displayed prices.
- If `preferences.currency` is not USD, convert from USD using a reliable FX source.
- If conversion fails or code is invalid, warn and fall back to USD.

## Read Additional References Only As Needed
- Read `references/workflows.md` when executing game create/copy/interrogation flows.
- Read `references/guardrails.md` when handling retries, cleanup, non-idempotent calls, or test artifact control.
- Read `references/component-profiles.md` when preflighting or recommending supported components.

## Skill Split Policy
Use this as the primary orchestration skill. Create additional skills only when a distinct workflow family emerges (different triggers, dependency profile, or safety posture), for example dedicated art-processing or publish/pricing pipelines.
