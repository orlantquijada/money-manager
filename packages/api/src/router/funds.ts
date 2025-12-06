import { endOfMonth, startOfMonth } from "date-fns";
import { folders, funds, transactions } from "db/schema";
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

import { protectedProcedure, publicProcedure, router } from "../trpc";
import { fundTypeSchema, timeModeSchema } from "../utils/enums";

export const fundsRouter = router({
  hello: publicProcedure.query(() => "hello"),
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
      ctx.db.insert(funds).values({
        ...input,
        budgetedAmount: input.budgetedAmount.toString(),
      })
    ),
  list: protectedProcedure.query(async ({ ctx }) => {
    return [];
    // Use db.select for explicit join and type safety

    console.log("hello");
    const _funds = await ctx.db
      .select({
        ...getTableColumns(funds),
      })
      .from(funds)
      .innerJoin(folders, eq(funds.folderId, folders.id))
      // TODO: implement auth
      // .where(eq(folders.userId, ctx.auth.userId || ""))
      .orderBy(asc(funds.name));

    const totalSpentByFund = await ctx.db
      .select({
        fundId: transactions.fundId,
        amount: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          inArray(
            transactions.fundId,
            _funds.map((f) => f.id)
          ),
          gte(transactions.date, startOfMonth(new Date())),
          lt(transactions.date, endOfMonth(new Date()))
        )
      )
      .groupBy(transactions.fundId);

    const totalSpentMap: Record<number, number> = {};
    for (const t of totalSpentByFund) {
      totalSpentMap[t.fundId] = t.amount;
    }

    return _funds.map((fund) => ({
      ...fund,
      budgetedAmount: Number(fund.budgetedAmount),
      totalSpent: totalSpentMap[fund.id] || 0,
    }));
  }),
  retrieve: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const fund = await ctx.db.query.funds.findFirst({
        where: eq(funds.id, input),
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
