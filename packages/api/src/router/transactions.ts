import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { prisma } from "db"

export const transactionsRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany()
  }),
  retrieve: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.transaction.findFirst({ where: { id: input } })
  }),
  create: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input })
    }),
})
