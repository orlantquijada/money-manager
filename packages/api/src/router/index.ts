import { router } from "../trpc"
import { postRouter } from "./post"
import { authRouter } from "./auth"
import { transactionsRouter } from "./transactions"
import { foldersRouter } from "./folders"
import { fundsRouter } from "./funds"

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  transaction: transactionsRouter,
  folder: foldersRouter,
  fund: fundsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
