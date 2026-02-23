# Session: Claude MCP config example uses env vars

## Date
- 2026-02-23

## Goal
- Remove cleartext credential appearance from Claude MCP config example.

## Changes Made
- Updated `README.md` Claude MCP config example:
  - replaced inline credential placeholders with environment variable references (`${TGC_*}`).
- Added note clarifying that runtimes that inherit process environment can omit explicit `env` block.
