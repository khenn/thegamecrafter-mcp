import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function usage(): never {
  console.error("Usage: tsx create-skill-scaffold.ts --name <skill-name> [--repo-root <path>] [--skills-root <relative-path>]");
  process.exit(1);
}

const rawName = getFlag("--name") ?? process.argv.slice(2).join(" ").trim();
if (!rawName) usage();

const skillName = slugify(rawName);
if (!skillName) usage();

const repoRoot = resolve(getFlag("--repo-root") ?? process.cwd());
const skillsRootRel = getFlag("--skills-root") ?? "skills";
const skillDir = join(repoRoot, skillsRootRel, skillName);
const refsDir = join(skillDir, "references");
const agentsDir = join(skillDir, "agents");

if (existsSync(skillDir)) {
  console.error(`Skill already exists: ${skillDir}`);
  process.exit(1);
}

mkdirSync(refsDir, { recursive: true });
mkdirSync(agentsDir, { recursive: true });

const skillMd = `---
name: ${skillName}
description: TODO: one-sentence trigger-oriented description for this workflow family.
---

# Skill: ${skillName}

## Purpose
- TODO: What this skill does.

## Use This Skill When
- TODO: Trigger phrase or user intent 1.
- TODO: Trigger phrase or user intent 2.

## Inputs Required
- TODO: Required input(s).

## Outputs Produced
- TODO: Expected output(s).

## Safety and Privacy
- Never request or expose secrets, local environment values, or proprietary assets.
- Require explicit user confirmation before public sharing/publishing actions.

## Read Additional References Only As Needed
- Read \`references/workflows.md\` for detailed workflow steps.
`;

const workflowsRef = `# ${skillName} Workflows

Add detailed, scoped workflow instructions here. Keep this file focused on one workflow family.
`;

const openaiYaml = `name: ${skillName}
description: TODO: trigger-oriented description
`;

writeFileSync(join(skillDir, "SKILL.md"), skillMd, "utf8");
writeFileSync(join(refsDir, "workflows.md"), workflowsRef, "utf8");
writeFileSync(join(agentsDir, "openai.yaml"), openaiYaml, "utf8");

console.log(`Created skill scaffold at ${skillDir}`);
console.log("Next steps:");
console.log("1) Refine SKILL.md with explicit triggers and I/O");
console.log("2) Add scoped references");
console.log("3) Run validation and trigger tests");
