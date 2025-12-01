import { Folder, Transaction } from "db/schema";
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
    .mutation(({ input, ctx }) =>
      ctx.db.insert(Folder).values({
        ...input,
        userId: ctx.auth.userId || "",
      })
    ),
  remove: protectedProcedure
    .input(z.number())
    .mutation(({ input, ctx }) =>
      ctx.db.delete(Folder).where(eq(Folder.id, input))
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
      const foldersWithFunds = await ctx.db.query.Folder.findMany({
        where: eq(Folder.userId, ctx.auth.userId || ""),
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
          fundId: Transaction.fundId,
          amount: sum(Transaction.amount).mapWith(Number),
        })
        .from(Transaction)
        .where(
          and(
            inArray(Transaction.fundId, fundIds),
            input?.startDate
              ? gte(Transaction.date, input.startDate)
              : undefined,
            input?.endDate ? lte(Transaction.date, input.endDate) : undefined
          )
        )
        .groupBy(Transaction.fundId);

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
    ctx.db.query.Folder.findMany({
      where: eq(Folder.userId, ctx.auth.userId || ""),
    })
  ),
});
