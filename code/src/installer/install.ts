import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderConsoleSummary, renderManagedReadme } from "./snippets.js";
import type { InstallPaths, PackageMetadata } from "./types.js";

type InstallOptions = {
  destinationRoot?: string;
  packageRoot?: string;
  installedAt?: string;
};

type PackageAssetPaths = {
  runtimeServerRoot: string;
  skillsRoot: string;
  agentPath: string;
};

export function getPackageRoot(metaUrl: string): string {
  return resolve(dirname(fileURLToPath(metaUrl)), "..");
}

export function readPackageMetadata(packageRoot: string): PackageMetadata {
  const raw = readFileSync(join(packageRoot, "package.json"), "utf8");
  const parsed = JSON.parse(raw) as Partial<PackageMetadata>;
  if (!parsed.name || !parsed.version) {
    throw new Error("Installer package metadata is incomplete.");
  }
  return {
    name: parsed.name,
    version: parsed.version,
  };
}

export function getPackageAssetPaths(packageRoot: string): PackageAssetPaths {
  return {
    runtimeServerRoot: join(packageRoot, "dist", "installer-runtime", "server"),
    skillsRoot: join(packageRoot, "dist", "installer-assets", "skills"),
    agentPath: join(packageRoot, "dist", "installer-assets", "TGCAGENT.md"),
  };
}

export function getInstallPaths(destinationRoot: string): InstallPaths {
  const installRoot = resolve(destinationRoot, ".tgcmcp");
  return {
    installRoot,
    serverEntry: join(installRoot, "server", "index.js"),
    skillsRoot: join(installRoot, "skills"),
    agentPath: join(installRoot, "TGCAGENT.md"),
    readmePath: join(installRoot, "README.md"),
    manifestPath: join(installRoot, "manifest.json"),
  };
}

export function listSkillNames(skillsRoot: string): string[] {
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function installManagedBundle(options: InstallOptions = {}): {
  paths: InstallPaths;
  pkg: PackageMetadata;
  skillNames: string[];
} {
  const destinationRoot = options.destinationRoot ?? process.cwd();
  const packageRoot = options.packageRoot ?? getPackageRoot(import.meta.url);
  const pkg = readPackageMetadata(packageRoot);
  const assets = getPackageAssetPaths(packageRoot);
  const paths = getInstallPaths(destinationRoot);

  mkdirSync(paths.installRoot, { recursive: true });

  rmSync(dirname(paths.serverEntry), { recursive: true, force: true });
  rmSync(paths.skillsRoot, { recursive: true, force: true });

  cpSync(assets.runtimeServerRoot, dirname(paths.serverEntry), { recursive: true });
  cpSync(assets.skillsRoot, paths.skillsRoot, { recursive: true });
  cpSync(assets.agentPath, paths.agentPath);

  const skillNames = listSkillNames(paths.skillsRoot);
  const installedAt = options.installedAt ?? new Date().toISOString();

  writeFileSync(paths.readmePath, renderManagedReadme(paths, pkg));
  writeFileSync(
    paths.manifestPath,
    JSON.stringify(
      {
        packageName: pkg.name,
        packageVersion: pkg.version,
        installedAt,
        managedPaths: {
          serverEntry: paths.serverEntry,
          skillsRoot: paths.skillsRoot,
          agentPath: paths.agentPath,
        },
      },
      null,
      2,
    ),
  );

  return { paths, pkg, skillNames };
}

export function runInstaller(metaUrl: string): void {
  const packageRoot = getPackageRoot(metaUrl);
  const result = installManagedBundle({ packageRoot });
  console.log(renderConsoleSummary(result.paths, result.pkg, result.skillNames));
}
