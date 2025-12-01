import { endOfMonth, startOfMonth } from "date-fns";
import { Folder, Fund, Transaction } from "db/schema";
import {
  and,
  asc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lt,
  sum,
} from "drizzle-orm";
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
    .mutation(({ input, ctx }) =>
      ctx.db.insert(Fund).values({
        ...input,
        budgetedAmount: input.budgetedAmount.toString(),
      })
    ),
  list: protectedProcedure.query(async ({ ctx }) => {
    // Use db.select for explicit join and type safety
    const funds = await ctx.db
      .select({
        ...getTableColumns(Fund),
      })
      .from(Fund)
      .innerJoin(Folder, eq(Fund.folderId, Folder.id))
      // TODO: implement auth
      // .where(eq(Folder.userId, ctx.auth.userId || ""))
      .orderBy(asc(Fund.name));

    const totalSpentByFund = await ctx.db
      .select({
        fundId: Transaction.fundId,
        amount: sum(Transaction.amount).mapWith(Number),
      })
      .from(Transaction)
      .where(
        and(
          inArray(
            Transaction.fundId,
            funds.map((f) => f.id)
          ),
          gte(Transaction.date, startOfMonth(new Date())),
          lt(Transaction.date, endOfMonth(new Date()))
        )
      )
      .groupBy(Transaction.fundId);

    const totalSpentMap: Record<number, number> = {};
    for (const t of totalSpentByFund) {
      totalSpentMap[t.fundId] = t.amount;
    }

    return funds.map((fund) => ({
      ...fund,
      budgetedAmount: Number(fund.budgetedAmount),
      totalSpent: totalSpentMap[fund.id] || 0,
    }));
  }),
  retrieve: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const fund = await ctx.db.query.Fund.findFirst({
        where: eq(Fund.id, input),
      });

      if (!fund) {
        return null;
      }

      return {
        ...fund,
        budgetedAmount: Number(fund.budgetedAmount),
      };
    }),
});
