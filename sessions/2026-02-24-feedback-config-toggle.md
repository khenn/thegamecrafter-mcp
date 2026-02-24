# 2026-02-24 - Feedback Mode Global Toggle

## Request
Add a global config setting (similar to currency) so local users can disable community feedback contribution mode. Default should remain enabled.

## Changes
- Updated `context/AGENTS.md` preferences:
  - added `preferences.feedback_contribution: true`.
- Added behavior rules:
  - when `preferences.feedback_contribution` is `false`, skip feedback prompt/capture/publish workflow entirely.
- Updated skill reference:
  - `skills/tgc-guided-workflows/references/community-feedback.md` now explicitly gates workflow on the new preference.
- Updated README Agent section:
  - notes that `AGENTS.md` has configurable settings under `## Preferences (Global)`.
  - includes high-level guidance that users (or their LLM) can update these settings.

## Outcome
Users can disable feedback contribution mode locally without changing source behavior for other users. Default remains on.
