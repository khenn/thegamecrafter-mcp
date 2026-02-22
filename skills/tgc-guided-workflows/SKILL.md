# Skill: TGC Guided Workflows

## Purpose
Provide a consistent, low-friction workflow layer on top of TGC MCP tools so users can ask in natural language and still get safe, auditable API actions.

## Use This Skill When
- The user asks for game creation/management in plain language (for example: "create a game for me").
- The user wants minimal prompts and expects the agent to resolve obvious context automatically.
- The workflow requires multiple MCP calls with clear sequencing.

## Core Behavior
- Ask only for missing required inputs.
- Auto-resolve context when available (for example, resolve `designerId` from `tgc_designer_list` after auth).
- Prefer smallest valid tool call set to complete intent.
- After mutations, report IDs and next actions.
- For component-create intents, offer capability-driven "option assist" before mutation when choices are unspecified:
  - show only options that exist for that specific component type/identity,
  - include image requirements, finish/surface, and quantity only if supported,
  - include default values/behavior when known.
  Ask for all missing choices once, then execute.
- For component interrogation:
  - default to all component types in the game,
  - only return a single component type when user explicitly requests that filter.

## Baseline Workflow: Create Game
1. Call `tgc_auth_login` if no active session.
2. Obtain `designerId`:
   - use user-provided value if given;
   - otherwise call `tgc_designer_list` and choose the primary designer.
3. Ask user only for `name` if missing.
4. Call `tgc_game_create`.
5. Return:
   - `gameId`
   - `name`
   - suggested next actions (`tgc_game_update`, deck/art setup, parts/pricing).

## Workflow: Copy Existing Game (Primitive Tools Only)
1. Authenticate and resolve owned source game by name:
   - `tgc_auth_login`
   - `tgc_designer_list`
   - `tgc_game_list` (designer-scoped) to map name -> `gameId`
2. Interrogate source graph before mutation:
   - `tgc_game_get`
   - `tgc_game_decks_list`
   - `tgc_deck_cards_list`
   - `tgc_card_get`
   - `tgc_file_get`
   - `tgc_file_references_get`
   - `tgc_game_gameparts_list`
   - `tgc_game_components_list` (for non-deck component families)
   - `tgc_component_items_list` (use relationship `members` for set child items)
3. For MCP capability proving, prefer staged reconstruction with primitive write tools.
4. Treat native TGC copy (`tgc_game_copy`) as optional/deferred convenience benchmarking, not the primary workflow.

## Guardrails Discovered
- `tgc_part_create` may be permission-gated by TGC account role.
- If part creation is blocked, fallback to linking existing catalog parts via `tgc_gamepart_upsert` when valid part IDs are known.
- For `tgc_deck_bulk_create_cards`, provide per-card `frontFileId` (optional aliases: `faceFileId`, `face_id`).
- If a bulk-create response shows created cards with missing `face_id`, treat it as a contract regression and stop before continuing copy/build workflows.
- Treat `tgc_deck_bulk_create_cards` as append-only/non-idempotent:
  - never retry the same batch blindly,
  - never resume into a partially populated target deck,
  - if interrupted, create a fresh target and rerun from zero.
- Resume heuristics based on `name`/`face_id` matching are unsafe for decks that may contain repeated cards.
- Before declaring success, compare source and target card totals per deck.
- Complex games (for example Generals variants) often include non-deck components (mats, standees, sticker sets, slugged sets, custom dice, etc.) that are not reconstructable with deck/card tools alone.
- Do not claim full manual-copy capability unless you can both:
  - enumerate source non-deck component instance IDs/details, and
  - recreate or relink those component instances in the target game.
- TGC set-child traversal for `twosidedset` / `twosidedsluggedset` / `onesidedsluggedset` is done via relationship `members`.
- Prefer this non-deck reconstruction sequence:
  1. `tgc_game_components_list` (container instances by relationship)
  2. `tgc_component_items_list` with `relationship=members`
  3. `tgc_component_create` for target container
  4. `tgc_component_item_create` for each member

## Cleanup Pattern For Tests
- If a workflow run is a test/probe, create disposable resources with a clear prefix.
- Always include a cleanup step (`tgc_game_delete`) in a `finally`-equivalent path.
- Note: TGC delete is currently soft-delete (`trashed: 1`), not hard-delete.

## Coverage Planning
- Treat `tools/tgc-component-capability-matrix.md` as the generated baseline for component-family support.
- When create API coverage changes, regenerate the matrix and use it to reprioritize roadmap items for new-game build completeness.
- For discovery of component shapes/examples:
  - public `tgc_game_list` data may be used to inspect component families and quantities across non-owned public games,
  - deeper interrogation of public games via read endpoints (`tgc_game_get`, `tgc_game_decks_list`, `tgc_deck_cards_list`, `tgc_game_components_list`, `tgc_component_items_list`) is allowed for metadata/schema learning,
  - do not assume ownership-only asset identifiers (for example editable source file IDs) are available for non-owned games,
  - do not treat publicly readable data as permission to reproduce third-party art/content.
- When no suitable owned example exists for a missing component family, prefer synthetic fixture creation in a disposable test game to validate write flows.
- Packaging family note:
  - `tgc_component_create` with `componentType` + valid `identity` is sufficient for baseline creation of `tuckbox`, `hookbox`, `twosidedbox`, `boxtop`, `boxtopgloss`, `twosidedboxgloss`, and `boxface` in live tests.
  - Always verify via matching relationship list (`tuckboxes`, `hookboxes`, `twosidedboxes`, `boxtops`, `boxtopglosses`, `twosidedboxglosses`, `boxfaces`) before declaring support.
  - Image upload + attachment flow is now validated:
    1. create folder (`tgc_folder_create`)
    2. upload files (`tgc_file_upload`)
    3. pass file IDs into `tgc_component_create` fields based on component family:
       - `tuckbox`: `outsideFileId`
       - `hookbox`: `outsideFileId`, `insideFileId`
       - `twosidedbox`: `topFileId`, `bottomFileId`
       - `boxtop`: `topFileId`
       - `boxtopgloss`: `topFileId`, `spotGlossFileId`
       - `twosidedboxgloss`: `topFileId`, `bottomFileId`, `spotGlossFileId`, `spotGlossBottomFileId`
       - `boxface`: `faceFileId`
  - Finish behavior discovered in live testing:
    - `boxtopgloss` and `twosidedboxgloss` accepted and persisted `surfacing_treatment = Linen Finish`.
    - `tuckbox`, `hookbox`, `twosidedbox`, and `boxtop` did not persist `surfacing_treatment` in the tested API flow.
  - Packaging capability snapshot (for option-assist prompts):
    - `tuckbox` (`PokerTuckBox54`): image slot `outsideFileId` at `2325x1950`; no validated finish field.
    - `hookbox` (`PokerHookBox54`): image slots `outsideFileId` and `insideFileId` at `2850x3375`; no validated finish field.
    - `twosidedbox` (`MediumStoutBox`): image slots `topFileId` and `bottomFileId` at `3675x4575`; no validated finish field.
    - `boxtop` (`MediumStoutBoxTopAndSide`): image slot `topFileId` at `3675x4575`; no validated finish field.
    - `boxtopgloss` (`LargeStoutBoxTopAndSide`): image slots `topFileId` + `spotGlossFileId` at `5925x5925`; validated `surfacing_treatment` options include `Linen Finish` and `Matte Finish`.
    - `twosidedboxgloss` (`LargeStoutBox`): image slots `topFileId`, `bottomFileId`, `spotGlossFileId`, `spotGlossBottomFileId` at `5925x5925`; validated `surfacing_treatment` options include `Linen Finish` and `Matte Finish`.
    - `boxface` (`PokerBooster`): image slot `faceFileId` at `975x1350`; no validated finish field.
- Batch 2 books/documents note:
  - validated create coverage for:
    - `document`
    - `booklet` + `bookletpage`
    - `coilbook` + `coilbookpage`
    - `perfectboundbook` + `perfectboundbookpage`
    - `scorepad`
  - page-create tool mapping:
    - use `tgc_component_page_create`
    - `bookletpage` expects `booklet_id` (handled internally from `parentId`)
    - `coilbookpage` and `perfectboundbookpage` expect `book_id` (handled internally from `parentId`)
  - for page readback, use relationship `pages` on parent component types (`booklet`, `coilbook`, `perfectboundbook`).

## Output Style
- Keep updates concise and concrete.
- Always show what tool was called and what changed.
- Surface failures with actionable remediation, not generic errors.
