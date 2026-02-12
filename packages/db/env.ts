import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/mini";

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    DATABASE_URL: z.string().check(z.minLength(1)),
    DATABASE_URL_UNPOOLED: z.optional(z.string()),
    USE_NEON_HTTP: z.optional(z.string()),
  },
});
