import { users } from "db/schema";
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
    .mutation(({ ctx, input }) => ctx.db.insert(users).values(input)),
  remove: protectedProcedure.mutation(() => {
    // TODO: implement auth
    // ctx.db.delete(users).where(eq(users.id, ctx.auth.userId || ""))
  }),
});
