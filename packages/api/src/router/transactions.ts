import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { endOfWeek, startOfWeek } from "date-fns"

export const transactionsRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.transaction.findMany()
  }),
  allThisWeek: publicProcedure.query(({ ctx }) => {
    const now = new Date()
    return ctx.prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfWeek(now),
          lt: endOfWeek(now),
        },
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
  create: publicProcedure
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
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { store, userId, ...input } }) => {
      if (store) {
        const createdStore = await ctx.prisma.store.upsert({
          where: {
            userId_name: {
              name: store,
              userId,
            },
          },
          update: {},
          create: {
            name: store,
            userId,
          },
        })

        return ctx.prisma.transaction.create({
          data: { ...input, storeId: createdStore.id },
        })
      }

      return ctx.prisma.transaction.create({
        data: input,
      })
    }),
})
