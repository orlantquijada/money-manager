import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { funds, transactions } from "db/schema";
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
  }
}

export const transactionsRouter = router({
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.transactions.findMany({
      // TODO: implement auth
      // where: eq(Transaction.userId, ctx.auth.userId || ""),
    })
  ),

  recentByFund: protectedProcedure.input(z.number()).query(({ ctx, input }) =>
    ctx.db.query.transactions.findMany({
      where: and(
        // TODO: implement auth
        // eq(Transaction.userId, ctx.auth.userId || ""),
        eq(transactions.fundId, input)
      ),
      orderBy: desc(transactions.date),
      limit: 10,
      with: {
        store: {
          columns: {
            name: true,
          },
        },
      },
    })
  ),

  allThisMonth: protectedProcedure
    .input(
      z
        .object({
          fundId: z.number().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      const now = new Date();
      return ctx.db.query.transactions.findMany({
        where: and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(transactions.date, startOfMonth(now)),
          lt(transactions.date, endOfMonth(now)),
          input?.fundId ? eq(transactions.fundId, input.fundId) : undefined
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
        orderBy: desc(transactions.date),
      });
    }),

  retrieve: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db.query.transactions.findFirst({
      where: and(
        eq(transactions.id, input)
        // TODO: implement auth
        // eq(Transaction.userId, ctx.auth.userId || "")
      ),
      with: {
        fund: {
          columns: { name: true },
        },
        store: {
          columns: { name: true },
        },
      },
    })
  ),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) =>
      ctx.db.delete(transactions).where(eq(transactions.id, input))
    ),

  // Mark a non-negotiable fund as paid by deleting all its transactions for the current month
  // This resets the fund's savings progress for the next billing cycle
  markAsPaid: protectedProcedure
    .input(z.object({ fundId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      await ctx.db
        .delete(transactions)
        .where(
          and(
            eq(transactions.fundId, input.fundId),
            gte(transactions.date, startOfMonth(now)),
            lt(transactions.date, endOfMonth(now))
          )
        );
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
    .mutation(({ ctx, input: { store, ...input } }) => {
      const _input = {
        ...input,
        amount: input.amount.toString(),
        date: new Date(input.date),
        // TODO: implement auth
        // userId: ctx.auth.userId || "",
      };

      if (store) {
        // TODO: implement auth
        // const [createdStore] = await ctx.db
        //   .insert(Store)
        //   .values(...)
        //   .onConflictDoUpdate(...)
        //   .returning({ id: Store.id });

        return ctx.db.insert(transactions).values({
          ..._input,
          // storeId: createdStore.id,
        });
      }

      return ctx.db.insert(transactions).values(_input);
    }),

  totalThisMonth: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const result = await ctx.db
      .select({ amount: sum(transactions.amount).mapWith(Number) })
      .from(transactions)
      .where(
        and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(transactions.date, startOfMonth(now)),
          lt(transactions.date, endOfMonth(now))
        )
      );

    return result[0]?.amount ?? 0;
  }),

  totalLastMonth: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const result = await ctx.db
      .select({ amount: sum(transactions.amount).mapWith(Number) })
      .from(transactions)
      .where(
        and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(transactions.date, startOfMonth(lastMonth)),
          lt(transactions.date, endOfMonth(lastMonth))
        )
      );

    return result[0]?.amount ?? 0;
  }),

  byFund: protectedProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const txns = await ctx.db
        .select({
          fundId: transactions.fundId,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .where(
          and(
            // TODO: implement auth
            // eq(transactions.userId, ctx.auth.userId || ""),
            gte(transactions.date, startOfMonth(new Date())),
            lt(transactions.date, endOfMonth(new Date()))
          )
        )
        .groupBy(transactions.fundId)
        .orderBy(desc(sum(transactions.amount)))
        .limit(input || 100);

      return txns.map((t) => ({
        ...t,
        _sum: { amount: t.amount },
      }));
    }),

  countByFund: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const counts = await ctx.db
      .select({
        fundId: transactions.fundId,
        count: count(transactions.id),
      })
      .from(transactions)
      .where(
        and(
          // TODO: implement auth
          // eq(transactions.userId, ctx.auth.userId || ""),
          gte(transactions.date, startOfMonth(now)),
          lt(transactions.date, endOfMonth(now))
        )
      )
      .groupBy(transactions.fundId);

    return counts.map((c) => ({
      ...c,
      _count: c.count,
    }));
  }),

  stats: protectedProcedure
    .input(z.object({ period: periodSchema }))
    .query(async ({ ctx, input }) => {
      const { start, end } = getDateRangeForPeriod(input.period);

      const dateConditions = [];
      if (start) dateConditions.push(gte(transactions.date, start));
      if (end) dateConditions.push(lt(transactions.date, end));

      // Get total spent
      const [totalResult] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(and(...dateConditions));
      const totalSpent = totalResult?.amount ?? 0;

      // Get breakdown by fund with fund names
      const byFundResult = await ctx.db
        .select({
          fundId: transactions.fundId,
          fundName: funds.name,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(funds, eq(transactions.fundId, funds.id))
        .where(and(...dateConditions))
        .groupBy(transactions.fundId, funds.name)
        .orderBy(desc(sum(transactions.amount)));

      const byFund = byFundResult.map((row) => ({
        fundId: row.fundId,
        fundName: row.fundName,
        amount: row.amount ?? 0,
        percentage: totalSpent > 0 ? ((row.amount ?? 0) / totalSpent) * 100 : 0,
      }));

      return { totalSpent, byFund };
    }),

  list: protectedProcedure
    .input(
      z.object({
        period: periodSchema,
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { start, end } = getDateRangeForPeriod(input.period);
      const limit = input.limit;

      const dateConditions = [];
      if (start) dateConditions.push(gte(transactions.date, start));
      if (end) dateConditions.push(lt(transactions.date, end));

      // Parse cursor for pagination (cursor encodes date + id for deterministic ordering)
      let cursorCondition;
      if (input.cursor) {
        const decoded = JSON.parse(
          Buffer.from(input.cursor, "base64").toString()
        );
        const cursorDate = new Date(decoded.date);
        // Get records older than cursor date, or same date with id less than cursor id
        cursorCondition = or(
          lt(transactions.date, cursorDate),
          and(
            eq(transactions.date, cursorDate),
            lt(transactions.id, decoded.id)
          )
        );
      }

      const results = await ctx.db.query.transactions.findMany({
        where: and(...dateConditions, cursorCondition),
        orderBy: [desc(transactions.date), desc(transactions.id)],
        limit: limit + 1, // Fetch one extra to determine if more pages exist
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
          fund: { name: t.fund.name },
          store: t.store ? { name: t.store.name } : undefined,
        })),
        nextCursor,
      };
    }),
});
