# TGC MCP Tool Contract v1

## Why Contract-First
Locking the MCP contract first prevents churn in prompts, tests, and clients that consume this server. The implementation can evolve behind stable tool names and schemas.

## Design Decisions
- Transport: `stdio` first for Codex/CLI compatibility.
- Auth model: explicit login tool, with optional env defaults.
- Session handling: in-memory by default (safe, simple), no disk persistence in v1.
- Output model: concise structured JSON payloads with explicit `ok`, `data`, `error` shape.
- Safety: strict input schemas, bounded pagination, and request pacing limits.

## Response Envelope (All Tools)
All tools return a JSON object with this structure:
- `ok`: boolean
- `data`: object | null
- `error`: object | null

Error object shape:
- `code`: string
- `message`: string
- `details`: object | null

## v1 Tool Surface

1. `tgc_auth_login`
- Purpose: Create API session via credentials/API key.
- Input:
  - `username` (string, optional if env configured)
  - `password` (string, optional if env configured)
  - `apiKeyId` (string, optional if env configured)
- Output data:
  - `sessionId` (string)
  - `userId` (string)

2. `tgc_auth_logout`
- Purpose: End active API session.
- Input: `{}`
- Output data:
  - `loggedOut` (boolean)

3. `tgc_me`
- Purpose: Return active user context.
- Input: `{}`
- Output data:
  - `user` (object)

4. `tgc_designer_list`
- Purpose: List designers available to authenticated user.
- Input:
  - `page` (integer, default 1, min 1, max 200)
  - `limit` (integer, default 20, min 1, max 100)
- Output data:
  - `items` (array)
  - `page` (integer)
  - `limit` (integer)

5. `tgc_game_create`
- Purpose: Create a game.
- Input:
  - `name` (string)
  - `designerId` (string)
  - `description` (string, optional)
  - `minPlayers` (integer, optional)
  - `maxPlayers` (integer, optional)
  - `playTimeMinutes` (integer, optional)
- Output data:
  - `game` (object)

6. `tgc_game_update`
- Purpose: Update game metadata.
- Input:
  - `gameId` (string)
  - `patch` (object, required)
- Output data:
  - `game` (object)

7. `tgc_game_get`
- Purpose: Fetch one game by ID.
- Input:
  - `gameId` (string)
  - `include` (array of strings, optional)
- Output data:
  - `game` (object)

8. `tgc_game_copy`
- Purpose: Copy an existing game.
- Input:
  - `gameId` (string)
  - `name` (string, optional)
- Output data:
  - `game` (object)

9. `tgc_game_publish`
- Purpose: Publish a game.
- Input:
  - `gameId` (string)
- Output data:
  - `published` (boolean)
  - `game` (object)

10. `tgc_game_unpublish`
- Purpose: Unpublish a game.
- Input:
  - `gameId` (string)
- Output data:
  - `unpublished` (boolean)
  - `game` (object)

11. `tgc_folder_create`
- Purpose: Create an asset folder.
- Input:
  - `name` (string)
  - `parentFolderId` (string, optional)
- Output data:
  - `folder` (object)

12. `tgc_file_upload`
- Purpose: Upload a file to TGC.
- Input:
  - `path` (string, local path)
  - `folderId` (string, optional)
  - `name` (string, optional)
- Output data:
  - `file` (object)

13. `tgc_deck_create`
- Purpose: Create a deck component.
- Input:
  - `name` (string)
  - `gameId` (string)
  - `cardCount` (integer, optional)
- Output data:
  - `deck` (object)

14. `tgc_card_create`
- Purpose: Create a card inside a deck.
- Input:
  - `deckId` (string)
  - `name` (string)
  - `frontFileId` (string)
  - `backFileId` (string, optional)
- Output data:
  - `card` (object)

15. `tgc_deck_bulk_create_cards`
- Purpose: Bulk card create for a deck.
- Input:
  - `deckId` (string)
  - `cards` (array, min 1, max 200)
- Output data:
  - `createdCount` (integer)
  - `cards` (array)

16. `tgc_part_create`
- Purpose: Create a game part reference.
- Input:
  - `gameId` (string)
  - `name` (string)
  - `quantity` (integer, min 1)
- Output data:
  - `part` (object)

17. `tgc_gamepart_upsert`
- Purpose: Link/update component quantity within game parts.
- Input:
  - `gameId` (string)
  - `partId` (string)
  - `componentType` (string)
  - `componentId` (string)
  - `quantity` (integer, min 1)
- Output data:
  - `gamePart` (object)

18. `tgc_gamedownload_create`
- Purpose: Generate downloadable game package.
- Input:
  - `gameId` (string)
- Output data:
  - `download` (object)

19. `tgc_game_bulk_pricing_get`
- Purpose: Fetch pricing for multiple games.
- Input:
  - `gameIds` (array of string, min 1, max 50)
- Output data:
  - `prices` (array)

20. `tgc_game_cost_breakdown_get`
- Purpose: Cost details for a game.
- Input:
  - `gameId` (string)
- Output data:
  - `cost` (object)

21. `tgc_tgc_products_list`
- Purpose: List TGC product SKUs/components for compatibility checks.
- Input:
  - `page` (integer, default 1, min 1, max 200)
  - `limit` (integer, default 50, min 1, max 100)
  - `activeOnly` (boolean, default true)
- Output data:
  - `items` (array)
  - `page` (integer)
  - `limit` (integer)

## Non-Goals for v1
- No long-lived credential storage on disk.
- No automatic browser-driven SSO.
- No UI layer; CLI/MCP-only.

## v1.1 Candidates
- `tgc_game_scaffold`
- `tgc_deck_from_image_grid`
- `tgc_prepublish_check`
