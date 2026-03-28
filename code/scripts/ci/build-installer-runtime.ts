import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

function getFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(getFlag("--repo-root") ?? join(scriptDir, "..", "..", ".."));
const codeRoot = join(repoRoot, "code");
const outputDir = join(codeRoot, "dist", "installer-runtime", "server");

mkdirSync(outputDir, { recursive: true });

await build({
  entryPoints: [join(codeRoot, "src", "index.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  outfile: join(outputDir, "index.js"),
  sourcemap: true,
});

console.log(`Built installer runtime bundle in ${outputDir}`);
