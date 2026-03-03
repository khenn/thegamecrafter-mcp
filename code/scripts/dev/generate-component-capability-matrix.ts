import { readFile, writeFile } from "node:fs/promises";
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

async function readCoverageProfile(repoRoot: string): Promise<CoverageProfile> {
  const profilePaths = [
    path.join(repoRoot, "skills/tgc-component-preflight/references/component-profiles.md"),
    path.join(repoRoot, "skills/tgc-book-rulebook-workflows/references/book-component-profiles.md"),
  ];
  const identityPattern = /\(`([A-Za-z0-9]+)`\)/g;
  const coveredIdentities = new Set<string>();

  for (const profilePath of profilePaths) {
    const text = await readFile(profilePath, "utf8");
    for (const match of text.matchAll(identityPattern)) {
      const identity = (match[1] ?? "").trim();
      if (identity) coveredIdentities.add(identity);
    }
  }

  return { coveredIdentities };
}

async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = docsRootFromScriptDir(scriptDir);
  const toolsDir = path.join(repoRoot, "tools");
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

    const lines: string[] = [];
    lines.push("# TGC Component Capability Matrix");
    lines.push("");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("");
    lines.push("## Scope");
    lines.push("This matrix is generated from live `GET /api/tgc/products` data.");
    lines.push("Support means the required create APIs are covered by validated MCP write primitives.");
    lines.push("");
    lines.push("## Summary");
    lines.push(`- Active catalog products discovered: ${uniqueProducts.length}`);
    lines.push(`- Fully supported products: ${fullySupported.length}`);
    lines.push(`- Products with gaps: ${gaps.length}`);
    lines.push(`- Missing create APIs (unique): ${unsupportedApis.length}`);
    lines.push("");
    lines.push("## Validated Create APIs");
    for (const api of Array.from(VALIDATED_CREATE_APIS).sort((a, b) => a.localeCompare(b))) {
      lines.push(`- \`${api}\``);
    }
    lines.push("");
    lines.push("## Missing Create APIs");
    if (unsupportedApis.length === 0) {
      lines.push("- None");
    } else {
      for (const api of unsupportedApis) lines.push(`- \`${api}\``);
    }
    lines.push("");
    lines.push("## Product Gaps");
    lines.push(markdownTable(gapRows).trimEnd());
    lines.push("");

    const capabilityMatrixPath = path.join(toolsDir, "tgc-component-capability-matrix.md");
    await writeFile(capabilityMatrixPath, `${lines.join("\n")}\n`, "utf8");
    console.log("Wrote tools/tgc-component-capability-matrix.md");
    console.log(`Products: total=${uniqueProducts.length} supported=${fullySupported.length} gaps=${gaps.length}`);

    const coverageProfile = await readCoverageProfile(repoRoot);
    const coveredByIdentity = uniqueProducts.filter((product) => coverageProfile.coveredIdentities.has(product.identity));
    const underserved = uniqueProducts.filter((product) => !coverageProfile.coveredIdentities.has(product.identity));

    const byCategory = new Map<string, { total: number; covered: number; underserved: number }>();
    for (const product of uniqueProducts) {
      const category = product.categories[0] ?? "Uncategorized";
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
        product.categories[0] ?? "",
        product.createApi ? `\`${product.createApi}\`` : "",
        `https://www.thegamecrafter.com/make/products/${product.identity}`,
      ]);

    const indexLines: string[] = [];
    indexLines.push("# TGC Component Coverage Index");
    indexLines.push("");
    indexLines.push(`Generated: ${new Date().toISOString()}`);
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
    scorecardLines.push(`Generated: ${new Date().toISOString()}`);
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
    scorecardLines.push("- Skill references:");
    scorecardLines.push("  - `skills/tgc-component-preflight/references/component-profiles.md`");
    scorecardLines.push("  - `skills/tgc-book-rulebook-workflows/references/book-component-profiles.md`");
    scorecardLines.push("");

    const coverageIndexPath = path.join(toolsDir, "tgc-component-coverage-index.md");
    const scorecardPath = path.join(toolsDir, "tgc-skill-coverage-scorecard.md");
    await writeFile(coverageIndexPath, `${indexLines.join("\n")}\n`, "utf8");
    await writeFile(scorecardPath, `${scorecardLines.join("\n")}\n`, "utf8");
    console.log("Wrote tools/tgc-component-coverage-index.md");
    console.log("Wrote tools/tgc-skill-coverage-scorecard.md");
  } finally {
    await tgc.logout().catch(() => {});
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`generate-component-capability-matrix failed: ${message}`);
  process.exitCode = 1;
});
