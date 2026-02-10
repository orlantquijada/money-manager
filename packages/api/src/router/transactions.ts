import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { folders, funds, stores, transactions as txns } from "db/schema";
import { and, count, desc, eq, gte, lt, or, sum } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

const periodSchema = z.enum(["week", "month", "3mo", "all"]);
type Period = z.infer<typeof periodSchema>;

function getDateRangeForPeriod(period: Period): {
  start: Date | null;
  end: Date | null;
} {
  const now = new Date();
  switch (period) {
    case "week":
      return { start: subDays(now, 7), end: now };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "3mo":
      return { start: subMonths(startOfMonth(now), 2), end: endOfMonth(now) };
    case "all":
      return { start: null, end: null };
    default:
      return { start: null, end: null };
  }
}

function getPreviousPeriodDateRange(period: Period): {
  start: Date | null;
  end: Date | null;
} | null {
  const now = new Date();
  switch (period) {
    case "week": {
      const currentStart = subDays(now, 7);
      return { start: subDays(currentStart, 7), end: currentStart };
    }
    case "month": {
      const prevMonth = subMonths(now, 1);
      return { start: startOfMonth(prevMonth), end: endOfMonth(prevMonth) };
    }
    case "3mo": {
      const prevEnd = subMonths(startOfMonth(now), 3);
      return { start: subMonths(prevEnd, 2), end: endOfMonth(prevEnd) };
    }
    case "all":
      return null;
    default:
      return null;
  }
}

export const transactionsRouter = router({
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.transactions.findMany({
      where: eq(txns.userId, ctx.userId),
    })
  ),

  recentByFund: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const transactions = await ctx.db.query.transactions.findMany({
        where: and(eq(txns.userId, ctx.userId), eq(txns.fundId, input)),
        orderBy: desc(txns.date),
        limit: 10,
        with: {
          fund: {
            columns: {
              name: true,
            },
          },
          store: {
            columns: {
              name: true,
            },
          },
        },
      });

      return transactions.map((t) => ({
        ...t,
        fund: t.fund ?? { name: "Unknown" },
      }));
    }),

  listByFund: protectedProcedure
    .input(
      z.object({
        fundId: z.number(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { fundId, limit } = input;

      let cursorCondition: ReturnType<typeof or> | undefined;
      if (input.cursor) {
        const decoded = JSON.parse(
          Buffer.from(input.cursor, "base64").toString()
        );
        const cursorDate = new Date(decoded.date);
        cursorCondition = or(
          lt(txns.date, cursorDate),
          and(eq(txns.date, cursorDate), lt(txns.id, decoded.id))
        );
      }

      const results = await ctx.db.query.transactions.findMany({
        where: and(
          eq(txns.userId, ctx.userId),
          eq(txns.fundId, fundId),
          cursorCondition
        ),
        orderBy: [desc(txns.date), desc(txns.id)],
        limit: limit + 1,
        with: {
          fund: {
            columns: { name: true },
          },
          store: {
            columns: { name: true },
          },
        },
      });

      const hasMore = results.length > limit;
      const items = hasMore ? results.slice(0, limit) : results;

      let nextCursor: string | undefined;
      const lastItem = items.at(-1);
      if (hasMore && lastItem) {
        nextCursor = Buffer.from(
          JSON.stringify({ date: lastItem.date, id: lastItem.id })
        ).toString("base64");
      }

      return {
        transactions: items.map((t) => ({
          id: t.id,
          amount: Number(t.amount),
          date: t.date,
          note: t.note,
          fund: { name: t.fund?.name ?? "Unknown" },
          store: t.store ? { name: t.store.name } : undefined,
        })),
        nextCursor,
      };
    }),

  allThisMonth: protectedProcedure
    .input(
      z
        .object({
          fundId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const transactions = await ctx.db.query.transactions.findMany({
        where: and(
          eq(txns.userId, ctx.userId),
          gte(txns.date, startOfMonth(now)),
          lt(txns.date, endOfMonth(now)),
          input?.fundId ? eq(txns.fundId, input.fundId) : undefined
        ),
        with: {
          fund: {
            columns: {
              name: true,
            },
          },
          store: {
            columns: {
              name: true,
            },
          },
        },
        orderBy: desc(txns.date),
      });

      return transactions.map((t) => ({
        ...t,
        fund: t.fund ?? { name: "Unknown" },
      }));
    }),

  allLast7Days: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const transactions = await ctx.db.query.transactions.findMany({
      where: and(
        eq(txns.userId, ctx.userId),
        gte(txns.date, subDays(now, 7)),
        lt(txns.date, now)
      ),
      with: {
        fund: {
          columns: {
            name: true,
          },
        },
        store: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: desc(txns.date),
    });

    return transactions.map((t) => ({
      ...t,
      fund: t.fund ?? { name: "Unknown" },
    }));
  }),

  retrieve: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.db.query.transactions.findFirst({
        where: and(eq(txns.userId, ctx.userId), eq(txns.id, input)),
        with: {
          fund: {
            columns: { name: true },
          },
          store: {
            columns: { name: true },
          },
        },
      });

      if (!transaction) {
        return null;
      }

      return {
        ...transaction,
        fund: transaction.fund ?? { name: "Unknown" },
      };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(txns)
        .where(and(eq(txns.id, input), eq(txns.userId, ctx.userId)))
    ),

  markAsPaid: protectedProcedure
    .input(z.object({ fundId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const fund = await ctx.db.query.funds.findFirst({
        where: eq(funds.id, input.fundId),
      });
      if (!fund) {
        throw new Error("Fund not found");
      }

      const now = new Date();
      const weeksInMonth = Math.ceil(
        (endOfMonth(now).getDate() - startOfMonth(now).getDate() + 1) / 7
      );
      const timeModeMultipliers: Record<string, number> = {
        WEEKLY: weeksInMonth,
        BIMONTHLY: 2,
        MONTHLY: 1,
        EVENTUALLY: 1,
      };
      const multiplier = timeModeMultipliers[fund.timeMode] ?? 1;
      const monthlyBudget = Number(fund.budgetedAmount) * multiplier;

      const [spent] = await ctx.db
        .select({ amount: sum(txns.amount).mapWith(Number) })
        .from(txns)
        .where(
          and(
            eq(txns.userId, ctx.userId),
            eq(txns.fundId, input.fundId),
            gte(txns.date, startOfMonth(now)),
            lt(txns.date, endOfMonth(now))
          )
        );
      const totalSpent = spent?.amount ?? 0;

      const remainingAmount = monthlyBudget - totalSpent;
      if (remainingAmount > 0) {
        await ctx.db.insert(txns).values({
          fundId: input.fundId,
          amount: remainingAmount.toString(),
          date: now,
          note: "Marked as paid",
          userId: ctx.userId,
        });
      }

      await ctx.db
        .update(funds)
        .set({ paidAt: now })
        .where(eq(funds.id, input.fundId));
    }),

  create: protectedProcedure
    .input(
      z.object({
        fundId: z.number().positive(),
        amount: z.number().default(0),
        date: z.iso
          .datetime()
          .optional()
          .default(() => new Date().toJSON()),
        note: z.string().default(""),
        store: z.string().default(""),
      })
    )
    .mutation(async ({ ctx, input: { store: storeName, ...input } }) => {
      const _input = {
        ...input,
        amount: input.amount.toString(),
        date: new Date(input.date),
        userId: ctx.userId,
      };

      let storeId: number | undefined;

      if (storeName && storeName.trim().length > 0) {
        const normalizedName = storeName.trim();
        const existingStore = await ctx.db.query.stores.findFirst({
          where: and(
            eq(stores.name, normalizedName),
            eq(stores.userId, ctx.userId)
          ),
        });

        if (existingStore) {
          storeId = existingStore.id;
          await ctx.db
            .update(stores)
            .set({ lastSelectedFundId: input.fundId })
            .where(eq(stores.id, storeId));
        } else {
          const [newStore] = await ctx.db
            .insert(stores)
            .values({
              name: normalizedName,
              userId: ctx.userId,
              lastSelectedFundId: input.fundId,
            })
            .returning({ id: stores.id });
          storeId = newStore?.id;
        }
      }

      return ctx.db.insert(txns).values({
        ..._input,
        storeId,
      });
    }),

  totalThisMonth: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const result = await ctx.db
      .select({ amount: sum(txns.amount).mapWith(Number) })
      .from(txns)
      .where(
        and(
          eq(txns.userId, ctx.userId),
          gte(txns.date, startOfMonth(now)),
          lt(txns.date, endOfMonth(now))
        )
      );

    return result[0]?.amount ?? 0;
  }),

  totalLastMonth: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const result = await ctx.db
      .select({ amount: sum(txns.amount).mapWith(Number) })
      .from(txns)
      .where(
        and(
          eq(txns.userId, ctx.userId),
          gte(txns.date, startOfMonth(lastMonth)),
          lt(txns.date, endOfMonth(lastMonth))
        )
      );

    return result[0]?.amount ?? 0;
  }),

  byFund: protectedProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const txnsResult = await ctx.db
        .select({
          fundId: txns.fundId,
          amount: sum(txns.amount).mapWith(Number),
        })
        .from(txns)
        .where(
          and(
            eq(txns.userId, ctx.userId),
            gte(txns.date, startOfMonth(new Date())),
            lt(txns.date, endOfMonth(new Date()))
          )
        )
        .groupBy(txns.fundId)
        .orderBy(desc(sum(txns.amount)))
        .limit(input || 100);

      return txnsResult.map((t) => ({
        ...t,
        _sum: { amount: t.amount },
      }));
    }),

  countByFund: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const counts = await ctx.db
      .select({
        fundId: txns.fundId,
        count: count(txns.id),
      })
      .from(txns)
      .where(
        and(
          eq(txns.userId, ctx.userId),
          gte(txns.date, startOfMonth(now)),
          lt(txns.date, endOfMonth(now))
        )
      )
      .groupBy(txns.fundId);

    return counts.map((c) => ({
      ...c,
      _count: c.count,
    }));
  }),

  stats: protectedProcedure
    .input(z.object({ period: periodSchema }))
    .query(async ({ ctx, input }) => {
      const { start, end } = getDateRangeForPeriod(input.period);
      const previousRange = getPreviousPeriodDateRange(input.period);

      const dateConditions = [eq(txns.userId, ctx.userId)];
      if (start) {
        dateConditions.push(gte(txns.date, start));
      }
      if (end) {
        dateConditions.push(lt(txns.date, end));
      }

      const [totalResult] = await ctx.db
        .select({ amount: sum(txns.amount).mapWith(Number) })
        .from(txns)
        .where(and(...dateConditions));
      const totalSpent = totalResult?.amount ?? 0;

      let comparison:
        | {
            previousTotal: number;
            difference: number;
            percentageChange: number;
          }
        | undefined;

      if (previousRange) {
        const prevConditions = [eq(txns.userId, ctx.userId)];
        if (previousRange.start) {
          prevConditions.push(gte(txns.date, previousRange.start));
        }
        if (previousRange.end) {
          prevConditions.push(lt(txns.date, previousRange.end));
        }

        const [prevResult] = await ctx.db
          .select({ amount: sum(txns.amount).mapWith(Number) })
          .from(txns)
          .where(and(...prevConditions));
        const previousTotal = prevResult?.amount ?? 0;

        if (previousTotal > 0) {
          const difference = totalSpent - previousTotal;
          const percentageChange = (difference / previousTotal) * 100;
          comparison = { previousTotal, difference, percentageChange };
        }
      }

      const byFundResult = await ctx.db
        .select({
          fundId: txns.fundId,
          fundName: funds.name,
          budgetedAmount: funds.budgetedAmount,
          amount: sum(txns.amount).mapWith(Number),
        })
        .from(txns)
        .innerJoin(funds, eq(txns.fundId, funds.id))
        .where(and(...dateConditions))
        .groupBy(txns.fundId, funds.name, funds.budgetedAmount)
        .orderBy(desc(sum(txns.amount)));

      const byFund = byFundResult.map((row) => {
        const amount = row.amount ?? 0;
        const budgetedAmount = row.budgetedAmount
          ? Number(row.budgetedAmount)
          : undefined;
        const budgetUtilization =
          budgetedAmount && budgetedAmount > 0
            ? (amount / budgetedAmount) * 100
            : undefined;

        return {
          fundId: row.fundId ?? 0,
          fundName: row.fundName,
          amount,
          percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
          budgetedAmount,
          budgetUtilization,
        };
      });

      return { totalSpent, byFund, comparison };
    }),

  list: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const start = new Date(Date.UTC(input.year, input.month - 1, 1));
      const end = new Date(Date.UTC(input.year, input.month, 1));
      const limit = input.limit;

      const dateConditions = [
        eq(txns.userId, ctx.userId),
        gte(txns.date, start),
        lt(txns.date, end),
      ];

      let cursorCondition: ReturnType<typeof or> | undefined;
      if (input.cursor) {
        const decoded = JSON.parse(
          Buffer.from(input.cursor, "base64").toString()
        );
        const cursorDate = new Date(decoded.date);
        cursorCondition = or(
          lt(txns.date, cursorDate),
          and(eq(txns.date, cursorDate), lt(txns.id, decoded.id))
        );
      }

      const results = await ctx.db.query.transactions.findMany({
        where: and(...dateConditions, cursorCondition),
        orderBy: [desc(txns.date), desc(txns.id)],
        limit: limit + 1,
        with: {
          fund: {
            columns: { name: true },
          },
          store: {
            columns: { name: true },
          },
        },
      });

      const hasMore = results.length > limit;
      const items = hasMore ? results.slice(0, limit) : results;

      let nextCursor: string | undefined;
      const lastItem = items.at(-1);
      if (hasMore && lastItem) {
        nextCursor = Buffer.from(
          JSON.stringify({ date: lastItem.date, id: lastItem.id })
        ).toString("base64");
      }

      return {
        transactions: items.map((t) => ({
          id: t.id,
          amount: Number(t.amount),
          date: t.date,
          note: t.note,
          fund: { name: t.fund?.name ?? "Unknown" },
          store: t.store ? { name: t.store.name } : undefined,
        })),
        nextCursor,
      };
    }),

  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    // Order matters: foreign key constraints; funds cascade-delete with folders
    await ctx.db.delete(txns).where(eq(txns.userId, ctx.userId));
    await ctx.db.delete(stores).where(eq(stores.userId, ctx.userId));
    await ctx.db.delete(folders).where(eq(folders.userId, ctx.userId));
  }),
});
