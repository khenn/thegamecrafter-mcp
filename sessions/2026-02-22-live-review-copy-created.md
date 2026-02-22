# Session: Live ZCH Review Copy Created

Date: 2026-02-22

## Goal
Create a live, non-cleaned-up copy of `Zombicide Character Help` for user inspection, then wait for explicit cleanup confirmation.

## Actions Taken
1. Confirmed authenticated TGC context (`tgc_me`).
2. Continued from existing in-progress review game:
   - Game: `Zombicide Character Help - copy review 2026-02-22`
   - ID: `DF208064-101D-11F1-8061-F06C3C541315`
3. Created target decks in that game and copied `Complimentary` cards successfully (19).
4. `Heros` copy flow into that same game became inconsistent after retries and ended overfilled (`193` instead of `180`).
5. Created a fresh validated review copy using a one-off subproject script:
   - Game: `Zombicide Character Help - copy review 2 2026-02-22`
   - ID: `7C13999C-101E-11F1-8061-D0743C541315`
6. Verified validated copy deck counts:
   - `Complimentary`: 19
   - `Heros`: 180

## Notes
- Kept all created games in place per user request (no immediate cleanup).
- Temporary one-off helper scripts added under `subprojects/zch-copy-lab/` for this live exercise.
