import { z } from "zod"
import { endOfMonth, startOfMonth } from "date-fns"

import { router, publicProcedure, protectedProcedure } from "../trpc"

export const transactionsRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany()
  }),
  recentByFund: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.transaction.findMany({
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
  }),
  allThisMonth: protectedProcedure
    .input(
      z
        .object({
          fundId: z.number().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      const now = new Date()
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
      })
    }),
  retrieve: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.transaction.findFirst({ where: { id: input } })
  }),
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
      }),
    )
    .mutation(async ({ ctx, input: { store, ...input } }) => {
      const _input = {
        ...input,
        userId: ctx.auth.userId,
      }

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
        })

        return ctx.prisma.transaction.create({
          data: { ..._input, storeId: createdStore.id },
        })
      }

      return ctx.prisma.transaction.create({
        data: _input,
      })
    }),
})
