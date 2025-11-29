import type { Prisma } from "db";
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
      ctx.prisma.folder.create({
        data: { ...input, userId: ctx.auth.userId || "" },
      })
    ),
  remove: protectedProcedure
    .input(z.number())
    .mutation(({ input, ctx }) =>
      ctx.prisma.folder.delete({ where: { id: input } })
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
      // TODO: filter by date

      const foldersWithFunds = await ctx.prisma.folder.findMany({
        where: {
          userId: ctx.auth.userId || "",
        },
        include: {
          // TODO: order by new field: `order` when funds can now be reordered
          funds: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const fundIds = foldersWithFunds.flatMap((folder) =>
        folder.funds.map((fund) => fund.id)
      );
      const totalSpentByFund = await ctx.prisma.transaction.groupBy({
        by: ["fundId"],
        where: {
          fundId: { in: fundIds },
          date:
            input?.startDate || input?.endDate
              ? ({
                  gte: input.startDate,
                  lte: input.endDate,
                } as Prisma.DateTimeNullableFilter<"Transaction">)
              : null,
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          fundId: "desc",
        },
      });

      return foldersWithFunds.map((folder) => ({
        ...folder,
        funds: folder.funds.map((fund) => {
          const totalSpent =
            totalSpentByFund
              .find(({ fundId }) => fundId === fund.id)
              ?._sum.amount?.toNumber() || 0;

          return {
            ...fund,
            totalSpent,
          };
        }),
      }));
    }),
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.folder.findMany({
      where: {
        userId: ctx.auth.userId || "",
      },
    })
  ),
});
