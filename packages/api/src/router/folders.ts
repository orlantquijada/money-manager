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
      return ctx.db.insert(folders).values({
        ...input,
        userId: "igipxef036i5dc5k5rguz5a8", // TODO: replace with ctx.auth.userId when auth is implemented
      });
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
      const dateRange = {
        start: input?.startDate ?? startOfMonth(now),
        end: input?.endDate ?? endOfMonth(now),
      };

      const foldersWithFunds = await ctx.db.query.folders.findMany({
        // TODO: implement auth
        // where: eq(folders.userId, ctx.auth.userId || ""),
        with: {
          funds: { orderBy: (funds, { asc }) => asc(funds.createdAt) },
        },
        orderBy: (folders, { desc }) => desc(folders.createdAt),
      });

      const allFundIds = foldersWithFunds.flatMap((f) =>
        f.funds.map((fund) => fund.id)
      );

      const spentByFund =
        allFundIds.length > 0
          ? await ctx.db
              .select({
                fundId: transactions.fundId,
                amount: sum(transactions.amount).mapWith(Number),
              })
              .from(transactions)
              .where(
                and(
                  inArray(transactions.fundId, allFundIds),
                  gte(transactions.date, dateRange.start),
                  lte(transactions.date, dateRange.end)
                )
              )
              .groupBy(transactions.fundId)
          : [];

      const spentMap = new Map(
        spentByFund.map((t) => [t.fundId, t.amount ?? 0])
      );

      return foldersWithFunds.map((folder) => ({
        ...folder,
        funds: folder.funds.map((fund) => ({
          ...fund,
          budgetedAmount: Number(fund.budgetedAmount),
          totalSpent: spentMap.get(fund.id) ?? 0,
        })),
      }));
    }),

  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.folders.findMany({
      // TODO: implement auth
      // where: eq(folders.userId, ctx.auth.userId || ""),
    })
  ),
});
