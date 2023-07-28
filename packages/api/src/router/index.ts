import { router } from "../trpc"
import { authRouter } from "./auth"
import { transactionsRouter } from "./transactions"
import { foldersRouter } from "./folders"
import { fundsRouter } from "./funds"
import { storesRouter } from "./stores"

export const appRouter = router({
  auth: authRouter,
  transaction: transactionsRouter,
  folder: foldersRouter,
  fund: fundsRouter,
  store: storesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
