import { createEnv } from "@t3-oss/env-core";
import Constants from "expo-constants";
import { z } from "zod/mini";

const getDevUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  return host ? `http://${host}:3000` : undefined;
};

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  runtimeEnv: process.env,
  client: {
    EXPO_PUBLIC_API_URL: z._default(z.url(), getDevUrl() ?? ""),
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
});
