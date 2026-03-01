---
name: tgc-guided-workflows
description: Orchestrate The Game Crafter MCP workflows by routing user intent to focused skills, sequencing safe tool calls, and managing cross-workflow guardrails.
---

# Skill: TGC Guided Workflows

## Purpose
Use this skill as the orchestration router for safe TGC workflows over MCP tools with minimal back-and-forth and explicit preflight checks before mutations.

## Use This Skill When
- The user asks for TGC game creation/maintenance in natural language.
- The user asks for component setup, books/rulebooks, or game interrogation.
- The task requires multiple MCP calls with ordering and validation constraints.

## Inputs Required
- User intent and desired outcome.
- Target game/component context (name/id) when available.
- Missing required options only (ask minimally).

## Outputs Produced
- A short workflow plan (selected tools + order of operations).
- A validated mutation path or blocking feedback with corrective options.
- Post-mutation summary including key IDs and residual risks.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets outside active workflow output.
- Require explicit confirmation before destructive or publish-impacting actions.
- Do not publish user/game-specific content to public channels without explicit per-item approval.

## Core Defaults
- Ask only for missing required inputs.
- Resolve obvious context automatically (for example `designerId` via `tgc_designer_list`).
- Prefer the smallest valid sequence of tool calls.
- After each mutation, report what changed and key IDs.
- Route focused validation/execution to specialized skills where appropriate:
  - `tgc-component-preflight`
  - `tgc-book-rulebook-workflows`
  - `tgc-image-preflight-fit`
- Use event-driven feedback capture from `references/community-feedback.md`:
  - when non-trivial, new component-build learnings are discovered that are not already present in skills and would improve build accuracy, draft a GitHub issue proposal automatically,
  - show exact draft text to user and request explicit publication approval before creating the issue.
- For outcome-based requests without explicit component type, suggest 2-3 relevant implemented options, then wait for user selection.
  - if only one viable option remains, explain why alternatives were excluded and ask for explicit confirmation before create.
- For revisions to existing non-deck components, default to `tgc_component_update` (in-place) instead of creating a second component.
- For game-level surfacing changes, prefer:
  - `tgc_game_surfacing_get` for current state + option prompt context,
  - `tgc_game_surfacing_set` for validated updates.
  - If user intent does not specify UV/linen values, ask once for both values in one prompt.
- For readiness check and test reports, run game-level readiness/report helpers and summarize actionable next steps.
- For policy/process questions that are not pure API mechanics (file prep, proofing, production, queue timing), consult TGC Help Center references before answering.

## Delegation Contract (Required)
- Do not execute deep component checks in this router skill when a focused skill exists.
- Delegate by intent:
  - component options/required fields/mutation readiness -> `tgc-component-preflight`
  - book/rulebook optioning, page parity, sequencing -> `tgc-book-rulebook-workflows`
  - image safe-zone/bleed/trim/proof-fit remediation -> `tgc-image-preflight-fit`
- Preserve end-to-end continuity:
  - router selects skill and call order,
  - focused skill performs deep validation logic,
  - router summarizes outcomes and next actions.

## Preferences (Global)
```yaml
preferences:
  currency: USD
  feedback_contribution: true
```

Rules:
- Treat source TGC prices as USD.
- Always include currency code in displayed prices.
- If `preferences.currency` is not USD, convert from USD using a reliable FX source.
- If conversion fails or code is invalid, warn and fall back to USD.
- Respect `preferences.feedback_contribution` as the global toggle for issue-draft feedback behavior.

## Read Additional References Only As Needed
- Read `references/workflows.md` when executing game create/copy/interrogation flows.
- Read `references/skill-routing-map.md` when intent is ambiguous between router and focused skills.
- Read `references/guardrails.md` when handling retries, cleanup, non-idempotent calls, or test artifact control.
- Read `references/community-feedback.md` when evaluating/producing reusable learning issue drafts and publication approval flow.
- Read `references/tgc-help-center-guidance.md` when users need process/best-practice guidance.
- Read `references/tgc-help-center-catalog.md` when you need specific article links by topic.

## Skill Split Policy
Use this as the primary orchestration skill. Create additional skills only when a distinct workflow family emerges (different triggers, dependency profile, or safety posture), for example dedicated art-processing or publish/pricing pipelines.
