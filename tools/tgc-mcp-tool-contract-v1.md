# TGC MCP Tool Contract v1

## Why Contract-First
Locking the MCP contract first prevents churn in prompts, tests, and clients that consume this server. The implementation can evolve behind stable tool names and schemas.

## Design Decisions
- Transport: `stdio` first for Codex/CLI compatibility.
- Auth model: explicit login tool, with optional env defaults.
- Session handling: in-memory by default (safe, simple), no disk persistence in v1.
- Output model: concise structured JSON payloads with explicit `ok`, `data`, `error` shape.
- Safety: strict input schemas, bounded pagination, and request pacing limits.
- Environment naming: `TGC_PUBLIC_API_KEY_ID` is the canonical variable for the TGC public key ID.

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

Implemented addition:
- `tgc_game_list`
  - Purpose: list games available to the authenticated user.
  - Input:
    - `page` (integer, default 1, min 1, max 200)
    - `limit` (integer, default 20, min 1, max 100)
    - `designerId` (string, optional)
  - Output data:
    - `items` (array)
    - `page` (integer)
    - `limit` (integer)

Implemented additions (read/interrogation primitives):
- `tgc_game_decks_list`
  - Purpose: list decks attached to a game.
  - Input:
    - `gameId` (string)
    - `page` (integer, default 1, min 1, max 200)
    - `limit` (integer, default 20, min 1, max 100)
  - Output data:
    - `items` (array)
    - `page` (integer)
    - `limit` (integer)
- `tgc_deck_cards_list`
  - Purpose: list cards inside a deck.
  - Input:
    - `deckId` (string)
    - `page` (integer, default 1, min 1, max 200)
    - `limit` (integer, default 20, min 1, max 100)
  - Output data:
    - `items` (array)
    - `page` (integer)
    - `limit` (integer)
- `tgc_game_gameparts_list`
  - Purpose: list gamepart links for a game.
  - Input:
    - `gameId` (string)
    - `page` (integer, default 1, min 1, max 200)
    - `limit` (integer, default 20, min 1, max 100)
  - Output data:
    - `items` (array)
    - `page` (integer)
    - `limit` (integer)
- `tgc_deck_get`
  - Purpose: fetch one deck by ID.
  - Input:
    - `deckId` (string)
  - Output data:
    - `deck` (object)
- `tgc_card_get`
  - Purpose: fetch one card by ID.
  - Input:
    - `cardId` (string)
  - Output data:
    - `card` (object)
- `tgc_part_get`
  - Purpose: fetch one part by ID.
  - Input:
    - `partId` (string)
  - Output data:
    - `part` (object)
- `tgc_file_get`
  - Purpose: fetch one file by ID.
  - Input:
    - `fileId` (string)
  - Output data:
    - `file` (object)
- `tgc_file_references_get`
  - Purpose: list references to a file.
  - Input:
    - `fileId` (string)
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
  - Status: implemented

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

9. `tgc_game_delete`
- Purpose: Delete an existing game.
- Input:
  - `gameId` (string)
- Output data:
  - `deleted` (boolean)

10. `tgc_game_publish`
- Purpose: Publish a game.
- Input:
  - `gameId` (string)
- Output data:
  - `published` (boolean)
  - `game` (object)

11. `tgc_game_unpublish`
- Purpose: Unpublish a game.
- Input:
  - `gameId` (string)
- Output data:
  - `unpublished` (boolean)
  - `game` (object)

12. `tgc_folder_create`
- Purpose: Create an asset folder.
- Input:
  - `name` (string)
  - `parentFolderId` (string, optional)
- Output data:
  - `folder` (object)
  - Status: implemented

13. `tgc_file_upload`
- Purpose: Upload a file to TGC.
- Input:
  - `path` (string, local path)
  - `folderId` (string, optional)
  - `name` (string, optional)
- Output data:
  - `file` (object)
  - Status: implemented

14. `tgc_deck_create`
- Purpose: Create a deck component.
- Input:
  - `name` (string)
  - `gameId` (string)
  - `identity` (string, optional; defaults to `PokerDeck`)
  - `quantity` (integer, optional)
  - `backFileId` (string, optional)
  - `hasProofedBack` (boolean, optional)
  - `cardCount` (integer, optional, deprecated alias)
- Output data:
  - `deck` (object)
  - Status: implemented

15. `tgc_card_create`
- Purpose: Create a card inside a deck.
- Input:
  - `deckId` (string)
  - `name` (string)
  - `frontFileId` (string)
  - `backFileId` (string, optional)
- Output data:
  - `card` (object)
  - Status: implemented

16. `tgc_deck_bulk_create_cards`
- Purpose: Bulk card create for a deck.
- Input:
  - `deckId` (string)
  - `cards` (array, min 1, max 100)
  - per-card fields:
    - `name` (string, required)
    - `frontFileId` (string, required)
    - `backFileId` (string, optional)
    - `quantity` (integer, optional)
    - `classNumber` (integer, optional)
- Output data:
  - `createdCount` (integer)
  - `cards` (array)
  - Status: implemented

17. `tgc_part_create`
- Purpose: Create a game part reference.
- Input:
  - `gameId` (string)
  - `name` (string)
  - `quantity` (integer, min 1)
- Output data:
  - `part` (object)
  - Status: implemented (may be permission-gated by TGC account role)

18. `tgc_gamepart_upsert`
- Purpose: Link/update component quantity within game parts.
- Input:
  - `gameId` (string)
  - `partId` (string)
  - `componentType` (string)
  - `componentId` (string)
  - `quantity` (integer, min 1)
- Output data:
  - `gamePart` (object)
  - Status: implemented

19. `tgc_gamedownload_create`
- Purpose: Generate downloadable game package.
- Input:
  - `gameId` (string)
- Output data:
  - `download` (object)

20. `tgc_game_bulk_pricing_get`
- Purpose: Fetch pricing for multiple games.
- Input:
  - `gameIds` (array of string, min 1, max 50)
- Output data:
  - `prices` (array)
  - Status: contract present, implementation pending

21. `tgc_game_cost_breakdown_get`
- Purpose: Cost details for a game.
- Input:
  - `gameId` (string)
- Output data:
  - `cost` (object)
  - Status: contract present, implementation pending

22. `tgc_tgc_products_list`
- Purpose: List TGC product SKUs/components for compatibility checks.
- Input:
  - `page` (integer, default 1, min 1, max 200)
  - `limit` (integer, default 50, min 1, max 100)
  - `activeOnly` (boolean, default true)
- Output data:
  - `items` (array)
  - `page` (integer)
  - `limit` (integer)
  - `totalItems` (integer)
  - `pagingMode` (`local` when endpoint paging is not exposed)
  - Status: implemented (catalog endpoint normalized with local paging)

23. `tgc_component_create`
- Purpose: Create non-deck component containers using a TGC component endpoint type.
- Input:
  - `componentType` (string, required; for example `twosidedset`, `tuckbox`, `hookbox`, `twosidedbox`, `boxtop`)
  - `gameId` (string, required)
  - `name` (string, required)
  - `identity` (string, optional but typically required by TGC product family)
  - `quantity` (integer, optional)
  - `backFileId` (string, optional)
  - `faceFileId` (string, optional)
  - `frontFileId` (string, optional)
  - `outsideFileId` (string, optional)
  - `insideFileId` (string, optional)
  - `innerFileId` (string, optional)
  - `topFileId` (string, optional)
  - `bottomFileId` (string, optional)
  - `spotGlossFileId` (string, optional)
  - `spotGlossBottomFileId` (string, optional)
  - `hasProofedFace` (boolean, optional)
  - `hasProofedBack` (boolean, optional)
  - `hasProofedOutside` (boolean, optional)
  - `hasProofedInside` (boolean, optional)
  - `hasProofedTop` (boolean, optional)
  - `hasProofedBottom` (boolean, optional)
  - `hasProofedSpotGloss` (boolean, optional)
  - `hasProofedSpotGlossBottom` (boolean, optional)
- Output data:
  - `component` (object)
  - Status: implemented
  - Packaging coverage validated in live tests for:
    - `/api/tuckbox`
    - `/api/hookbox`
    - `/api/twosidedbox`
    - `/api/boxtop`
    - `/api/boxtopgloss`
    - `/api/twosidedboxgloss`
    - `/api/boxface`
  - Board/mat surface coverage validated in live tests for:
    - `/api/onesided`
    - `/api/onesidedgloss`
  - Advanced cut and dial coverage validated in live tests for:
    - `/api/dial`
    - `/api/customcutonesidedslugged`
    - `/api/customcuttwosidedslugged`
    - `/api/threesidedcustomcutset`

24. `tgc_component_item_create`
- Purpose: Create an item/member within a set-based container.
- Input:
  - `componentType` (string, required; for example `twosided`, `twosidedslugged`, `onesidedslugged`)
  - `setId` (string, required)
  - `name` (string, required)
  - `frontFileId` (string, required)
  - `backFileId` (string, optional)
  - `innerFileId` (string, optional)
  - `quantity` (integer, optional)
  - `hasProofedFace` (boolean, optional)
  - `hasProofedBack` (boolean, optional)
- Output data:
  - `item` (object)
  - Status: implemented
  - Live validation includes `/api/threesidedcustomcut` member creation under `/api/threesidedcustomcutset`.

25. `tgc_component_page_create`
- Purpose: Create pages for book-family components.
- Input:
  - `componentType` (enum: `bookletpage`, `coilbookpage`, `perfectboundbookpage`)
  - `parentId` (string; booklet id or book id depending on type)
  - `name` (string)
  - `frontFileId` (string)
  - `backFileId` (string, optional)
  - `quantity` (integer, optional)
- Output data:
  - `page` (object)
  - Status: implemented

## Non-Goals for v1
- No long-lived credential storage on disk.
- No automatic browser-driven SSO.
- No UI layer; CLI/MCP-only.

## v1.1 Candidates
- `tgc_game_scaffold`
- `tgc_deck_from_image_grid`
- `tgc_prepublish_check`
