import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function getFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(getFlag("--repo-root") ?? join(scriptDir, "..", "..", ".."));
const codeRoot = join(repoRoot, "code");
const outputRoot = join(codeRoot, "dist", "installer-assets");

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

cpSync(join(repoRoot, "skills"), join(outputRoot, "skills"), { recursive: true });
cpSync(join(repoRoot, "context", "TGCAGENT.md"), join(outputRoot, "TGCAGENT.md"));

console.log(`Prepared installer assets in ${outputRoot}`);
