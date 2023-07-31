import { z } from "zod"
import { startOfMonth, addMonths } from "date-fns"

import { router, publicProcedure } from "../trpc"
import { fundTypeSchema, timeModeSchema } from "../utils/enums"

export const fundsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        budgetedAmount: z.number().default(0),
        fundType: fundTypeSchema,
        folderId: z.number(),
        timeMode: timeModeSchema,
        userId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => ctx.prisma.fund.create({ data: input })),
  listFromUserId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.fund.findMany({
      where: {
        userId: input,
      },
      include: {
        transactions: {
          select: { id: true, amount: true },
          where: {
            date: {
              gte: startOfMonth(new Date()),
              lte: startOfMonth(addMonths(new Date(), 1)),
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
  }),
})
