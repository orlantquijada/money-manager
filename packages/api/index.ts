// biome-ignore lint/style/noExportedImports: 👍
import type { AppRouter } from "./src/router";

// biome-ignore lint/performance/noBarrelFile: 👍
export { appRouter } from "./src/router";
export * from "./src/utils/types";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { RouterInputs, RouterOutputs, AppRouter };
export { createTRPCContext } from "./src/context";
