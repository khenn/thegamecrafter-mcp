import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

type Probe = { componentType: string; componentId: string };

async function main(): Promise<void> {
  const tgc = new TgcService(readEnvConfig());
  let gameId: string | null = null;
  const partId = "920C8A44-42C2-11E1-A263-140DF7D8CD61";

  await tgc.login({});
  try {
    const designers = await tgc.listDesigners(1, 1);
    const designerId = String((designers.items as Array<Record<string, unknown>>)[0]?.id ?? "");
    if (!designerId) throw new Error("no designer");

    const game = await tgc.createGame({ name: `gp-probe-${new Date().toISOString()}`, designerId });
    gameId = String(game.id ?? "");
    if (!gameId) throw new Error("no game id");

    const probes: Probe[] = [
      { componentType: "part", componentId: partId },
      { componentType: "part", componentId: gameId },
      { componentType: "gamepart", componentId: partId },
      { componentType: "stockcomponent", componentId: partId },
      { componentType: "stock_component", componentId: partId },
      { componentType: "game", componentId: gameId },
      { componentType: "component", componentId: partId },
    ];

    for (const probe of probes) {
      try {
        const result = await tgc.upsertGamepart({
          gameId,
          partId,
          componentType: probe.componentType,
          componentId: probe.componentId,
          quantity: 1,
        });
        console.log(`OK componentType=${probe.componentType} componentId=${probe.componentId}`);
        console.log(JSON.stringify(result));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`ERR componentType=${probe.componentType} componentId=${probe.componentId} :: ${message}`);
      }
    }
  } finally {
    if (gameId) await tgc.deleteGame(gameId).catch(() => {});
    await tgc.logout().catch(() => {});
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Probe failed: ${message}`);
  process.exitCode = 1;
});
