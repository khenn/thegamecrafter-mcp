import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { installManagedBundle } from "./install.js";

const tempRoots: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempRoots.push(dir);
  return dir;
}

function writePackageFixture(packageRoot: string): void {
  writeFileSync(
    join(packageRoot, "package.json"),
    JSON.stringify({
      name: "@tgcmcp/thegamecrafter-mcp",
      version: "1.2.3",
    }),
  );

  const serverRoot = join(packageRoot, "dist", "installer-runtime", "server");
  const skillsRoot = join(packageRoot, "dist", "installer-assets", "skills", "sample-skill");
  const agentRoot = join(packageRoot, "dist", "installer-assets");

  mkdirSync(serverRoot, { recursive: true });
  mkdirSync(skillsRoot, { recursive: true });
  mkdirSync(agentRoot, { recursive: true });

  writeFileSync(join(serverRoot, "index.js"), "console.log('server');\n");
  writeFileSync(join(skillsRoot, "SKILL.md"), "---\nname: sample-skill\ndescription: fixture\n---\n");
  writeFileSync(join(agentRoot, "TGCAGENT.md"), "# Agent\n");
}

afterEach(() => {
  while (tempRoots.length > 0) {
    rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe("installManagedBundle", () => {
  it("installs the managed tgcmcp layout into the destination root", () => {
    const packageRoot = makeTempDir("tgcmcp-package-");
    const destinationRoot = makeTempDir("tgcmcp-dest-");

    writePackageFixture(packageRoot);

    const result = installManagedBundle({
      destinationRoot,
      packageRoot,
      installedAt: "2026-03-27T00:00:00.000Z",
    });

    expect(readFileSync(result.paths.serverEntry, "utf8")).toContain("server");
    expect(readFileSync(join(result.paths.skillsRoot, "sample-skill", "SKILL.md"), "utf8")).toContain("sample-skill");
    expect(readFileSync(result.paths.agentPath, "utf8")).toContain("# Agent");

    const manifest = JSON.parse(readFileSync(result.paths.manifestPath, "utf8")) as {
      packageName: string;
      packageVersion: string;
      installedAt: string;
    };
    expect(manifest).toMatchObject({
      packageName: "@tgcmcp/thegamecrafter-mcp",
      packageVersion: "1.2.3",
      installedAt: "2026-03-27T00:00:00.000Z",
    });

    expect(readFileSync(result.paths.readmePath, "utf8")).toContain(result.paths.serverEntry);
    expect(result.skillNames).toEqual(["sample-skill"]);
  });
});
