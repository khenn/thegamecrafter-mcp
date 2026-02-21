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
      },
      required: ["gameId"],
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
        cardCount: { type: "integer", minimum: 1 },
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
        cards: { type: "array", minItems: 1, maxItems: 200, items: { type: "object" } },
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

