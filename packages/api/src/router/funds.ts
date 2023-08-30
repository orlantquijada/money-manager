import { z } from "zod"
import { startOfMonth, addMonths } from "date-fns"
import { Fund, Transaction } from "db"

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
      }),
    )
    .mutation(({ input, ctx }) => ctx.prisma.fund.create({ data: input })),
  listFromUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const funds = await ctx.prisma.fund.findMany({
        where: {
          folder: {
            userId: input,
          },
        },
        orderBy: {
          name: "asc",
        },
      })

      const totalSpentByFund = await ctx.prisma.transaction.groupBy({
        by: ["fundId"],
        where: {
          fundId: {
            in: funds.map(({ id }) => id),
          },
          date: {
            gte: startOfMonth(new Date()),
            lt: startOfMonth(addMonths(new Date(), 1)),
          },
        },
        _sum: {
          amount: true,
        },
      })

      const totalSpentMap: Record<Fund["id"], Transaction["amount"]> = {}
      for (const t of totalSpentByFund) {
        totalSpentMap[t.fundId] = t._sum.amount
      }

      return funds.map((fund) => ({
        ...fund,
        totalSpent: totalSpentMap[fund.id]?.toNumber() || 0,
      }))
    }),
  retrieve: publicProcedure.input(z.number()).query(({ ctx, input }) =>
    ctx.prisma.fund.findFirst({
      where: {
        id: input,
      },
    }),
  ),
})
