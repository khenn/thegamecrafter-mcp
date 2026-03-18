import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readEnvConfig } from "../../src/config/env.js";
import { TgcService } from "../../src/tgc/service.js";

type JsonObject = Record<string, unknown>;

type Product = {
  identity: string;
  name: string;
  relationship: string;
  categories: string[];
  createApi: string;
  childCreateApi: string;
  childRelationship: string;
};

type CoverageProfile = {
  coveredIdentities: Set<string>;
  sourceFilesByIdentity: Map<string, Set<string>>;
  profilePaths: string[];
};

type OwnerCoverageRow = {
  owner: string;
  total: number;
  baselineGuided: number;
  remaining: number;
  coveragePercent: number;
};

type GeneratedArtifacts = {
  capabilityMatrix: string;
  coverageIndex: string;
  ownerMap: string;
  scorecard: string;
  summaryJson: string;
  summary: {
    generated_at: string;
    catalog: {
      activeProducts: number;
      fullySupportedProducts: number;
      productGaps: number;
      missingCreateApis: string[];
    };
    guidance: {
      coveredIdentities: number;
      underservedIdentities: number;
      coveragePercent: number;
    };
    ownerFamilies: OwnerCoverageRow[];
    inputProfilePaths: string[];
  };
};

const VALIDATED_CREATE_APIS = new Set<string>([
  "/api/deck",
  "/api/card",
  "/api/twosidedset",
  "/api/twosided",
  "/api/twosidedsluggedset",
  "/api/twosidedslugged",
  "/api/onesidedsluggedset",
  "/api/onesidedslugged",
  "/api/part",
  "/api/gamepart",
  "/api/tuckbox",
  "/api/hookbox",
  "/api/twosidedbox",
  "/api/boxtop",
  "/api/boxtopgloss",
  "/api/twosidedboxgloss",
  "/api/boxface",
  "/api/onesided",
  "/api/onesidedgloss",
  "/api/dial",
  "/api/customcutonesidedslugged",
  "/api/customcuttwosidedslugged",
  "/api/threesidedcustomcutset",
  "/api/threesidedcustomcut",
  "/api/document",
  "/api/booklet",
  "/api/bookletpage",
  "/api/coilbook",
  "/api/coilbookpage",
  "/api/perfectboundbook",
  "/api/perfectboundbookpage",
  "/api/scorepad",
  "/api/acrylicshape",
  "/api/customprintedmeeple",
  "/api/customcolord4",
  "/api/customcolord6",
  "/api/customcolord8",
]);

function asObject(value: unknown): JsonObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as JsonObject;
}

function asItems(value: unknown): JsonObject[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asObject(item)).filter((item): item is JsonObject => item !== null);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeCreateApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/api/")) return trimmed;
  if (trimmed.startsWith("api/")) return `/${trimmed}`;
  return `/api/${trimmed.replace(/^\/+/, "")}`;
}

function toProducts(items: JsonObject[]): Product[] {
  return items.map((item) => {
    const child = asObject(item.child);
    return {
      identity: asString(item.identity) || "<unknown>",
      name: asString(item.name) || "<unnamed>",
      relationship: asString(item.relationship),
      categories: asStringArray(item.categories),
      createApi: normalizeCreateApi(asString(item.create_api)),
      childCreateApi: normalizeCreateApi(asString(child?.create_api)),
      childRelationship: asString(child?.relationship),
    };
  });
}

function requiredApis(product: Product): string[] {
  const apis = new Set<string>();
  if (product.createApi) apis.add(product.createApi);
  if (product.childCreateApi) apis.add(product.childCreateApi);
  return Array.from(apis);
}

function isFullySupported(product: Product): boolean {
  const req = requiredApis(product);
  return req.length > 0 && req.every((api) => VALIDATED_CREATE_APIS.has(api));
}

function markdownTable(rows: string[][]): string {
  if (rows.length === 0) return "_None_\n";
  const header = "| Identity | Name | Category | Required APIs | Missing APIs |";
  const sep = "|---|---|---|---|---|";
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return `${header}\n${sep}\n${body}\n`;
}

function docsRootFromScriptDir(scriptDir: string): string {
  return path.resolve(scriptDir, "../../..");
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/^Generated: .+$/gm, "Generated: <normalized>")
    .replace(/"generated_at":\s*"[^"]+"/g, "\"generated_at\": \"<normalized>\"");
}

async function readCoverageProfile(repoRoot: string): Promise<CoverageProfile> {
  const skillsDir = path.join(repoRoot, "skills");
  const skillEntries = await readdir(skillsDir, { withFileTypes: true });
  const profilePaths: string[] = [];
  for (const entry of skillEntries) {
    if (!entry.isDirectory()) continue;
    const referencesDir = path.join(skillsDir, entry.name, "references");
    try {
      const referenceEntries = await readdir(referencesDir, { withFileTypes: true });
      for (const refEntry of referenceEntries) {
        if (!refEntry.isFile()) continue;
        if (!refEntry.name.endsWith("component-profiles.md")) continue;
        profilePaths.push(path.join(referencesDir, refEntry.name));
      }
    } catch {
      continue;
    }
  }
  const identityPattern = /\(`([A-Za-z0-9]+)`\)/g;
  const coveredIdentities = new Set<string>();
  const sourceFilesByIdentity = new Map<string, Set<string>>();

  for (const profilePath of profilePaths) {
    const text = await readFile(profilePath, "utf8");
    for (const match of text.matchAll(identityPattern)) {
      const identity = (match[1] ?? "").trim();
      if (identity) {
        coveredIdentities.add(identity);
        const sourceFiles = sourceFilesByIdentity.get(identity) ?? new Set<string>();
        sourceFiles.add(path.relative(repoRoot, profilePath));
        sourceFilesByIdentity.set(identity, sourceFiles);
      }
    }
  }

  profilePaths.sort((a, b) => a.localeCompare(b));
  return { coveredIdentities, sourceFilesByIdentity, profilePaths };
}

function primaryCategory(product: Product): string {
  return product.categories[0] ?? "Uncategorized";
}

function targetOwnerSkill(product: Product): string {
  const category = primaryCategory(product);
  const createApis = new Set(requiredApis(product));

  if (
    category === "Books" ||
    category === "Score Pads" ||
    createApis.has("/api/document") ||
    createApis.has("/api/booklet") ||
    createApis.has("/api/bookletpage") ||
    createApis.has("/api/coilbook") ||
    createApis.has("/api/coilbookpage") ||
    createApis.has("/api/perfectboundbook") ||
    createApis.has("/api/perfectboundbookpage") ||
    createApis.has("/api/scorepad")
  ) {
    return "tgc-book-rulebook-workflows";
  }

  if (
    category === "Packaging" ||
    createApis.has("/api/tuckbox") ||
    createApis.has("/api/hookbox") ||
    createApis.has("/api/twosidedbox") ||
    createApis.has("/api/boxtop") ||
    createApis.has("/api/boxtopgloss") ||
    createApis.has("/api/twosidedboxgloss") ||
    createApis.has("/api/boxface")
  ) {
    return "tgc-packaging-workflows";
  }

  if (category === "Cards" || createApis.has("/api/deck") || createApis.has("/api/card")) {
    return "tgc-card-deck-workflows";
  }

  if (
    category === "Punchouts" ||
    category === "Stickers" ||
    category === "Dials" ||
    createApis.has("/api/dial") ||
    createApis.has("/api/customcutonesidedslugged") ||
    createApis.has("/api/customcuttwosidedslugged") ||
    createApis.has("/api/threesidedcustomcutset") ||
    createApis.has("/api/threesidedcustomcut") ||
    createApis.has("/api/onesidedslugged") ||
    createApis.has("/api/onesidedsluggedset") ||
    createApis.has("/api/twosidedslugged") ||
    createApis.has("/api/twosidedsluggedset")
  ) {
    return "tgc-custom-cut-workflows";
  }

  if (category === "Boards" || category === "Mats" || category === "Screens") {
    return "tgc-board-mat-workflows";
  }

  if (category === "Parts") {
    return "tgc-parts-dice-workflows";
  }

  return "tgc-guided-workflows";
}

function secondarySupportSkills(product: Product): string[] {
  const supports = new Set<string>();
  const owner = targetOwnerSkill(product);

  if (owner !== "tgc-guided-workflows") supports.add("tgc-guided-workflows");

  const category = primaryCategory(product);
  if (category !== "Parts" || product.createApi !== "/api/part") {
    supports.add("tgc-image-preflight-fit");
  }

  return Array.from(supports).sort((a, b) => a.localeCompare(b));
}

function coverageLevel(product: Product, coverageProfile: CoverageProfile): string {
  if (!coverageProfile.coveredIdentities.has(product.identity)) {
    return "Level 1 - Owned";
  }
  return "Level 2 - Baseline-guided";
}

async function assertFileMatches(filePath: string, expected: string): Promise<void> {
  let actual: string;
  try {
    actual = await readFile(filePath, "utf8");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Missing generated artifact ${filePath}: ${message}`);
  }

  if (normalizeOutput(actual) !== normalizeOutput(expected)) {
    throw new Error(`Generated artifact drift detected for ${filePath}. Run npm --prefix code run report:component-matrix.`);
  }
}

async function generateArtifacts(repoRoot: string): Promise<GeneratedArtifacts> {
  const env = readEnvConfig();
  const tgc = new TgcService(env);

  await tgc.login({});
  try {
    const raw = await tgc.listTgcProducts(true);
    const products = toProducts(asItems(raw.items));

    const byIdentity = new Map<string, Product>();
    for (const product of products) {
      if (!byIdentity.has(product.identity)) {
        byIdentity.set(product.identity, product);
      }
    }
    const uniqueProducts = Array.from(byIdentity.values()).sort((a, b) =>
      a.identity.localeCompare(b.identity),
    );

    const fullySupported = uniqueProducts.filter(isFullySupported);
    const gaps = uniqueProducts.filter((product) => !isFullySupported(product));

    const allRequiredApis = new Set<string>();
    for (const product of uniqueProducts) {
      for (const api of requiredApis(product)) allRequiredApis.add(api);
    }

    const unsupportedApis = Array.from(allRequiredApis)
      .filter((api) => !VALIDATED_CREATE_APIS.has(api))
      .sort((a, b) => a.localeCompare(b));

    const gapRows = gaps.map((product) => {
      const req = requiredApis(product);
      const missing = req.filter((api) => !VALIDATED_CREATE_APIS.has(api));
      return [
        `\`${product.identity}\``,
        product.name,
        product.categories[0] ?? "",
        req.map((api) => `\`${api}\``).join(", "),
        missing.map((api) => `\`${api}\``).join(", "),
      ];
    });

    const generatedAt = new Date().toISOString();
    const capabilityLines: string[] = [];
    capabilityLines.push("# TGC Component Capability Matrix");
    capabilityLines.push("");
    capabilityLines.push(`Generated: ${generatedAt}`);
    capabilityLines.push("");
    capabilityLines.push("## Scope");
    capabilityLines.push("This matrix is generated from live `GET /api/tgc/products` data.");
    capabilityLines.push("Support means the required create APIs are covered by validated MCP write primitives.");
    capabilityLines.push("");
    capabilityLines.push("## Summary");
    capabilityLines.push(`- Active catalog products discovered: ${uniqueProducts.length}`);
    capabilityLines.push(`- Fully supported products: ${fullySupported.length}`);
    capabilityLines.push(`- Products with gaps: ${gaps.length}`);
    capabilityLines.push(`- Missing create APIs (unique): ${unsupportedApis.length}`);
    capabilityLines.push("");
    capabilityLines.push("## Validated Create APIs");
    for (const api of Array.from(VALIDATED_CREATE_APIS).sort((a, b) => a.localeCompare(b))) {
      capabilityLines.push(`- \`${api}\``);
    }
    capabilityLines.push("");
    capabilityLines.push("## Missing Create APIs");
    if (unsupportedApis.length === 0) {
      capabilityLines.push("- None");
    } else {
      for (const api of unsupportedApis) capabilityLines.push(`- \`${api}\``);
    }
    capabilityLines.push("");
    capabilityLines.push("## Product Gaps");
    capabilityLines.push(markdownTable(gapRows).trimEnd());
    capabilityLines.push("");

    const coverageProfile = await readCoverageProfile(repoRoot);
    const coveredByIdentity = uniqueProducts.filter((product) =>
      coverageProfile.coveredIdentities.has(product.identity),
    );
    const underserved = uniqueProducts.filter(
      (product) => !coverageProfile.coveredIdentities.has(product.identity),
    );

    const byCategory = new Map<string, { total: number; covered: number; underserved: number }>();
    for (const product of uniqueProducts) {
      const category = primaryCategory(product);
      const current = byCategory.get(category) ?? { total: 0, covered: 0, underserved: 0 };
      current.total += 1;
      if (coverageProfile.coveredIdentities.has(product.identity)) {
        current.covered += 1;
      } else {
        current.underserved += 1;
      }
      byCategory.set(category, current);
    }

    const categoryRows = Array.from(byCategory.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, counts]) => [
        category,
        String(counts.total),
        String(counts.covered),
        String(counts.underserved),
        `${Math.round((counts.covered / counts.total) * 100)}%`,
      ]);

    const underservedRows = underserved
      .sort((a, b) => a.identity.localeCompare(b.identity))
      .map((product) => [
        `\`${product.identity}\``,
        product.name,
        primaryCategory(product),
        product.createApi ? `\`${product.createApi}\`` : "",
        `https://www.thegamecrafter.com/make/products/${product.identity}`,
      ]);

    const indexLines: string[] = [];
    indexLines.push("# TGC Component Coverage Index");
    indexLines.push("");
    indexLines.push(`Generated: ${generatedAt}`);
    indexLines.push("");
    indexLines.push("## Scope");
    indexLines.push("This index is generated from live `GET /api/tgc/products` data and current skill reference profiles.");
    indexLines.push("Coverage here means an identity has explicit baseline guidance in skill references.");
    indexLines.push("");
    indexLines.push("## Summary");
    indexLines.push(`- Active catalog products discovered: ${uniqueProducts.length}`);
    indexLines.push(`- Skill-covered identities: ${coveredByIdentity.length}`);
    indexLines.push(`- Underserved identities: ${underserved.length}`);
    indexLines.push(
      `- Basic coverage ratio: ${Math.round((coveredByIdentity.length / Math.max(uniqueProducts.length, 1)) * 100)}%`,
    );
    indexLines.push("");
    indexLines.push("## Category Coverage");
    indexLines.push("| Category | Total | Covered | Underserved | Coverage |");
    indexLines.push("|---|---:|---:|---:|---:|");
    for (const row of categoryRows) {
      indexLines.push(`| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]} |`);
    }
    indexLines.push("");
    indexLines.push("## Underserved Identities");
    indexLines.push("| Identity | Name | Category | Create API | Product URL |");
    indexLines.push("|---|---|---|---|---|");
    for (const row of underservedRows) {
      indexLines.push(`| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]} |`);
    }
    indexLines.push("");

    const scorecardLines: string[] = [];
    scorecardLines.push("# TGC Skills Coverage Scorecard");
    scorecardLines.push("");
    scorecardLines.push(`Generated: ${generatedAt}`);
    scorecardLines.push("");
    scorecardLines.push("## Current Score");
    scorecardLines.push(`- Identity coverage: ${coveredByIdentity.length}/${uniqueProducts.length}`);
    scorecardLines.push(
      `- Coverage percent: ${Math.round((coveredByIdentity.length / Math.max(uniqueProducts.length, 1)) * 100)}%`,
    );
    scorecardLines.push(`- Underserved identities remaining: ${underserved.length}`);
    scorecardLines.push("");
    scorecardLines.push("## Top Underserved Categories");
    const topUnderserved = Array.from(byCategory.entries())
      .map(([category, counts]) => ({ category, ...counts }))
      .filter((row) => row.underserved > 0)
      .sort((a, b) => b.underserved - a.underserved || a.category.localeCompare(b.category));
    if (topUnderserved.length === 0) {
      scorecardLines.push("- None");
    } else {
      for (const row of topUnderserved) {
        scorecardLines.push(
          `- ${row.category}: underserved ${row.underserved}/${row.total} (covered ${row.covered}/${row.total})`,
        );
      }
    }
    scorecardLines.push("");
    scorecardLines.push("## Inputs");
    scorecardLines.push("- Live catalog: `/api/tgc/products`");
    scorecardLines.push("- Coverage contract: `tools/tgc-guidance-coverage-contract.md`");
    scorecardLines.push("- Skill references:");
    for (const profilePath of coverageProfile.profilePaths) {
      scorecardLines.push(`  - \`${path.relative(repoRoot, profilePath)}\``);
    }
    scorecardLines.push("");

    const byOwner = new Map<string, { total: number; baselineGuided: number }>();
    for (const product of uniqueProducts) {
      const owner = targetOwnerSkill(product);
      const current = byOwner.get(owner) ?? { total: 0, baselineGuided: 0 };
      current.total += 1;
      if (coverageProfile.coveredIdentities.has(product.identity)) {
        current.baselineGuided += 1;
      }
      byOwner.set(owner, current);
    }

    const ownerPriority = [
      "tgc-packaging-workflows",
      "tgc-card-deck-workflows",
      "tgc-custom-cut-workflows",
      "tgc-board-mat-workflows",
      "tgc-book-rulebook-workflows",
      "tgc-parts-dice-workflows",
      "tgc-guided-workflows",
    ];
    const ownerSummaryRows = ownerPriority
      .filter((owner) => byOwner.has(owner))
      .map((owner) => {
        const counts = byOwner.get(owner)!;
        return [
          owner,
          String(counts.total),
          String(counts.baselineGuided),
          String(counts.total - counts.baselineGuided),
          `${Math.round((counts.baselineGuided / Math.max(counts.total, 1)) * 100)}%`,
        ];
      });
    const ownerCoverageRows: OwnerCoverageRow[] = ownerPriority
      .filter((owner) => byOwner.has(owner))
      .map((owner) => {
        const counts = byOwner.get(owner)!;
        return {
          owner,
          total: counts.total,
          baselineGuided: counts.baselineGuided,
          remaining: counts.total - counts.baselineGuided,
          coveragePercent: Math.round((counts.baselineGuided / Math.max(counts.total, 1)) * 100),
        };
      });

    const ownerMapLines: string[] = [];
    ownerMapLines.push("# TGC Guidance Owner Map");
    ownerMapLines.push("");
    ownerMapLines.push(`Generated: ${generatedAt}`);
    ownerMapLines.push("");
    ownerMapLines.push("## Scope");
    ownerMapLines.push("This map assigns every active catalog identity to a target workflow-family owner for A5 guidance completion.");
    ownerMapLines.push("Current coverage level reflects the A5 Phase 1 contract baseline only.");
    ownerMapLines.push("");
    ownerMapLines.push("## Owner Family Summary");
    ownerMapLines.push("| Target owner skill | Total identities | Baseline-guided | Remaining to guide | Baseline coverage |");
    ownerMapLines.push("|---|---:|---:|---:|---:|");
    for (const row of ownerSummaryRows) {
      ownerMapLines.push(`| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]} |`);
    }
    ownerMapLines.push("");
    ownerMapLines.push("## Identity Owner Map");
    ownerMapLines.push("| Identity | Name | Category | Create API | Target owner | Secondary support | Current level | Current profile source |");
    ownerMapLines.push("|---|---|---|---|---|---|---|---|");
    for (const product of uniqueProducts) {
      const sourceFiles = Array.from(coverageProfile.sourceFilesByIdentity.get(product.identity) ?? [])
        .sort((a, b) => a.localeCompare(b))
        .map((value) => `\`${value}\``)
        .join(", ");
      ownerMapLines.push(
        `| \`${product.identity}\` | ${product.name} | ${primaryCategory(product)} | ${
          product.createApi ? `\`${product.createApi}\`` : ""
        } | \`${targetOwnerSkill(product)}\` | ${secondarySupportSkills(product)
          .map((value) => `\`${value}\``)
          .join(", ")} | ${coverageLevel(product, coverageProfile)} | ${sourceFiles || "_None_"} |`,
      );
    }
    ownerMapLines.push("");

    const summary = {
      generated_at: generatedAt,
      catalog: {
        activeProducts: uniqueProducts.length,
        fullySupportedProducts: fullySupported.length,
        productGaps: gaps.length,
        missingCreateApis: unsupportedApis,
      },
      guidance: {
        coveredIdentities: coveredByIdentity.length,
        underservedIdentities: underserved.length,
        coveragePercent: Math.round((coveredByIdentity.length / Math.max(uniqueProducts.length, 1)) * 100),
      },
      ownerFamilies: ownerCoverageRows,
      inputProfilePaths: coverageProfile.profilePaths.map((profilePath) => path.relative(repoRoot, profilePath)),
    };

    return {
      capabilityMatrix: `${capabilityLines.join("\n")}\n`,
      coverageIndex: `${indexLines.join("\n")}\n`,
      ownerMap: `${ownerMapLines.join("\n")}\n`,
      scorecard: `${scorecardLines.join("\n")}\n`,
      summaryJson: `${JSON.stringify(summary, null, 2)}\n`,
      summary,
    };
  } finally {
    await tgc.logout().catch(() => {});
  }
}

async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = docsRootFromScriptDir(scriptDir);
  const toolsDir = path.join(repoRoot, "tools");
  const checkOnly = hasFlag("--check");
  const artifacts = await generateArtifacts(repoRoot);

  const capabilityMatrixPath = path.join(toolsDir, "tgc-component-capability-matrix.md");
  const coverageIndexPath = path.join(toolsDir, "tgc-component-coverage-index.md");
  const ownerMapPath = path.join(toolsDir, "tgc-guidance-owner-map.md");
  const scorecardPath = path.join(toolsDir, "tgc-skill-coverage-scorecard.md");
  const summaryPath = path.join(toolsDir, "tgc-guidance-regression-summary.json");

  if (checkOnly) {
    await assertFileMatches(capabilityMatrixPath, artifacts.capabilityMatrix);
    await assertFileMatches(coverageIndexPath, artifacts.coverageIndex);
    await assertFileMatches(ownerMapPath, artifacts.ownerMap);
    await assertFileMatches(scorecardPath, artifacts.scorecard);
    await assertFileMatches(summaryPath, artifacts.summaryJson);

    if (
      artifacts.summary.catalog.productGaps !== 0 ||
      artifacts.summary.catalog.fullySupportedProducts !== artifacts.summary.catalog.activeProducts
    ) {
      throw new Error(
        `Capability regression detected: supported=${artifacts.summary.catalog.fullySupportedProducts} total=${artifacts.summary.catalog.activeProducts} gaps=${artifacts.summary.catalog.productGaps}.`,
      );
    }
    if (
      artifacts.summary.guidance.underservedIdentities !== 0 ||
      artifacts.summary.guidance.coveredIdentities !== artifacts.summary.catalog.activeProducts
    ) {
      throw new Error(
        `Guidance coverage regression detected: covered=${artifacts.summary.guidance.coveredIdentities} total=${artifacts.summary.catalog.activeProducts} underserved=${artifacts.summary.guidance.underservedIdentities}.`,
      );
    }

    const remainingOwners = artifacts.summary.ownerFamilies.filter((row) => row.remaining !== 0);
    if (remainingOwners.length > 0) {
      throw new Error(
        `Owner-family guidance regression detected: ${remainingOwners
          .map((row) => `${row.owner}:${row.remaining}`)
          .join(", ")}`,
      );
    }

    console.log(
      `A5 guidance check passed: supported=${artifacts.summary.catalog.fullySupportedProducts}/${artifacts.summary.catalog.activeProducts} covered=${artifacts.summary.guidance.coveredIdentities}/${artifacts.summary.catalog.activeProducts} coverage=${artifacts.summary.guidance.coveragePercent}%`,
    );
    return;
  }

  await writeFile(capabilityMatrixPath, artifacts.capabilityMatrix, "utf8");
  await writeFile(coverageIndexPath, artifacts.coverageIndex, "utf8");
  await writeFile(ownerMapPath, artifacts.ownerMap, "utf8");
  await writeFile(scorecardPath, artifacts.scorecard, "utf8");
  await writeFile(summaryPath, artifacts.summaryJson, "utf8");
  console.log("Wrote tools/tgc-component-capability-matrix.md");
  console.log("Wrote tools/tgc-component-coverage-index.md");
  console.log("Wrote tools/tgc-guidance-owner-map.md");
  console.log("Wrote tools/tgc-skill-coverage-scorecard.md");
  console.log("Wrote tools/tgc-guidance-regression-summary.json");
  console.log(
    `Products: total=${artifacts.summary.catalog.activeProducts} supported=${artifacts.summary.catalog.fullySupportedProducts} gaps=${artifacts.summary.catalog.productGaps}`,
  );
  console.log(
    `Guidance coverage: ${artifacts.summary.guidance.coveredIdentities}/${artifacts.summary.catalog.activeProducts} identities (${artifacts.summary.guidance.coveragePercent}%)`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`generate-component-capability-matrix failed: ${message}`);
  process.exitCode = 1;
});
