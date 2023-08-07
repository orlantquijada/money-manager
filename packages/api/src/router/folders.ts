import { z } from "zod"
import { publicProcedure, router } from "../trpc"

export const foldersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => ctx.prisma.folder.create({ data: input })),
  remove: publicProcedure
    .input(z.number())
    .mutation(({ input, ctx }) =>
      ctx.prisma.folder.delete({ where: { id: input } }),
    ),
  listWithFunds: publicProcedure.query(async ({ ctx }) => {
    // TODO: filter by date

    const foldersWithFunds = await ctx.prisma.folder.findMany({
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
    })

    const fundIds = foldersWithFunds.flatMap((folder) =>
      folder.funds.map((fund) => fund.id),
    )
    const totalSpentByFund = await ctx.prisma.transaction.groupBy({
      by: ["fundId"],
      where: {
        fundId: { in: fundIds },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        fundId: "desc",
      },
    })

    return foldersWithFunds.map((folder) => ({
      ...folder,
      funds: folder.funds.map((fund) => ({
        ...fund,
        totalSpent:
          totalSpentByFund
            .find(({ fundId }) => fundId === fund.id)
            ?._sum.amount?.toNumber() || 0,
      })),
    }))
  }),
  list: publicProcedure.query(({ ctx }) => ctx.prisma.folder.findMany()),
})
