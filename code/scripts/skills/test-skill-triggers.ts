import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

type SkillTriggerFixture = {
  skill: string;
  keywords: string[];
  positive: string[];
  negative: string[];
};

type RoutingCase = {
  prompt: string;
  expectedPrimary: string;
  minPrimaryHits?: number;
};

type TriggerFixtureFile = {
  skills: SkillTriggerFixture[];
  routingCases?: RoutingCase[];
};

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function normalize(input: string): string {
  return input.toLowerCase();
}

function countKeywordHits(prompt: string, keywords: string[]): number {
  const normalized = normalize(prompt);
  return keywords.filter((k) => normalized.includes(normalize(k))).length;
}

function main(): void {
  const repoRoot = resolve(getFlag("--repo-root") ?? process.cwd());
  const fixturePath = resolve(getFlag("--fixture") ?? join(repoRoot, "tests", "skills", "prompts", "trigger-matrix.json"));

  if (!existsSync(fixturePath)) {
    console.error(`Missing fixture file: ${fixturePath}`);
    process.exit(1);
  }

  const fixture = JSON.parse(readFileSync(fixturePath, "utf8")) as TriggerFixtureFile;
  if (!fixture.skills || fixture.skills.length === 0) {
    console.error("Trigger matrix must define at least one skill.");
    process.exit(1);
  }

  const errors: string[] = [];
  const skillKeywordMap = new Map<string, string[]>();

  for (const entry of fixture.skills) {
    if (!entry.skill || entry.keywords.length === 0) {
      errors.push(`Invalid fixture entry for skill '${entry.skill || "<missing>"}'.`);
      continue;
    }
    skillKeywordMap.set(entry.skill, entry.keywords);

    const skillFile = join(repoRoot, "skills", entry.skill, "SKILL.md");
    if (!existsSync(skillFile)) {
      errors.push(`Fixture references missing skill: ${entry.skill}`);
      continue;
    }

    const skillContent = readFileSync(skillFile, "utf8").toLowerCase();
    for (const keyword of entry.keywords) {
      if (!skillContent.includes(keyword.toLowerCase())) {
        errors.push(`${entry.skill}: keyword '${keyword}' not present in SKILL.md`);
      }
    }

    for (const prompt of entry.positive) {
      const hits = countKeywordHits(prompt, entry.keywords);
      if (hits < 1) errors.push(`${entry.skill}: positive prompt did not match any keyword -> '${prompt}'`);
    }

    for (const prompt of entry.negative) {
      const hits = countKeywordHits(prompt, entry.keywords);
      if (hits > 0) errors.push(`${entry.skill}: negative prompt unexpectedly matched ${hits} keyword(s) -> '${prompt}'`);
    }
  }

  for (const routingCase of fixture.routingCases ?? []) {
    const scores = [...skillKeywordMap.entries()].map(([skill, keywords]) => ({
      skill,
      hits: countKeywordHits(routingCase.prompt, keywords),
    }));

    const sorted = scores.sort((a, b) => b.hits - a.hits);
    const primary = sorted[0];
    if (!primary) {
      errors.push(`Routing case produced no scores -> '${routingCase.prompt}'`);
      continue;
    }

    if (primary.skill !== routingCase.expectedPrimary) {
      const debug = sorted.map((s) => `${s.skill}:${s.hits}`).join(", ");
      errors.push(
        `Routing case expected '${routingCase.expectedPrimary}' but got '${primary.skill}' -> '${routingCase.prompt}' (scores: ${debug})`
      );
    }

    const minHits = routingCase.minPrimaryHits ?? 1;
    if (primary.hits < minHits) {
      errors.push(
        `Routing case primary '${primary.skill}' has only ${primary.hits} hit(s), expected at least ${minHits} -> '${routingCase.prompt}'`
      );
    }
  }

  if (errors.length > 0) {
    console.error("Trigger tests failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(
    `Trigger tests passed for ${fixture.skills.length} skill fixture set(s)` +
      `${fixture.routingCases?.length ? ` and ${fixture.routingCases.length} routing case(s)` : ""}.`
  );
}

main();
