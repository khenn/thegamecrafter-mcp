import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type FixtureCase = {
  dirName: string;
  shouldPass: boolean;
};

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function runValidate(repoRoot: string, skillsRootOverride: string): { code: number | null; stdout: string; stderr: string } {
  const scriptPath = join(repoRoot, "code", "scripts", "skills", "validate-skill-package.ts");
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

  const run = spawnSync(
    npmCmd,
    [
      "exec",
      "--",
      "tsx",
      scriptPath,
      "--repo-root",
      repoRoot,
      "--skills-root",
      skillsRootOverride,
    ],
    { encoding: "utf8", cwd: join(repoRoot, "code") }
  );

  return {
    code: run.status,
    stdout: run.stdout ?? "",
    stderr: run.stderr ?? "",
  };
}

function main(): void {
  const repoRoot = resolve(getFlag("--repo-root") ?? process.cwd());
  const fixturesRoot = resolve(getFlag("--fixtures-root") ?? join(repoRoot, "tests", "skills", "fixtures"));

  if (!existsSync(fixturesRoot)) {
    console.error(`Missing fixtures root: ${fixturesRoot}`);
    process.exit(1);
  }

  const cases: FixtureCase[] = readdirSync(fixturesRoot).map((dirName) => ({
    dirName,
    shouldPass: dirName.startsWith("valid-"),
  }));

  const failures: string[] = [];

  for (const testCase of cases) {
    const targetRoot = join(fixturesRoot, testCase.dirName);
    const result = runValidate(repoRoot, targetRoot);
    const passed = result.code === 0;

    if (passed !== testCase.shouldPass) {
      failures.push(
        `${testCase.dirName}: expected ${testCase.shouldPass ? "pass" : "fail"} but got ${passed ? "pass" : "fail"}\n${result.stdout}${result.stderr}`
      );
    }
  }

  if (failures.length > 0) {
    console.error("Validator fixture tests failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Validator fixture tests passed for ${cases.length} case(s).`);
}

main();
