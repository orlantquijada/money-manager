import { endOfMonth, startOfMonth } from "date-fns";
import { Transaction } from "db/schema";
import { and, count, desc, eq, gte, lt, sum } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const transactionsRouter = router({
  all: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Transaction.findMany({
      // TODO: implement auth
      // where: eq(Transaction.userId, ctx.auth.userId || ""),
    })
  ),
  recentByFund: protectedProcedure.input(z.number()).query(({ ctx, input }) =>
    ctx.db.query.Transaction.findMany({
      where: and(
        // TODO: implement auth
        // eq(Transaction.userId, ctx.auth.userId || ""),
        eq(Transaction.fundId, input)
      ),
      orderBy: desc(Transaction.date),
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
      return ctx.db.query.Transaction.findMany({
        where: and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(Transaction.date, startOfMonth(now)),
          lt(Transaction.date, endOfMonth(now)),
          input?.fundId ? eq(Transaction.fundId, input.fundId) : undefined
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
        orderBy: desc(Transaction.date),
      });
    }),
  retrieve: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.db.query.Transaction.findFirst({
      where: and(
        eq(Transaction.id, input)
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
        date: z
          .string()
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
        //   .values({
        //     name: store,
        //     userId: ctx.auth.userId || "",
        //     lastSelectedFundId: input.fundId,
        //   })
        //   .onConflictDoUpdate({
        //     target: [Store.userId, Store.name],
        //     set: {
        //       lastSelectedFundId: input.fundId,
        //     },
        //   })
        //   .returning({ id: Store.id });

        // if (!createdStore) {
        //   throw new Error("Failed to create or update store");
        // }

        return ctx.db.insert(Transaction).values({
          ..._input,
          // storeId: createdStore.id,
        });
      }

      return ctx.db.insert(Transaction).values(_input);
    }),

  totalThisMonth: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select({ amount: sum(Transaction.amount).mapWith(Number) })
      .from(Transaction)
      .where(
        and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(Transaction.date, startOfMonth(new Date())),
          lt(Transaction.date, endOfMonth(new Date()))
        )
      )
      .then((data) => data[0]?.amount || 0)
  ),

  byFund: protectedProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const txns = await ctx.db
        .select({
          fundId: Transaction.fundId,
          amount: sum(Transaction.amount).mapWith(Number),
        })
        .from(Transaction)
        .where(
          and(
            // TODO: implement auth
            // eq(Transaction.userId, ctx.auth.userId || ""),
            gte(Transaction.date, startOfMonth(new Date())),
            lt(Transaction.date, endOfMonth(new Date()))
          )
        )
        .groupBy(Transaction.fundId)
        .orderBy(desc(sum(Transaction.amount)))
        .limit(input || 100); // Default limit if not provided, though Prisma didn't have default

      return txns.map((t) => ({
        ...t,
        _sum: { amount: t.amount }, // Match Prisma response shape if needed by frontend
      }));
    }),

  countByFund: protectedProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db
      .select({
        fundId: Transaction.fundId,
        count: count(Transaction.id),
      })
      .from(Transaction)
      .where(
        and(
          // TODO: implement auth
          // eq(Transaction.userId, ctx.auth.userId || ""),
          gte(Transaction.date, startOfMonth(new Date())),
          lt(Transaction.date, endOfMonth(new Date()))
        )
      )
      .groupBy(Transaction.fundId);

    return counts.map((c) => ({
      ...c,
      _count: c.count, // Match Prisma response shape
    }));
  }),
});
