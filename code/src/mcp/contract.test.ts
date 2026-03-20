import { describe, expect, it } from "vitest";
import { TOOL_CONTRACT, TOOL_NAMES } from "./contract.js";

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonObject;
}

describe("TOOL_CONTRACT", () => {
  it("defines the full implemented MCP tool surface", () => {
    expect(TOOL_CONTRACT).toHaveLength(41);
  });

  it("uses unique tool names", () => {
    const names = TOOL_CONTRACT.map((tool) => tool.name);
    expect(new Set(names)).toHaveProperty("size", names.length);
    expect(TOOL_NAMES).toEqual(new Set(names));
  });

  it("keeps each tool contract explicit and object-shaped", () => {
    for (const tool of TOOL_CONTRACT) {
      expect(tool.name).toMatch(/^tgc_[a-z0-9_]+$/);
      expect(tool.description.trim().length).toBeGreaterThan(0);

      const schema = asObject(tool.inputSchema);
      expect(schema).not.toBeNull();
      expect(schema?.type).toBe("object");
      expect(schema?.additionalProperties).toBe(false);

      const properties = asObject(schema?.properties);
      expect(properties).not.toBeNull();

      const required = schema?.required;
      if (Array.isArray(required)) {
        for (const key of required) {
          expect(typeof key).toBe("string");
          expect(properties).toHaveProperty(String(key));
        }
      }
    }
  });

  it("keeps tool ordering stable for downstream prompt and fixture consumers", () => {
    expect(TOOL_CONTRACT.map((tool) => tool.name)).toEqual([
      "tgc_auth_login",
      "tgc_auth_logout",
      "tgc_me",
      "tgc_designer_list",
      "tgc_game_create",
      "tgc_game_list",
      "tgc_game_update",
      "tgc_game_surfacing_get",
      "tgc_game_surfacing_set",
      "tgc_game_test_reports_get",
      "tgc_make_readiness_check",
      "tgc_game_get",
      "tgc_deck_get",
      "tgc_game_decks_list",
      "tgc_deck_cards_list",
      "tgc_game_gameparts_list",
      "tgc_game_components_list",
      "tgc_component_items_list",
      "tgc_card_get",
      "tgc_part_get",
      "tgc_file_get",
      "tgc_file_references_get",
      "tgc_game_copy",
      "tgc_game_delete",
      "tgc_game_publish",
      "tgc_game_unpublish",
      "tgc_folder_create",
      "tgc_file_upload",
      "tgc_deck_create",
      "tgc_card_create",
      "tgc_deck_bulk_create_cards",
      "tgc_part_create",
      "tgc_gamepart_upsert",
      "tgc_component_create",
      "tgc_component_update",
      "tgc_component_item_create",
      "tgc_component_page_create",
      "tgc_gamedownload_create",
      "tgc_game_bulk_pricing_get",
      "tgc_game_cost_breakdown_get",
      "tgc_tgc_products_list",
    ]);
  });
});
