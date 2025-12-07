import { endOfMonth, startOfMonth } from "date-fns";
import { folders, transactions } from "db/schema";
import { and, eq, gte, inArray, lte, sum } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const foldersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: implement auth
      // return ctx.db.insert(folders).values({
      //   ...input,
      //   userId: ctx.auth.userId || "",
      // });
    }),

  remove: protectedProcedure
    .input(z.number())
    .mutation(({ input, ctx }) =>
      ctx.db.delete(folders).where(eq(folders.id, input))
    ),

  listWithFunds: protectedProcedure
    .input(
      z
        .object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const dateStart = input?.startDate ?? startOfMonth(now);
      const dateEnd = input?.endDate ?? endOfMonth(now);

      // Fetch all folders with their funds
      const foldersWithFunds = await ctx.db.query.folders.findMany({
        // TODO: implement auth
        // where: eq(folders.userId, ctx.auth.userId || ""),
        with: {
          funds: {
            orderBy: (funds, { asc }) => asc(funds.createdAt),
          },
        },
        orderBy: (folders, { desc }) => desc(folders.createdAt),
      });

      const fundIds = foldersWithFunds.flatMap((folder) =>
        folder.funds.map((fund) => fund.id)
      );

      // Return early if no funds exist
      if (fundIds.length === 0) {
        return foldersWithFunds.map((folder) => ({
          ...folder,
          funds: folder.funds.map((fund) => ({
            ...fund,
            budgetedAmount: Number(fund.budgetedAmount),
            totalSpent: 0,
          })),
        }));
      }

      // Calculate total spent per fund within date range
      const totalSpentByFund = await ctx.db
        .select({
          fundId: transactions.fundId,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .where(
          and(
            inArray(transactions.fundId, fundIds),
            gte(transactions.date, dateStart),
            lte(transactions.date, dateEnd)
          )
        )
        .groupBy(transactions.fundId);

      // Map spending to each fund
      const spentMap = new Map(
        totalSpentByFund.map((t) => [t.fundId, t.amount ?? 0])
      );

      return foldersWithFunds.map((folder) => ({
        ...folder,
        funds: folder.funds.map((fund) => {
          const budgetedAmount = Number(fund.budgetedAmount);
          const totalSpent = spentMap.get(fund.id) ?? 0;

          return {
            ...fund,
            budgetedAmount,
            totalSpent,
          };
        }),
      }));
    }),

  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.folders.findMany({
      // TODO: implement auth
      // where: eq(folders.userId, ctx.auth.userId || ""),
    })
  ),
});
