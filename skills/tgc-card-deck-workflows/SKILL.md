---
name: tgc-card-deck-workflows
description: Guide TGC deck selection and card workflow setup for poker, tarot, foil, clear, and specialty decks with back-image, randomizer, and packaging-aware preflight.
---

# Skill: TGC Card and Deck Workflows

## Purpose
Guide safe, minimal-context creation and update of TGC deck/card workflows by helping the agent choose the right deck identity, validate back-image strategy, and surface foil/clear/randomizer caveats before mutation.

## Use This Skill When
- The user wants a card deck, tarot deck, poker deck, foil deck, clear deck, or other card component.
- The workflow includes choosing a deck size/shape, creating a deck, adding cards, or deciding whether to use shared or unique back images.
- The user asks about randomizer/class behavior, foil card design, or packaging-aware deck choice.

## Inputs Required
- Target game context.
- Desired deck identity or card size/shape when known.
- Card art plan:
  - shared back vs unique backs,
  - card fronts available,
  - foil/clear intent when relevant.

## Outputs Produced
- Deck recommendation set when identity is unspecified.
- Preflight decision: `proceed`, `block`, or `needs_input`.
- Deck/card mutation sequence.
- Packaging-aware next-step guidance when deck choice implies likely packaging follow-up.

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Warn before workflows that imply randomized decks or non-standard stock behavior.
- Require explicit confirmation before destructive or publish-impacting actions.
- Require explicit user confirmation before public sharing/publishing actions.

## Workflow
1. Resolve whether the task is deck optioning, deck create, card import/create, or deck revision.
2. When deck identity is unspecified, recommend at most 2-3 viable deck identities with concise tradeoffs.
3. Validate deck art strategy:
   - shared back vs unique backs,
   - foil deck or clear deck constraints,
   - randomizer or class-number implications when relevant.
4. Route fit or trim concerns to `tgc-image-preflight-fit`.
5. Execute deck create before card create, and use bulk card creation when the user already has a batch-ready card set.
6. When resuming an interrupted deck-import flow, prefer rerun-safe options:
   - `tgc_deck_create` with `resumeIfExists=true`
   - `tgc_deck_bulk_create_cards` with `skipExisting=true`
7. After mutation, verify deck/card persistence and suggest packaging follow-up when deck choice likely drives the next decision.

## Read Additional References Only As Needed
- Read `references/workflows.md` for deck recommendation logic, randomizer cautions, and create/update sequencing.
- Read `references/component-profiles.md` when resolving deck identity details, dimensions, foil/clear rules, and current TGC help links.
