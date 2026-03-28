import type { InstallPaths, PackageMetadata } from "./types.js";

export function renderManagedReadme(paths: InstallPaths, pkg: PackageMetadata): string {
  return [
    "# TGCMCP Local Install",
    "",
    `Installed by ${pkg.name}@${pkg.version}.`,
    "",
    "Managed paths:",
    `- Server entry: ${paths.serverEntry}`,
    `- Skills root: ${paths.skillsRoot}`,
    `- Agent profile: ${paths.agentPath}`,
    "",
    "Next steps:",
    "1. Configure your LLM client to run `node <server entry>` and pass the required `TGC_*` environment variables.",
    "2. Install the skills you want from the local `skills/` directory.",
    "3. Optionally reference `TGCAGENT.md` from your project agent file.",
    "",
    "Re-run the installer to refresh the managed files in this directory.",
    "",
  ].join("\n");
}

export function renderConsoleSummary(paths: InstallPaths, pkg: PackageMetadata, skillNames: string[]): string {
  return [
    `Installed ${pkg.name}@${pkg.version} into ${paths.installRoot}`,
    "",
    "Installed assets:",
    `- MCP server: ${paths.serverEntry}`,
    `- Skills (${skillNames.length}): ${paths.skillsRoot}`,
    `- Agent profile: ${paths.agentPath}`,
    "",
    "Next steps:",
    "1. Configure your LLM to run the local server entry with the required TGC_* environment variables.",
    "2. Install the skills you want from the local skills directory.",
    "3. Optionally reference the local TGCAGENT.md from your project agent file.",
    "",
    "See the repository README for client-specific configuration examples.",
  ].join("\n");
}
