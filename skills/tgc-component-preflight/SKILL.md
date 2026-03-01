---
name: tgc-component-preflight
description: Preflight component creation/update requests for TGC by validating dimensions, required assets, quantity bounds, slot completeness, and mutation safety before API calls.
---

# Skill: TGC Component Preflight

## Purpose
Validate a requested component workflow before mutation so the agent can prevent predictable TGC proofing errors, API failures, and duplicate/broken component creation.

## Use This Skill When
- The user asks to add, edit, or configure a TGC component.
- The request includes uncertain component options (finish, quantity, identity, page counts, side slots).
- The workflow requires a safe call order before a mutation.

## Inputs Required
- Target game or component context (name/id).
- Requested component family/type.
- Provided assets and desired quantity/options.

## Outputs Produced
- Preflight decision: proceed, block, or request missing inputs.
- Short list of missing/invalid fields with corrective options.
- Recommended mutation sequence (read checks, then write calls).

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets outside the active session.
- Do not publish user-local game specifics in reusable artifacts.
- Require explicit user confirmation before destructive actions.

## Workflow
1. Resolve target game/component context.
2. Validate dimensions, required assets, finish options, quantity bounds, and side/page/slot completeness.
3. If invalid or likely to warn/fail, stop and provide corrective options.
4. If valid, produce a mutation sequencing plan and execute only after required confirmations.

## Read Additional References Only As Needed
- Read `references/workflows.md` for preflight validation order and failure handling.
- Read `references/component-profiles.md` when resolving component-specific dimensions, slots, and product/help links.
