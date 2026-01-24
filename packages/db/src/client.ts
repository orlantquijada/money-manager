import { neon } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { env } from "../env";
// biome-ignore lint/performance/noNamespaceImport: Drizzle schema standard
import * as schema from "./schema";

const drizzleConfig = { casing: "snake_case", schema } as const;

export const db = (
  env.USE_NEON_HTTP === "true"
    ? drizzleNeon(neon(env.DATABASE_URL), drizzleConfig)
    : drizzlePg({ connection: env.DATABASE_URL, ...drizzleConfig })
) as NeonHttpDatabase<typeof schema>;

export type Database = typeof db;
