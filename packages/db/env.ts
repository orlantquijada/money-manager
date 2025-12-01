import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/mini";

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    DATABASE_URL: z.string().check(z.minLength(1)),
  },
});
