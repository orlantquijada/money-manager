import { router } from "../trpc";
import { authRouter } from "./auth";
import { foldersRouter } from "./folders";
import { fundsRouter } from "./funds";
import { storesRouter } from "./stores";
import { transactionsRouter } from "./transactions";
import { usersRouter } from "./users";

export const appRouter = router({
  transaction: transactionsRouter,
  folder: foldersRouter,
  fund: fundsRouter,
  store: storesRouter,
  user: usersRouter,
});
export { authRouter };

// export type definition of API
export type AppRouter = typeof appRouter;
export type AuthRouter = typeof authRouter;
