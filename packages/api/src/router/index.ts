import { router } from "../trpc"
import { postRouter } from "./post"
import { authRouter } from "./auth"
import { transactionsRouter } from "./transactions"

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  transaction: transactionsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
