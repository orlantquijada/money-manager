import { router, publicProcedure } from "../trpc"
import { z } from "zod"

export const transactionsRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany()
  }),
  retrieve: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.transaction.findFirst({ where: { id: input } })
  }),
  create: publicProcedure
    .input(
      z.object({
        fundId: z.number().positive(),
        amount: z.number().default(0),
        date: z.string().datetime().optional(),
        note: z.string().default(""),
      }),
    )
    .mutation(({ ctx, input: { date, ...input } }) => {
      return ctx.prisma.transaction.create({
        data: date ? { date, ...input } : { ...input },
      })
    }),
})
