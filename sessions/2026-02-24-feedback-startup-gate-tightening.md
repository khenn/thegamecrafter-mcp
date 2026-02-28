# Session: Feedback Startup Gate Tightening

Date: 2026-02-24

## Objective
Make contribution opt-in behavior deterministic so agents always run a startup check, remember preference, and avoid repeated prompts.

## Changes
- Updated `context/TGCAGENT.md` Community Feedback Mode to a mandatory startup gate with explicit decision order:
  1. global `preferences.feedback_contribution`
  2. saved `.tgc-feedback/preferences.json`
  3. one-time startup prompt only if needed
  4. persist user choice
- Updated `skills/tgc-guided-workflows/references/community-feedback.md` with the same deterministic startup contract.
- Updated `skills/tgc-guided-workflows/SKILL.md` to explicitly require running the startup gate before normal task work.
- Updated `README.md` feedback section with the same decision order for both humans and LLMs.

## Expected Result
- New sessions should either:
  - skip feedback mode (global off),
  - silently apply saved opt-in/opt-out,
  - or ask exactly once at startup if no saved preference exists.
