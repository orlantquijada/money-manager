import { endOfMonth, startOfMonth } from "date-fns";
import type { Fund, Transaction } from "db";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";
import { fundTypeSchema, timeModeSchema } from "../utils/enums";

export const fundsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        budgetedAmount: z.number().default(0),
        fundType: fundTypeSchema,
        folderId: z.number(),
        timeMode: timeModeSchema,
      })
    )
    .mutation(({ input, ctx }) => ctx.prisma.fund.create({ data: input })),
  list: protectedProcedure.query(async ({ ctx }) => {
    const funds = await ctx.prisma.fund.findMany({
      where: {
        folder: {
          userId: ctx.auth?.userId || "",
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const totalSpentByFund = await ctx.prisma.transaction.groupBy({
      by: ["fundId"],
      where: {
        fundId: {
          in: funds.map(({ id }) => id),
        },
        date: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date()),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalSpentMap: Record<Fund["id"], Transaction["amount"]> = {};
    for (const t of totalSpentByFund) {
      totalSpentMap[t.fundId] = t._sum.amount;
    }

    return funds.map((fund) => ({
      ...fund,
      totalSpent: totalSpentMap[fund.id]?.toNumber() || 0,
    }));
  }),
  retrieve: protectedProcedure.input(z.number()).query(({ ctx, input }) =>
    ctx.prisma.fund.findFirst({
      where: {
        id: input,
      },
    })
  ),
});
