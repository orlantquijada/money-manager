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
      // ctx.db.insert(folders).values({
      //   ...input,
      //   userId: ctx.auth.userId || "",
      // })
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
      return [];
      const foldersWithFunds = await ctx.db.query.folders.findMany({
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

      const totalSpentByFund = await ctx.db
        .select({
          fundId: transactions.fundId,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .where(
          and(
            inArray(transactions.fundId, fundIds),
            input?.startDate
              ? gte(transactions.date, input.startDate)
              : undefined,
            input?.endDate ? lte(transactions.date, input.endDate) : undefined
          )
        )
        .groupBy(transactions.fundId);

      return foldersWithFunds.map((folder) => ({
        ...folder,
        funds: folder.funds.map((fund) => {
          const totalSpent =
            totalSpentByFund.find(({ fundId }) => fundId === fund.id)?.amount ||
            0;

          return {
            ...fund,
            budgetedAmount: Number(fund.budgetedAmount),
            totalSpent,
          };
        }),
      }));
    }),
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.folders.findMany({
      // where: eq(folders.userId, ctx.auth.userId || ""),
    })
  ),
});
