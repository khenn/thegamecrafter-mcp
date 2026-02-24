export type ToolContract = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

const pagingSchema = {
  type: "object",
  properties: {
    page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
    limit: { type: "integer", minimum: 1, maximum: 100 },
  },
  additionalProperties: false,
};

export const TOOL_CONTRACT: ToolContract[] = [
  {
    name: "tgc_auth_login",
    description: "Create an authenticated TGC API session.",
    inputSchema: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
        apiKeyId: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "tgc_auth_logout",
    description: "End the active TGC API session.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "tgc_me",
    description: "Return active authenticated user context.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "tgc_designer_list",
    description: "List designers available to the authenticated user.",
    inputSchema: pagingSchema,
  },
  {
    name: "tgc_game_create",
    description: "Create a game.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        designerId: { type: "string" },
        description: { type: "string" },
        minPlayers: { type: "integer", minimum: 1 },
        maxPlayers: { type: "integer", minimum: 1 },
        playTimeMinutes: { type: "integer", minimum: 1 },
      },
      required: ["name", "designerId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_list",
    description: "List public games with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        designerId: { type: "string" },
        userId: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_update",
    description: "Update game metadata fields.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        patch: { type: "object" },
      },
      required: ["gameId", "patch"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_get",
    description: "Fetch game by id.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        include: { type: "array", items: { type: "string" } },
        includeRelationships: { type: "array", items: { type: "string" } },
      },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_deck_get",
    description: "Fetch deck by id.",
    inputSchema: {
      type: "object",
      properties: { deckId: { type: "string" } },
      required: ["deckId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_decks_list",
    description: "List decks in a game.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_deck_cards_list",
    description: "List cards in a deck.",
    inputSchema: {
      type: "object",
      properties: {
        deckId: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["deckId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_gameparts_list",
    description: "List gamepart links in a game.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_components_list",
    description: "List component instances for a game relationship path (for example: twosidedsets).",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        relationship: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["gameId", "relationship"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_component_items_list",
    description: "List child items for a component container (for example: twosidedset -> twosideds).",
    inputSchema: {
      type: "object",
      properties: {
        componentType: { type: "string" },
        componentId: { type: "string" },
        relationship: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["componentType", "componentId", "relationship"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_card_get",
    description: "Fetch card by id.",
    inputSchema: {
      type: "object",
      properties: { cardId: { type: "string" } },
      required: ["cardId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_part_get",
    description: "Fetch part by id.",
    inputSchema: {
      type: "object",
      properties: { partId: { type: "string" } },
      required: ["partId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_file_get",
    description: "Fetch file by id.",
    inputSchema: {
      type: "object",
      properties: { fileId: { type: "string" } },
      required: ["fileId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_file_references_get",
    description: "Fetch references for a file.",
    inputSchema: {
      type: "object",
      properties: {
        fileId: { type: "string" },
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      },
      required: ["fileId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_copy",
    description: "Copy an existing game.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        name: { type: "string" },
      },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_delete",
    description: "Delete a game.",
    inputSchema: {
      type: "object",
      properties: { gameId: { type: "string" } },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_publish",
    description: "Publish a game.",
    inputSchema: {
      type: "object",
      properties: { gameId: { type: "string" } },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_unpublish",
    description: "Unpublish a game.",
    inputSchema: {
      type: "object",
      properties: { gameId: { type: "string" } },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_folder_create",
    description: "Create a folder for assets/files.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        parentFolderId: { type: "string" },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_file_upload",
    description: "Upload a local file to TGC file storage.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        folderId: { type: "string" },
        name: { type: "string" },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_deck_create",
    description: "Create a deck component.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        gameId: { type: "string" },
        identity: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 99 },
        backFileId: { type: "string" },
        hasProofedBack: { type: "boolean" },
        cardCount: { type: "integer", minimum: 1, deprecated: true },
      },
      required: ["name", "gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_card_create",
    description: "Create a card for a deck.",
    inputSchema: {
      type: "object",
      properties: {
        deckId: { type: "string" },
        name: { type: "string" },
        frontFileId: { type: "string" },
        backFileId: { type: "string" },
      },
      required: ["deckId", "name", "frontFileId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_deck_bulk_create_cards",
    description: "Bulk create cards in a deck.",
    inputSchema: {
      type: "object",
      properties: {
        deckId: { type: "string" },
        cards: {
          type: "array",
          minItems: 1,
          maxItems: 100,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              frontFileId: { type: "string" },
              backFileId: { type: "string" },
              quantity: { type: "integer", minimum: 1, maximum: 99 },
              classNumber: { type: "integer", minimum: 1, maximum: 5 },
            },
            required: ["name", "frontFileId"],
            additionalProperties: false,
          },
        },
      },
      required: ["deckId", "cards"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_part_create",
    description: "Create a game part entry.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        name: { type: "string" },
        quantity: { type: "integer", minimum: 1 },
      },
      required: ["gameId", "name", "quantity"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_gamepart_upsert",
    description: "Create or update a gamepart link/quantity.",
    inputSchema: {
      type: "object",
      properties: {
        gameId: { type: "string" },
        partId: { type: "string" },
        componentType: { type: "string" },
        componentId: { type: "string" },
        quantity: { type: "integer", minimum: 1 },
      },
      required: ["gameId", "partId", "componentType", "componentId", "quantity"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_component_create",
    description: "Create a non-deck component container (for example: twosidedset, twosidedsluggedset).",
    inputSchema: {
      type: "object",
      properties: {
        componentType: { type: "string" },
        gameId: { type: "string" },
        name: { type: "string" },
        identity: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 9999 },
        backFileId: { type: "string" },
        faceFileId: { type: "string" },
        frontFileId: { type: "string" },
        outsideFileId: { type: "string" },
        insideFileId: { type: "string" },
        innerFileId: { type: "string" },
        topFileId: { type: "string" },
        bottomFileId: { type: "string" },
        spotGlossFileId: { type: "string" },
        spotGlossBottomFileId: { type: "string" },
        side1FileId: { type: "string" },
        side2FileId: { type: "string" },
        side3FileId: { type: "string" },
        side4FileId: { type: "string" },
        side5FileId: { type: "string" },
        side6FileId: { type: "string" },
        side7FileId: { type: "string" },
        side8FileId: { type: "string" },
        hasProofedFace: { type: "boolean" },
        hasProofedBack: { type: "boolean" },
        hasProofedOutside: { type: "boolean" },
        hasProofedInside: { type: "boolean" },
        hasProofedTop: { type: "boolean" },
        hasProofedBottom: { type: "boolean" },
        hasProofedSpotGloss: { type: "boolean" },
        hasProofedSpotGlossBottom: { type: "boolean" },
      },
      required: ["componentType", "gameId", "name"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_component_item_create",
    description: "Create an item within a component set (for example: twosided, twosidedslugged, onesidedslugged).",
    inputSchema: {
      type: "object",
      properties: {
        componentType: { type: "string" },
        setId: { type: "string" },
        name: { type: "string" },
        frontFileId: { type: "string" },
        backFileId: { type: "string" },
        innerFileId: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 9999 },
        hasProofedFace: { type: "boolean" },
        hasProofedBack: { type: "boolean" },
      },
      required: ["componentType", "setId", "name", "frontFileId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_component_page_create",
    description: "Create a page for booklet/coilbook/perfectboundbook components.",
    inputSchema: {
      type: "object",
      properties: {
        componentType: {
          type: "string",
          enum: ["bookletpage", "coilbookpage", "perfectboundbookpage"],
        },
        parentId: { type: "string" },
        name: { type: "string" },
        frontFileId: { type: "string" },
        backFileId: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 9999 },
        sequenceNumber: { type: "integer", minimum: 1, maximum: 5000 },
      },
      required: ["componentType", "parentId", "name", "frontFileId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_gamedownload_create",
    description: "Generate a downloadable package for a game.",
    inputSchema: {
      type: "object",
      properties: { gameId: { type: "string" } },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_bulk_pricing_get",
    description: "Fetch pricing for multiple games.",
    inputSchema: {
      type: "object",
      properties: {
        gameIds: {
          type: "array",
          minItems: 1,
          maxItems: 50,
          items: { type: "string" },
        },
      },
      required: ["gameIds"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_game_cost_breakdown_get",
    description: "Fetch game cost breakdown.",
    inputSchema: {
      type: "object",
      properties: { gameId: { type: "string" } },
      required: ["gameId"],
      additionalProperties: false,
    },
  },
  {
    name: "tgc_tgc_products_list",
    description: "List TGC products/components.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "integer", minimum: 1, maximum: 200, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 50 },
        activeOnly: { type: "boolean", default: true },
      },
      additionalProperties: false,
    },
  },
];

export const TOOL_NAMES = new Set(TOOL_CONTRACT.map((tool) => tool.name));
