import { rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function getFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(getFlag("--repo-root") ?? join(scriptDir, "..", "..", ".."));
const distRoot = join(repoRoot, "code", "dist");

rmSync(distRoot, { recursive: true, force: true });
console.log(`Removed ${distRoot}`);
