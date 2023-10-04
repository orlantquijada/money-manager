import { protectedProcedure, publicProcedure, router } from "../trpc"

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!"
  }),
  creds: publicProcedure.query(() => {
    return {
      key: process.env.MM_KEY || "",
      dpw: process.env.MM_DPW || "",
    }
  }),
})
