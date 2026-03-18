import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

type JsonObject = Record<string, unknown>;

type StructuredOutput = {
  primary_skill: string;
  secondary_skills: string[];
  references_loaded: string[];
  needs_user_input: boolean;
  approval_required: boolean;
  requested_mutation: boolean;
  notes: string;
};

type ClaudeEnvelope = {
  subtype?: string;
  duration_ms?: number;
  result?: string;
  structured_output?: StructuredOutput;
  total_cost_usd?: number;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
  permission_denials?: unknown[];
  stop_reason?: string;
  errors?: string[];
};

type Expectation = {
  primarySkill?: string;
  secondarySkillsAllOf?: string[];
  secondarySkillsNoneOf?: string[];
  referencesLoadedAllOf?: string[];
  referencesLoadedNoneOf?: string[];
  maxReferencesLoaded?: number;
  needsUserInput?: boolean;
  approvalRequired?: boolean;
  requestedMutation?: boolean;
  requireTelemetry?: boolean;
  expectNoPermissionDenials?: boolean;
  forbidApprovalLanguage?: boolean;
  notesAllOf?: string[];
  notesNoneOf?: string[];
};

type WarningThresholds = {
  maxInputTokens?: number;
  maxOutputTokens?: number;
  maxTotalCostUsd?: number;
  maxReferencesLoaded?: number;
};

type FixtureDefaults = {
  mode?: "read-only" | "live";
  effort?: "low" | "medium" | "high" | "max";
  permissionMode?: "acceptEdits" | "bypassPermissions" | "default" | "dontAsk" | "plan" | "auto";
  timeoutSeconds?: number;
  retryCount?: number;
  allowedTools?: string[];
  expect?: Expectation;
  warn?: WarningThresholds;
};

type FixtureCase = {
  id: string;
  description?: string;
  mode?: "read-only" | "live";
  effort?: "low" | "medium" | "high" | "max";
  permissionMode?: "acceptEdits" | "bypassPermissions" | "default" | "dontAsk" | "plan" | "auto";
  timeoutSeconds?: number;
  retryCount?: number;
  allowedTools?: string[];
  userRequest: string;
  expect?: Expectation;
  warn?: WarningThresholds;
};

type FixtureFile = {
  suite: string;
  defaults?: FixtureDefaults;
  cases: FixtureCase[];
};

type CaseResult = {
  suite: string;
  caseId: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  fixture: FixtureCase;
  structured: StructuredOutput | null;
  envelope: ClaudeEnvelope | null;
  prompt: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
};

type SweepPhase = "before" | "after";

type DisposableSweepResult = {
  phase: SweepPhase;
  targetedGameNames: string[];
  deletedGameIds: string[];
  remainingActiveGameIds: string[];
  remainingActiveGameNames: string[];
  skipped: boolean;
  error?: string;
};

const STRUCTURED_OUTPUT_SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    primary_skill: { type: "string" },
    secondary_skills: {
      type: "array",
      items: { type: "string" },
    },
    references_loaded: {
      type: "array",
      items: { type: "string" },
    },
    needs_user_input: { type: "boolean" },
    approval_required: { type: "boolean" },
    requested_mutation: { type: "boolean" },
    notes: { type: "string" },
  },
  required: [
    "primary_skill",
    "secondary_skills",
    "references_loaded",
    "needs_user_input",
    "approval_required",
    "requested_mutation",
    "notes",
  ],
  additionalProperties: false,
});

function getFlag(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonObject;
}

function asItems(value: unknown): JsonObject[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asObject(item)).filter((item): item is JsonObject => item !== null);
}

function normalizeBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    if (normalized.length > 0) return true;
  }
  return null;
}

function normalizeStructuredOutput(value: unknown): StructuredOutput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as JsonObject;
  const needsUserInput = normalizeBoolean(obj.needs_user_input);
  const approvalRequired = normalizeBoolean(obj.approval_required);
  const requestedMutation = normalizeBoolean(obj.requested_mutation);
  if (
    typeof obj.primary_skill !== "string" ||
    !Array.isArray(obj.secondary_skills) ||
    !Array.isArray(obj.references_loaded) ||
    needsUserInput === null ||
    approvalRequired === null ||
    requestedMutation === null ||
    typeof obj.notes !== "string"
  ) {
    return null;
  }

  return {
    primary_skill: obj.primary_skill,
    secondary_skills: normalizeList(obj.secondary_skills),
    references_loaded: normalizeList(obj.references_loaded),
    needs_user_input: needsUserInput,
    approval_required: approvalRequired,
    requested_mutation: requestedMutation,
    notes: obj.notes,
  };
}

function unwrapJsonPayload(value: string): string {
  const trimmed = value.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }
  return trimmed;
}

function loadFixtures(pathOrDir: string): FixtureFile[] {
  const resolved = resolve(pathOrDir);
  if (!existsSync(resolved)) {
    console.error(`Missing fixture path: ${resolved}`);
    process.exit(1);
  }

  const filePaths = resolved.endsWith(".json")
    ? [resolved]
    : readdirSync(resolved)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => join(resolved, name));

  if (filePaths.length === 0) {
    console.error(`No fixture files found under: ${resolved}`);
    process.exit(1);
  }

  return filePaths.map((filePath) => JSON.parse(readFileSync(filePath, "utf8")) as FixtureFile);
}

function extractDisposableGameNamesFromRequest(userRequest: string): string[] {
  const matches = new Set<string>();
  const namedGamePattern = /(?:sandbox\s+)?game named `([^`]+)`/gi;
  for (const match of userRequest.matchAll(namedGamePattern)) {
    const candidate = match[1]?.trim();
    if (candidate) {
      matches.add(candidate);
    }
  }

  if (matches.size === 0) {
    const fallbackTokenPattern = /`([^`]+)`/g;
    for (const match of userRequest.matchAll(fallbackTokenPattern)) {
      const candidate = match[1]?.trim();
      if (candidate && (/^claude-live-/.test(candidate) || candidate === "sandbox-test")) {
        matches.add(candidate);
      }
    }
  }

  return [...matches];
}

function collectLiveDisposableGameNames(fixtures: FixtureFile[], caseFilter?: string): string[] {
  const names = new Set<string>();
  for (const fixture of fixtures) {
    for (const testCase of fixture.cases) {
      if (caseFilter && testCase.id !== caseFilter) continue;
      const mode = testCase.mode ?? fixture.defaults?.mode ?? "read-only";
      if (mode !== "live") continue;
      for (const name of extractDisposableGameNamesFromRequest(testCase.userRequest)) {
        names.add(name);
      }
    }
  }
  return [...names].sort();
}

async function getDefaultDesignerId(tgc: TgcService): Promise<string> {
  const designers = await tgc.listDesigners(1, 1);
  const firstDesigner = asItems(designers.items)[0];
  const designerId = typeof firstDesigner?.id === "string" ? firstDesigner.id : "";
  if (!designerId) {
    throw new Error("No designer found for authenticated user during Claude cleanup sweep.");
  }
  return designerId;
}

function isTrashedGame(game: JsonObject): boolean {
  return game.trashed === 1 || game.trashed === "1" || game.trashed === true;
}

async function listMatchingGames(tgc: TgcService, designerId: string, targetNames: Set<string>): Promise<JsonObject[]> {
  const matches: JsonObject[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const result = await tgc.listGames({ designerId, page, limit: 100 });
    const items = asItems(result.items);
    for (const item of items) {
      const name = typeof item.name === "string" ? item.name : "";
      if (targetNames.has(name)) {
        matches.push(item);
      }
    }

    const paging = asObject(result.paging);
    const nextTotalPages =
      typeof paging?.total_pages === "number"
        ? paging.total_pages
        : typeof paging?.total_pages === "string"
          ? Number.parseInt(paging.total_pages, 10)
          : 1;
    totalPages = Number.isFinite(nextTotalPages) && nextTotalPages > 0 ? nextTotalPages : 1;
    page += 1;
  }

  return matches;
}

async function sweepDisposableGames(targetedGameNames: string[], phase: SweepPhase): Promise<DisposableSweepResult> {
  const result: DisposableSweepResult = {
    phase,
    targetedGameNames,
    deletedGameIds: [],
    remainingActiveGameIds: [],
    remainingActiveGameNames: [],
    skipped: targetedGameNames.length === 0,
  };

  if (targetedGameNames.length === 0) {
    return result;
  }

  const env = readEnvConfig();
  if (!env.TGC_PUBLIC_API_KEY_ID || !env.TGC_USERNAME || !env.TGC_PASSWORD) {
    return {
      ...result,
      skipped: true,
      error: "Missing TGC credentials in environment; skipped disposable game sweep.",
    };
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const tgc = new TgcService(env);
    try {
      await tgc.login({});
      const designerId = await getDefaultDesignerId(tgc);
      const targetNameSet = new Set(targetedGameNames);
      const beforeMatches = await listMatchingGames(tgc, designerId, targetNameSet);

      for (const game of beforeMatches) {
        const gameId = typeof game.id === "string" ? game.id : "";
        if (!gameId || isTrashedGame(game)) continue;
        await tgc.deleteGame(gameId);
        result.deletedGameIds.push(gameId);
      }

      const afterMatches = await listMatchingGames(tgc, designerId, targetNameSet);
      result.remainingActiveGameIds = [];
      result.remainingActiveGameNames = [];
      for (const game of afterMatches) {
        if (isTrashedGame(game)) continue;
        const gameId = typeof game.id === "string" ? game.id : "";
        const gameName = typeof game.name === "string" ? game.name : "";
        if (gameId) result.remainingActiveGameIds.push(gameId);
        if (gameName) result.remainingActiveGameNames.push(gameName);
      }

      result.error = undefined;
      return result;
    } catch (error: unknown) {
      result.error = error instanceof Error ? error.message : String(error);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    } finally {
      try {
        await tgc.logout();
      } catch {
        // Ignore logout failures in cleanup path.
      }
    }
  }

  return result;
}

function makeResultsDir(repoRoot: string, baseDir?: string): string {
  const stamp = new Date().toISOString().replace(/[:]/g, "-");
  const root = resolve(baseDir ?? join(repoRoot, "logs", "claude"));
  const dir = join(root, `regression-${stamp}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function mergeExpectations(defaults?: Expectation, override?: Expectation): Expectation {
  return {
    ...defaults,
    ...override,
    secondarySkillsAllOf: override?.secondarySkillsAllOf ?? defaults?.secondarySkillsAllOf,
    secondarySkillsNoneOf: override?.secondarySkillsNoneOf ?? defaults?.secondarySkillsNoneOf,
    referencesLoadedAllOf: override?.referencesLoadedAllOf ?? defaults?.referencesLoadedAllOf,
    referencesLoadedNoneOf: override?.referencesLoadedNoneOf ?? defaults?.referencesLoadedNoneOf,
    notesAllOf: override?.notesAllOf ?? defaults?.notesAllOf,
    notesNoneOf: override?.notesNoneOf ?? defaults?.notesNoneOf,
  };
}

function mergeWarnings(defaults?: WarningThresholds, override?: WarningThresholds): WarningThresholds {
  return {
    ...defaults,
    ...override,
  };
}

function buildPrompt(testCase: FixtureCase, mode: "read-only" | "live"): string {
  const modeInstruction =
    mode === "read-only"
      ? "This is a read-only test. Do not request or perform mutations, and do not log in unless the prompt explicitly requires it."
      : "This test may require safe sandboxed mutations when the prompt calls for them.";
  const loginInstruction =
    mode === "live"
      ? "If authentication is required, first call tgc_auth_login without asking the user for credentials; use server-configured defaults before requesting any manual credential input."
      : "Do not inspect local files for secrets or credentials.";
  const outputInstruction =
    mode === "live"
      ? [
          "Final response requirement:",
          "Return a single JSON object only, with no markdown fences or extra prose.",
          "Use exactly these keys: primary_skill, secondary_skills, references_loaded, needs_user_input, approval_required, requested_mutation, notes.",
          "needs_user_input, approval_required, and requested_mutation must be boolean true/false values.",
          "Do not include session IDs, credentials, private URLs, or personal data in notes.",
        ].join("\n")
      : "Return the final response in the structured format required by the CLI schema.";

  return [
    "You are the installed downstream TGC agent for this project.",
    "Behave like a real user installation, not a repo-builder assistant.",
    "Use only the minimum local context needed to answer the request.",
    "Do not scan unrelated repo internals, source files, build scripts, or configuration files unless the request truly requires them.",
    "Load the installed TGCMCP skill that best matches the request before taking action.",
    "Prefer the focused workflow skill for the request when one clearly applies.",
    "Do not guess component tool parameters when a matching installed skill or skill reference can resolve them.",
    modeInstruction,
    loginInstruction,
    "Keep the response concise and task-focused.",
    "In references_loaded, list only the specific files or references you actually used.",
    "Use notes to summarize the concrete blockers, warnings, or verification outcome, and preserve any literal tokens requested in the user request exactly.",
    outputInstruction,
    "",
    "User request:",
    testCase.userRequest,
  ].join("\n");
}

function parseEnvelope(stdout: string): ClaudeEnvelope | null {
  try {
    return JSON.parse(stdout) as ClaudeEnvelope;
  } catch {
    return null;
  }
}

function parseStructuredOutput(envelope: ClaudeEnvelope | null): StructuredOutput | null {
  const fromEnvelope = normalizeStructuredOutput(envelope?.structured_output);
  if (fromEnvelope) return fromEnvelope;

  if (typeof envelope?.result !== "string" || envelope.result.trim().length === 0) return null;
  try {
    return normalizeStructuredOutput(JSON.parse(unwrapJsonPayload(envelope.result)));
  } catch {
    return null;
  }
}

function containsPattern(values: string[], pattern: string): boolean {
  const normalizedPattern = pattern.toLowerCase();
  return values.some((value) => value.toLowerCase().includes(normalizedPattern));
}

function textContainsPattern(value: string, pattern: string): boolean {
  return value.toLowerCase().includes(pattern.toLowerCase());
}

function hasApprovalLanguage(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("please approve") ||
    lower.includes("need approval") ||
    lower.includes("needs approval") ||
    lower.includes("need permission") ||
    lower.includes("needs permission") ||
    lower.includes("requires approval") ||
    lower.includes("requires permission") ||
    lower.includes("permission denied")
  );
}

function hasTransientClaudeExecutionError(envelope: ClaudeEnvelope | null): boolean {
  if (!envelope) return false;
  if (envelope.subtype !== "error_during_execution") return false;
  const errors = envelope.errors ?? [];
  return errors.some(
    (error) =>
      error.includes("Lock acquisition failed") ||
      error.includes("NON-FATAL: Lock acquisition failed") ||
      error.includes("EACCES: permission denied") ||
      error.includes(".claude.json") ||
      error.includes("/home/khenny/.claude/plans") ||
      error.includes("/home/khenny/.claude/plugins/blocklist.json")
  );
}

function shouldRetryCase(result: CaseResult, mode: "read-only" | "live"): boolean {
  if (result.timedOut) return mode === "live";
  return hasTransientClaudeExecutionError(result.envelope) && !result.structured;
}

function assertCase(result: CaseResult, expect: Expectation): void {
  if (result.timedOut) {
    result.errors.push("Claude command timed out before producing a result.");
    return;
  }

  if (result.exitCode !== 0) {
    result.errors.push(`Claude command exited with code ${result.exitCode ?? "<unknown>"}.`);
    return;
  }

  if (!result.envelope) {
    result.errors.push("Claude CLI output was not valid JSON.");
    return;
  }

  if (!result.structured) {
    result.errors.push("Missing or invalid structured_output from Claude CLI envelope.");
    return;
  }

  if (expect.primarySkill && result.structured.primary_skill !== expect.primarySkill) {
    result.errors.push(
      `Expected primary skill '${expect.primarySkill}' but got '${result.structured.primary_skill}'.`
    );
  }

  for (const skill of expect.secondarySkillsAllOf ?? []) {
    if (!result.structured.secondary_skills.includes(skill)) {
      result.errors.push(`Expected secondary skill '${skill}' to be present.`);
    }
  }

  for (const skill of expect.secondarySkillsNoneOf ?? []) {
    if (result.structured.secondary_skills.includes(skill)) {
      result.errors.push(`Secondary skill '${skill}' should not be present.`);
    }
  }

  for (const pattern of expect.referencesLoadedAllOf ?? []) {
    if (!containsPattern(result.structured.references_loaded, pattern)) {
      result.errors.push(`Expected references_loaded to include pattern '${pattern}'.`);
    }
  }

  for (const pattern of expect.referencesLoadedNoneOf ?? []) {
    if (containsPattern(result.structured.references_loaded, pattern)) {
      result.errors.push(`references_loaded unexpectedly included pattern '${pattern}'.`);
    }
  }

  if (
    typeof expect.maxReferencesLoaded === "number" &&
    result.structured.references_loaded.length > expect.maxReferencesLoaded
  ) {
    result.errors.push(
      `Expected at most ${expect.maxReferencesLoaded} reference(s) but got ${result.structured.references_loaded.length}.`
    );
  }

  if (
    typeof expect.needsUserInput === "boolean" &&
    result.structured.needs_user_input !== expect.needsUserInput
  ) {
    result.errors.push(
      `Expected needs_user_input=${String(expect.needsUserInput)} but got ${String(result.structured.needs_user_input)}.`
    );
  }

  if (
    typeof expect.approvalRequired === "boolean" &&
    result.structured.approval_required !== expect.approvalRequired
  ) {
    result.errors.push(
      `Expected approval_required=${String(expect.approvalRequired)} but got ${String(result.structured.approval_required)}.`
    );
  }

  if (
    typeof expect.requestedMutation === "boolean" &&
    result.structured.requested_mutation !== expect.requestedMutation
  ) {
    result.errors.push(
      `Expected requested_mutation=${String(expect.requestedMutation)} but got ${String(result.structured.requested_mutation)}.`
    );
  }

  if (expect.requireTelemetry) {
    if (typeof result.envelope.duration_ms !== "number") {
      result.errors.push("Missing duration_ms telemetry.");
    }
    if (typeof result.envelope.total_cost_usd !== "number") {
      result.errors.push("Missing total_cost_usd telemetry.");
    }
    if (typeof result.envelope.usage?.input_tokens !== "number") {
      result.errors.push("Missing usage.input_tokens telemetry.");
    }
    if (typeof result.envelope.usage?.output_tokens !== "number") {
      result.errors.push("Missing usage.output_tokens telemetry.");
    }
  }

  if (expect.expectNoPermissionDenials && (result.envelope.permission_denials?.length ?? 0) > 0) {
    result.errors.push("Expected no permission denials, but Claude reported at least one.");
  }

  if (expect.forbidApprovalLanguage) {
    const text = [result.envelope.result ?? "", result.structured.notes].join("\n");
    if (hasApprovalLanguage(text)) {
      result.errors.push("Detected approval/permission language in Claude response.");
    }
  }

  for (const pattern of expect.notesAllOf ?? []) {
    if (!textContainsPattern(result.structured.notes, pattern)) {
      result.errors.push(`Expected notes to include pattern '${pattern}'.`);
    }
  }

  for (const pattern of expect.notesNoneOf ?? []) {
    if (textContainsPattern(result.structured.notes, pattern)) {
      result.errors.push(`Notes unexpectedly included pattern '${pattern}'.`);
    }
  }
}

function applyWarnings(result: CaseResult, warn: WarningThresholds): void {
  if (!result.envelope) return;

  if (
    typeof warn.maxInputTokens === "number" &&
    typeof result.envelope.usage?.input_tokens === "number" &&
    result.envelope.usage.input_tokens > warn.maxInputTokens
  ) {
    result.warnings.push(
      `Input tokens ${result.envelope.usage.input_tokens} exceeded warning threshold ${warn.maxInputTokens}.`
    );
  }

  if (
    typeof warn.maxOutputTokens === "number" &&
    typeof result.envelope.usage?.output_tokens === "number" &&
    result.envelope.usage.output_tokens > warn.maxOutputTokens
  ) {
    result.warnings.push(
      `Output tokens ${result.envelope.usage.output_tokens} exceeded warning threshold ${warn.maxOutputTokens}.`
    );
  }

  if (
    typeof warn.maxTotalCostUsd === "number" &&
    typeof result.envelope.total_cost_usd === "number" &&
    result.envelope.total_cost_usd > warn.maxTotalCostUsd
  ) {
    result.warnings.push(
      `Total cost ${result.envelope.total_cost_usd} exceeded warning threshold ${warn.maxTotalCostUsd}.`
    );
  }

  if (
    typeof warn.maxReferencesLoaded === "number" &&
    result.structured &&
    result.structured.references_loaded.length > warn.maxReferencesLoaded
  ) {
    result.warnings.push(
      `Loaded ${result.structured.references_loaded.length} references, exceeding warning threshold ${warn.maxReferencesLoaded}.`
    );
  }
}

function runCase(repoRoot: string, suite: string, defaults: FixtureDefaults | undefined, testCase: FixtureCase): CaseResult {
  const mode = testCase.mode ?? defaults?.mode ?? "read-only";
  const effort = testCase.effort ?? defaults?.effort;
  const permissionMode = testCase.permissionMode ?? defaults?.permissionMode;
  const timeoutSeconds = testCase.timeoutSeconds ?? defaults?.timeoutSeconds;
  const retryCount = testCase.retryCount ?? defaults?.retryCount ?? 2;
  const prompt = buildPrompt(testCase, mode);
  const allowedTools = testCase.allowedTools ?? defaults?.allowedTools ?? [];
  const command = [
    "claude",
    "-p",
    "--output-format",
    "json",
    "--no-session-persistence",
  ];
  if (permissionMode) {
    command.push("--permission-mode", permissionMode);
  }
  if (effort) {
    command.push("--effort", effort);
  }
  if (allowedTools.length > 0) {
    command.push("--allowedTools", allowedTools.join(","));
  }
  if (mode !== "live") {
    command.push("--json-schema", STRUCTURED_OUTPUT_SCHEMA);
  }

  let lastResult: CaseResult | null = null;

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    const proc = spawnSync(command[0], command.slice(1), {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    input: prompt,
    timeout: typeof timeoutSeconds === "number" ? timeoutSeconds * 1000 : undefined,
    killSignal: "SIGKILL",
  });

    const stdout = proc.stdout ?? "";
    const stderr = proc.stderr ?? "";
    const envelope = parseEnvelope(stdout);
    const structured = parseStructuredOutput(envelope);
    const result: CaseResult = {
      suite,
      caseId: testCase.id,
      passed: false,
      errors: [],
      warnings: [],
      fixture: testCase,
      structured,
      envelope,
      prompt,
      stdout,
      stderr,
      exitCode: proc.status,
      timedOut: Boolean(proc.error && "code" in proc.error && proc.error.code === "ETIMEDOUT"),
    };

    if (attempt < retryCount && shouldRetryCase(result, mode)) {
      lastResult = result;
      continue;
    }

    assertCase(result, mergeExpectations(defaults?.expect, testCase.expect));
    applyWarnings(result, mergeWarnings(defaults?.warn, testCase.warn));
    result.passed = result.errors.length === 0;
    return result;
  }

  if (!lastResult) {
    throw new Error(`No Claude regression result produced for case '${testCase.id}'.`);
  }

  assertCase(lastResult, mergeExpectations(defaults?.expect, testCase.expect));
  applyWarnings(lastResult, mergeWarnings(defaults?.warn, testCase.warn));
  lastResult.passed = lastResult.errors.length === 0;
  return lastResult;
}

async function main(): Promise<void> {
  const repoRoot = resolve(getFlag("--repo-root") ?? process.cwd());
  const fixturePath = resolve(getFlag("--fixture") ?? join(repoRoot, "tests", "claude", "fixtures"));
  const caseFilter = getFlag("--case");
  const resultsDir = makeResultsDir(repoRoot, getFlag("--results-dir"));
  const fixtures = loadFixtures(fixturePath);
  const results: CaseResult[] = [];
  const sweepResults: DisposableSweepResult[] = [];
  const disposableGameNames = collectLiveDisposableGameNames(fixtures, caseFilter);

  if (disposableGameNames.length > 0) {
    const beforeSweep = await sweepDisposableGames(disposableGameNames, "before");
    sweepResults.push(beforeSweep);
    console.log(
      `[SWEEP before] names=${beforeSweep.targetedGameNames.length} deleted=${beforeSweep.deletedGameIds.length} remaining_active=${beforeSweep.remainingActiveGameIds.length}`
    );
    if (beforeSweep.error) {
      console.error(`- cleanup sweep error: ${beforeSweep.error}`);
    }
  }

  try {
    for (const fixture of fixtures) {
      if (!fixture.suite || !Array.isArray(fixture.cases) || fixture.cases.length === 0) {
        console.error("Each Claude fixture file must define a suite and at least one case.");
        process.exit(1);
      }

      for (const testCase of fixture.cases) {
        if (caseFilter && testCase.id !== caseFilter) continue;
        const result = runCase(repoRoot, fixture.suite, fixture.defaults, testCase);
        results.push(result);
        const status = result.passed ? "PASS" : "FAIL";
        const primary = result.structured?.primary_skill ?? "<missing>";
        const refs = result.structured?.references_loaded.length ?? 0;
        const inputTokens = result.envelope?.usage?.input_tokens ?? -1;
        const outputTokens = result.envelope?.usage?.output_tokens ?? -1;
        console.log(
          `[${status}] ${result.caseId} primary=${primary} refs=${refs} tokens=${inputTokens}/${outputTokens} warnings=${result.warnings.length}`
        );
        if (!result.passed) {
          for (const error of result.errors) console.error(`- ${error}`);
        }
        for (const warning of result.warnings) {
          console.warn(`! ${warning}`);
        }

        writeFileSync(join(resultsDir, `${result.caseId}.json`), JSON.stringify(result, null, 2));
      }
    }
  } finally {
    if (disposableGameNames.length > 0) {
      const afterSweep = await sweepDisposableGames(disposableGameNames, "after");
      sweepResults.push(afterSweep);
      console.log(
        `[SWEEP after] names=${afterSweep.targetedGameNames.length} deleted=${afterSweep.deletedGameIds.length} remaining_active=${afterSweep.remainingActiveGameIds.length}`
      );
      if (afterSweep.error) {
        console.error(`- cleanup sweep error: ${afterSweep.error}`);
      }
    }
  }

  if (results.length === 0) {
    console.error("No Claude regression cases matched the current filter.");
    process.exit(1);
  }

  const summary = {
    generated_at: new Date().toISOString(),
    fixture_path: fixturePath,
    results_dir: resultsDir,
    total: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
    cleanup: sweepResults,
    cases: results.map((result) => ({
      suite: result.suite,
      caseId: result.caseId,
      passed: result.passed,
      primary_skill: result.structured?.primary_skill ?? null,
      references_loaded: result.structured?.references_loaded ?? [],
      input_tokens: result.envelope?.usage?.input_tokens ?? null,
      output_tokens: result.envelope?.usage?.output_tokens ?? null,
      total_cost_usd: result.envelope?.total_cost_usd ?? null,
      timed_out: result.timedOut,
      errors: result.errors,
      warnings: result.warnings,
    })),
  };

  writeFileSync(join(resultsDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(`Claude regression results written to ${resultsDir}`);

  const cleanupFailed = sweepResults.some(
    (result) => !!result.error || result.remainingActiveGameIds.length > 0
  );
  if (summary.failed > 0 || cleanupFailed) process.exit(1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Claude regression runner failed: ${message}`);
  process.exit(1);
});
