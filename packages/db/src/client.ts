import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";
// biome-ignore lint/performance/noNamespaceImport: Drizzle schema standard
import * as schema from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case",
  schema,
});
