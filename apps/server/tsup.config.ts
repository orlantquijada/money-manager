import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["api/index.ts"],
  format: ["esm"],
  outDir: "public",
  minify: true,
  noExternal: [
    "api",
    "db",
    /^@trpc/,
    /^@hono/,
    /^drizzle/,
    "hono",
    "superjson",
    "@t3-oss/env-core",
    "zod",
    "date-fns",
  ],
  platform: "node",
  target: "esnext",
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});
