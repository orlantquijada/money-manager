import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"

export const usersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(12),
        name: z.string().nullable().default(null),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: input,
      })
    }),
  remove: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        id: ctx.auth.userId || "",
      },
    })
  }),
})
