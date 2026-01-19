#!/usr/bin/env npx tsx

/**
 * Codemap Generation Script
 *
 * Analyzes the codebase structure and generates/updates documentation files
 * in docs/codemaps/. Produces a diff report when existing codemaps are found.
 *
 * Usage: npx tsx tools/generate-codemaps.ts
 */

import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CODEMAPS_DIR = path.join(ROOT_DIR, "docs/codemaps");
const REPORTS_DIR = path.join(ROOT_DIR, ".reports");

const TIMESTAMP = new Date().toISOString().split("T")[0];

// Utility functions
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function glob(pattern: string, cwd = ROOT_DIR): string[] {
  try {
    const result = execSync(`find ${cwd} -path "${pattern}" -type f 2>/dev/null`, {
      encoding: "utf8",
      cwd,
    });
    return result.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function listDir(dir: string): string[] {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter((f) => !f.startsWith("."));
}

function listDirRecursive(dir: string, ext?: string): string[] {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];

  const results: string[] = [];
  const traverse = (currentPath: string, relativePath: string) => {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const entryRelative = path.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        traverse(path.join(currentPath, entry.name), entryRelative);
      } else if (!ext || entry.name.endsWith(ext)) {
        results.push(entryRelative);
      }
    }
  };
  traverse(fullPath, "");
  return results;
}

function readFile(filePath: string): string | null {
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

function extractExports(content: string): string[] {
  const exports: string[] = [];
  const exportRegex = /export\s+(?:const|function|class|type|interface|enum)\s+(\w+)/g;
  let match;
  while ((match = exportRegex.exec(content))) {
    exports.push(match[1]);
  }
  return exports;
}

function extractRouterProcedures(content: string): string[] {
  const procedures: string[] = [];
  const procRegex = /(\w+):\s*(?:public|protected)Procedure/g;
  let match;
  while ((match = procRegex.exec(content))) {
    procedures.push(match[1]);
  }
  return procedures;
}

// Generators
function generateArchitecture(): string {
  const workspaceContent = readFile("pnpm-workspace.yaml") || "";
  const packageJson = JSON.parse(readFile("package.json") || "{}");
  const turboJson = JSON.parse(readFile("turbo.json") || "{}");

  const apps = listDir("apps");
  const packages = listDir("packages");

  let md = `<!-- Generated: ${TIMESTAMP} -->

# Architecture Codemap

## Monorepo Layout

\`\`\`
money-manager-2.0/
├── apps/
${apps.map((a) => `│   └── ${a}/`).join("\n")}
├── packages/
${packages.map((p) => `│   └── ${p}/`).join("\n")}
├── docs/
├── tooling/
└── skills/
\`\`\`

## Workspace Configuration

**pnpm-workspace.yaml** packages:
${workspaceContent
  .split("\n")
  .filter((l) => l.trim().startsWith("-"))
  .map((l) => `- \`${l.trim().slice(2)}\``)
  .join("\n")}

## Scripts

\`\`\`bash
${Object.entries(packageJson.scripts || {})
  .map(([k, v]) => `pnpm ${k.padEnd(15)} # ${v}`)
  .join("\n")}
\`\`\`

## Turbo Tasks

| Task | Cache |
|------|-------|
${Object.entries(turboJson.tasks || {})
  .map(([k, v]: [string, any]) => `| ${k} | ${v.cache === false ? "no" : "yes"} |`)
  .join("\n")}
`;

  return md;
}

function generateBackend(): string {
  const routerFiles = listDir("packages/api/src/router").filter((f) => f.endsWith(".ts"));

  const routers: { name: string; procedures: string[] }[] = [];
  for (const file of routerFiles) {
    if (file === "index.ts") continue;
    const content = readFile(`packages/api/src/router/${file}`);
    if (content) {
      const name = file.replace(".ts", "");
      const procedures = extractRouterProcedures(content);
      routers.push({ name, procedures });
    }
  }

  let md = `<!-- Generated: ${TIMESTAMP} -->

# Backend Codemap

## Package Structure

\`\`\`
packages/api/
├── index.ts
└── src/
    ├── context.ts
    ├── trpc.ts
    └── router/
${routerFiles.map((f) => `        └── ${f}`).join("\n")}
\`\`\`

\`\`\`
apps/server/
├── src/
│   └── index.ts
├── env.ts
└── tsup.config.ts
\`\`\`

## tRPC Routers

${routers
  .map(
    (r) => `### ${r.name}
Procedures: ${r.procedures.join(", ") || "(none found)"}`
  )
  .join("\n\n")}

## Server Endpoints

- \`GET /ping\` - Health check
- \`/trpc/*\` - tRPC handler
`;

  return md;
}

function generateFrontend(): string {
  const appFiles = listDirRecursive("apps/mobile/src/app", ".tsx");
  const components = listDir("apps/mobile/src/components");
  const hooks = listDir("apps/mobile/src/hooks").filter((f) => f.endsWith(".ts"));
  const stores = listDir("apps/mobile/src/stores").filter((f) => f.endsWith(".ts"));
  const contexts = listDir("apps/mobile/src/contexts").filter((f) => f.endsWith(".tsx"));
  const lib = listDir("apps/mobile/src/lib").filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
  const utils = listDir("apps/mobile/src/utils").filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

  let md = `<!-- Generated: ${TIMESTAMP} -->

# Frontend Codemap

## App Routes (Expo Router)

\`\`\`
apps/mobile/src/app/
${appFiles.map((f) => `├── ${f}`).join("\n")}
\`\`\`

## Components

${components.map((c) => `- \`${c}/\``).join("\n")}

## Hooks

${hooks.map((h) => `- \`${h}\``).join("\n")}

## Stores (Zustand)

${stores.map((s) => `- \`${s}\``).join("\n")}

## Contexts

${contexts.map((c) => `- \`${c}\``).join("\n")}

## Lib

${lib.map((l) => `- \`${l}\``).join("\n")}

## Utils

${utils.map((u) => `- \`${u}\``).join("\n")}
`;

  return md;
}

function generateData(): string {
  const schemaContent = readFile("packages/db/src/schema.ts") || "";

  // Extract table names
  const tableRegex = /export const (\w+) = pgTable\(/g;
  const tables: string[] = [];
  let match;
  while ((match = tableRegex.exec(schemaContent))) {
    tables.push(match[1]);
  }

  // Extract enums
  const enumRegex = /export const (\w+) = pgEnum\("(\w+)",\s*\[(.*?)\]\)/gs;
  const enums: { name: string; values: string[] }[] = [];
  while ((match = enumRegex.exec(schemaContent))) {
    const values = match[3]
      .split(",")
      .map((v) => v.trim().replace(/['"]/g, ""))
      .filter(Boolean);
    enums.push({ name: match[1], values });
  }

  let md = `<!-- Generated: ${TIMESTAMP} -->

# Data Codemap

## Package Structure

\`\`\`
packages/db/
├── src/
│   ├── schema.ts
│   ├── client.ts
│   ├── index.ts
│   └── seed.ts
├── env.ts
└── drizzle.config.ts
\`\`\`

## Enums

${enums.map((e) => `### ${e.name}\nValues: ${e.values.join(", ")}`).join("\n\n")}

## Tables

${tables.map((t) => `- \`${t}\``).join("\n")}

## Relationships

Tables with relations suffix define entity relationships via Drizzle \`relations()\`.
`;

  return md;
}

// Main execution
function main() {
  console.log("Generating codemaps...\n");

  ensureDir(CODEMAPS_DIR);
  ensureDir(REPORTS_DIR);

  const generators: Record<string, () => string> = {
    architecture: generateArchitecture,
    backend: generateBackend,
    frontend: generateFrontend,
    data: generateData,
  };

  const diffs: string[] = [];

  for (const [name, generator] of Object.entries(generators)) {
    const filePath = path.join(CODEMAPS_DIR, `${name}.md`);
    const existingContent = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf8")
      : null;

    const newContent = generator();

    // Generate diff if file exists
    if (existingContent) {
      const oldLines = existingContent.split("\n");
      const newLines = newContent.split("\n");

      const added = newLines.filter((l) => !oldLines.includes(l)).length;
      const removed = oldLines.filter((l) => !newLines.includes(l)).length;

      if (added > 0 || removed > 0) {
        diffs.push(`## ${name}.md\n+${added} lines, -${removed} lines`);
      }
    } else {
      diffs.push(`## ${name}.md\n(new file)`);
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`  Generated: ${name}.md`);
  }

  // Write diff report
  const diffReport = `# Codemap Generation Report
Generated: ${TIMESTAMP}

${diffs.length > 0 ? diffs.join("\n\n") : "No changes detected."}
`;

  const diffPath = path.join(REPORTS_DIR, "codemap-diff.txt");
  fs.writeFileSync(diffPath, diffReport);
  console.log(`\nDiff report: .reports/codemap-diff.txt`);

  console.log("\nDone!");
}

main();
