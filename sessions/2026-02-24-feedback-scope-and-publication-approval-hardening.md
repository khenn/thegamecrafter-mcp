# Session: Feedback Scope + Publication Approval Hardening

Date: 2026-02-24

## Objective
Tighten contribution publishing rules to prevent any user/game/local leakage and require explicit approval of exact content before public posting.

## Changes
- Updated `context/AGENTS.md` Community Feedback Mode with:
  - strict capture scope limited to reusable TGC interface learnings,
  - hard exclusions for user-specific game/IP content, local environment details, PII, and secrets,
  - anonymization/masking requirement when context is needed,
  - mandatory second consent gate before publish (show exact text, ask permission, publish only on explicit approval),
  - explicit separation between startup opt-in and per-publication approval.
- Updated `skills/tgc-guided-workflows/references/community-feedback.md` with:
  - TGC-interface-only scope,
  - `Hard Exclusions (Never Publish)` section,
  - required publication approval gate,
  - stronger reusable/generalized wording in redaction rules.
- Updated `skills/tgc-guided-workflows/SKILL.md` to require the publication approval gate for feedback publishing.
- Updated `README.md` feedback section to reflect:
  - final per-issue approval requirement,
  - TGC-interface-only publication scope.

## Expected Behavior
- Session startup opt-in still controls whether feedback mode is enabled.
- Even when enabled, agent must present exact issue text and get explicit approval before posting.
- Feedback should remain generalized and reusable, with no exposure of user IP, PII, or local settings.
