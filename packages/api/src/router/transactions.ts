import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { transactions } from "db/schema";
import { and, count, desc, eq, gte, lt, sum } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

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
    })
  ),

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
});
