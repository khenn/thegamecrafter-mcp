import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

type ValidationResult = {
  errors: string[];
  warnings: string[];
};

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function readText(path: string): string {
  return readFileSync(path, "utf8");
}

function hasFrontmatter(content: string): boolean {
  return content.startsWith("---\n") && content.indexOf("\n---\n", 4) > 0;
}

function hasHeading(content: string, heading: string): boolean {
  return new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m").test(content);
}

function listSkillDirs(skillsRoot: string): string[] {
  if (!existsSync(skillsRoot)) return [];
  if (existsSync(join(skillsRoot, "SKILL.md"))) {
    return [skillsRoot];
  }
  return readdirSync(skillsRoot)
    .map((entry) => join(skillsRoot, entry))
    .filter((fullPath) => statSync(fullPath).isDirectory())
    .filter((fullPath) => existsSync(join(fullPath, "SKILL.md")));
}

function validateSkill(skillDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const skillName = skillDir.split("/").at(-1) ?? skillDir;

  const skillMdPath = join(skillDir, "SKILL.md");
  const refsPath = join(skillDir, "references");
  const openaiYamlPath = join(skillDir, "agents", "openai.yaml");

  if (!existsSync(skillMdPath)) errors.push(`${skillName}: missing SKILL.md`);
  if (!existsSync(refsPath)) errors.push(`${skillName}: missing references/`);
  if (!existsSync(openaiYamlPath)) errors.push(`${skillName}: missing agents/openai.yaml`);

  if (existsSync(skillMdPath)) {
    const content = readText(skillMdPath);
    const lineCount = content.split(/\r?\n/).length;

    if (!hasFrontmatter(content)) errors.push(`${skillName}: SKILL.md missing YAML frontmatter`);
    if (!hasHeading(content, "Purpose")) errors.push(`${skillName}: SKILL.md missing '## Purpose' section`);
    if (!hasHeading(content, "Use This Skill When")) errors.push(`${skillName}: SKILL.md missing '## Use This Skill When' section`);
    if (!hasHeading(content, "Inputs Required")) warnings.push(`${skillName}: recommend adding '## Inputs Required' section`);
    if (!hasHeading(content, "Outputs Produced")) warnings.push(`${skillName}: recommend adding '## Outputs Produced' section`);
    if (!hasHeading(content, "Safety and Privacy")) warnings.push(`${skillName}: recommend adding '## Safety and Privacy' section`);
    if (lineCount > 500) warnings.push(`${skillName}: SKILL.md is ${lineCount} lines (consider reducing context load)`);
  }

  if (existsSync(refsPath)) {
    const refFiles = readdirSync(refsPath);
    if (refFiles.length === 0) errors.push(`${skillName}: references/ has no files`);

    const totalBytes = refFiles
      .map((f) => join(refsPath, f))
      .filter((p) => statSync(p).isFile())
      .reduce((sum, p) => sum + statSync(p).size, 0);

    if (totalBytes > 500_000) warnings.push(`${skillName}: references/ exceeds 500KB (consider further split/indexing)`);
  }

  return { errors, warnings };
}

function main(): void {
  const repoRoot = resolve(getFlag("--repo-root") ?? process.cwd());
  const skillsRoot = resolve(getFlag("--skills-root") ?? join(repoRoot, "skills"));
  const skillDirs = listSkillDirs(skillsRoot);

  if (skillDirs.length === 0) {
    console.error("No skills with SKILL.md found under skills/");
    process.exit(1);
  }

  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  for (const skillDir of skillDirs) {
    const result = validateSkill(skillDir);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  if (allWarnings.length > 0) {
    console.log("Warnings:");
    for (const warning of allWarnings) console.log(`- ${warning}`);
  }

  if (allErrors.length > 0) {
    console.error("Errors:");
    for (const error of allErrors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Validated ${skillDirs.length} skill package(s) successfully.`);
}

main();
