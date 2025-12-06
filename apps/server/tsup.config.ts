import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  outDir: "api",
  minify: true,
  external: ["@hono/node-server"],
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
