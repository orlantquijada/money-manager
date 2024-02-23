import { prisma } from "db"
import { type inferAsyncReturnType } from "@trpc/server"
import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"
import { getAuth } from "@clerk/fastify"

type Session = Required<ReturnType<typeof getAuth>>

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  auth: Session | null
}

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    prisma,
  }
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateFastifyContextOptions) => {
  return await createContextInner({
    auth: getAuth(opts.req),
  })
}

export type Context = inferAsyncReturnType<typeof createContext>
