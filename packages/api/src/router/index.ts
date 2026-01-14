import { router } from "../trpc";
import { budgetRouter } from "./budget";
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
  budget: budgetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
