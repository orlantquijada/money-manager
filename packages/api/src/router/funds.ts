import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { folders, funds, stores, transactions } from "db/schema";
import {
  and,
  asc,
  countDistinct,
  desc,
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

const updateFundSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  budgetedAmount: z.number().optional(),
  timeMode: timeModeSchema.optional(),
  dueDay: z.number().min(1).max(31).nullable().optional(),
  folderId: z.number().optional(),
});

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
    const now = new Date();

    const _funds = await ctx.db
      .select({
        ...getTableColumns(funds),
      })
      .from(funds)
      .innerJoin(folders, eq(funds.folderId, folders.id))
      .where(eq(folders.userId, ctx.userId))
      .orderBy(asc(funds.name));

    if (_funds.length === 0) {
      return [];
    }

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
          gte(transactions.date, startOfMonth(now)),
          lt(transactions.date, endOfMonth(now))
        )
      )
      .groupBy(transactions.fundId);

    const totalSpentMap = new Map(
      totalSpentByFund.map((t) => [t.fundId, t.amount ?? 0])
    );

    return _funds.map((fund) => ({
      ...fund,
      budgetedAmount: Number(fund.budgetedAmount),
      totalSpent: totalSpentMap.get(fund.id) ?? 0,
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

      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, fund.folderId),
      });

      if (!folder || folder.userId !== ctx.userId) {
        return null;
      }

      const now = new Date();
      const [spent] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.fundId, input),
            gte(transactions.date, startOfMonth(now)),
            lt(transactions.date, endOfMonth(now))
          )
        );

      return {
        ...fund,
        budgetedAmount: Number(fund.budgetedAmount),
        totalSpent: spent?.amount ?? 0,
      };
    }),

  update: protectedProcedure
    .input(updateFundSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const fund = await ctx.db.query.funds.findFirst({
        where: eq(funds.id, id),
      });

      if (!fund) {
        throw new Error("Fund not found");
      }

      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, fund.folderId),
      });

      if (!folder || folder.userId !== ctx.userId) {
        throw new Error("Fund not found");
      }

      const updateData: Record<string, unknown> = { ...data };
      if (data.budgetedAmount !== undefined) {
        updateData.budgetedAmount = data.budgetedAmount.toString();
      }
      await ctx.db.update(funds).set(updateData).where(eq(funds.id, id));
    }),

  topStores: protectedProcedure
    .input(z.object({ fundId: z.number(), limit: z.number().default(3) }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const results = await ctx.db
        .select({
          storeId: transactions.storeId,
          storeName: stores.name,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(stores, eq(transactions.storeId, stores.id))
        .where(
          and(
            eq(transactions.fundId, input.fundId),
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, startOfMonth(now)),
            lt(transactions.date, endOfMonth(now))
          )
        )
        .groupBy(transactions.storeId, stores.name)
        .orderBy(desc(sum(transactions.amount)))
        .limit(input.limit);

      return results.map((r) => ({
        storeId: r.storeId,
        storeName: r.storeName,
        amount: r.amount ?? 0,
      }));
    }),

  periodComparison: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: fundId }) => {
      const now = new Date();
      const lastMonth = subMonths(now, 1);

      const [currentResult] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.fundId, fundId),
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, startOfMonth(now)),
            lt(transactions.date, endOfMonth(now))
          )
        );

      const [previousResult] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.fundId, fundId),
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, startOfMonth(lastMonth)),
            lt(transactions.date, endOfMonth(lastMonth))
          )
        );

      const current = currentResult?.amount ?? 0;
      const previous = previousResult?.amount ?? 0;

      if (previous === 0) {
        return null;
      }

      const difference = current - previous;
      const percentageChange = (difference / previous) * 100;

      return {
        current,
        previous,
        difference,
        percentageChange,
      };
    }),

  storeCount: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: fundId }) => {
      const now = new Date();
      const [result] = await ctx.db
        .select({ count: countDistinct(transactions.storeId) })
        .from(transactions)
        .where(
          and(
            eq(transactions.fundId, fundId),
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, startOfMonth(now)),
            lt(transactions.date, endOfMonth(now))
          )
        );
      return result?.count ?? 0;
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const fund = await ctx.db.query.funds.findFirst({
        where: eq(funds.id, input),
      });

      if (!fund) {
        throw new Error("Fund not found");
      }

      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, fund.folderId),
      });

      if (!folder || folder.userId !== ctx.userId) {
        throw new Error("Fund not found");
      }

      await ctx.db.delete(funds).where(eq(funds.id, input));
    }),
});
