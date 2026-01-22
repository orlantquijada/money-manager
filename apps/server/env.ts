import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/mini";

const isDev = process.env.NODE_ENV === "development";

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    CORS_ORIGIN: isDev
      ? z._default(z.string(), "*")
      : z.string().check(z.minLength(1)),
    CLERK_SECRET_KEY: z.string().check(z.minLength(1)),
    GOOGLE_AI_API_KEY: z.optional(z.string()),
  },
});
