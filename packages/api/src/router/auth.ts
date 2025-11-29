import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ctx.auth),
  getSecretMessage: protectedProcedure.query(() => {
    // testing type validation of overridden next-auth Session in @acme/auth package
    return "you can see this secret message!";
  }),
  creds: publicProcedure.query(() => ({
    key: process.env.MM_KEY || "",
    dpw: process.env.MM_DPW || "",
  })),
});
