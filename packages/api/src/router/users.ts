import { User } from "db/schema";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const usersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(12),
        name: z.string().nullable().default(null),
      })
    )
    .mutation(({ ctx, input }) => ctx.db.insert(User).values(input)),
  remove: protectedProcedure.mutation(({ ctx }) => {
    // TODO: implement auth
    // ctx.db.delete(User).where(eq(User.id, ctx.auth.userId || ""))
  }),
});
