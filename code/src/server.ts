import type { EnvConfig } from "./config/env.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { TOOL_CONTRACT } from "./mcp/contract.js";
import { executeTool } from "./mcp/handlers.js";
import { TgcService } from "./tgc/service.js";

export async function startServer(env: EnvConfig): Promise<void> {
  const server = new Server(
    {
      name: "tgcmcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const runtime = {
    tgc: new TgcService(env),
  };

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOL_CONTRACT };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const result = await executeTool(request.params.name, request.params.arguments, runtime);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
      isError: !result.ok,
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
