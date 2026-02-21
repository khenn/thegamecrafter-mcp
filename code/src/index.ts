import { readEnvConfig } from "./config/env.js";
import { startServer } from "./server.js";

async function main(): Promise<void> {
  const env = readEnvConfig();
  await startServer(env);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  // Keep startup failure output explicit for CLI diagnostics.
  console.error(`tgcmcp startup failed: ${message}`);
  process.exitCode = 1;
});
