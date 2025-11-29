import { endOfMonth, startOfMonth } from "date-fns";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const transactionsRouter = router({
  all: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.auth.userId || "",
      },
    })
  ),
  recentByFund: protectedProcedure.input(z.number()).query(({ ctx, input }) =>
    ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.auth.userId,
        fundId: input,
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
      include: {
        store: {
          select: {
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
      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.auth.userId,
          date: {
            gte: startOfMonth(now),
            lt: endOfMonth(now),
          },
          fundId: input?.fundId ? input.fundId : {},
        },
        include: {
          fund: {
            select: {
              name: true,
            },
          },
          store: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  retrieve: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
    ctx.prisma.transaction.findFirst({
      where: { id: input, userId: ctx.auth.userId },
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
    .mutation(async ({ ctx, input: { store, ...input } }) => {
      const _input = {
        ...input,
        userId: ctx.auth.userId,
      };

      if (store) {
        const createdStore = await ctx.prisma.store.upsert({
          where: {
            userId_name: {
              name: store,
              userId: ctx.auth?.userId || "",
            },
          },
          update: {
            lastSelectedFundId: input.fundId,
          },
          create: {
            name: store,
            userId: ctx.auth?.userId || "",
            lastSelectedFundId: input.fundId,
          },
        });

        return ctx.prisma.transaction.create({
          data: { ..._input, storeId: createdStore.id },
        });
      }

      return ctx.prisma.transaction.create({
        data: _input,
      });
    }),

  totalThisMonth: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.transaction
      .aggregate({
        where: {
          userId: ctx.auth.userId,
          date: {
            gte: startOfMonth(new Date()),
            lt: endOfMonth(new Date()),
          },
        },
        _sum: { amount: true },
      })
      .then((data) => data._sum.amount?.toNumber() || 0)
  ),

  byFund: protectedProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      const txns = await ctx.prisma.transaction.groupBy({
        by: "fundId",
        where: {
          userId: ctx.auth.userId || "",
          date: {
            gte: startOfMonth(new Date()),
            lt: endOfMonth(new Date()),
          },
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
        ...(input ? { take: input } : {}),
      });

      return txns;
    }),

  countByFund: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.transaction.groupBy({
      by: "fundId",
      _count: true,
      where: {
        userId: ctx.auth.userId,
        date: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date()),
        },
      },
    })
  ),
});
