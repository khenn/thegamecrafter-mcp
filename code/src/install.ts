#!/usr/bin/env node

import { runInstaller } from "./installer/install.js";

try {
  runInstaller(import.meta.url);
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`tgcmcp installer failed: ${message}`);
  process.exitCode = 1;
}
