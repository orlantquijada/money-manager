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
  listWithFunds: publicProcedure.query(({ ctx }) =>
    ctx.prisma.folder.findMany({
      include: {
        funds: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ),
  list: publicProcedure.query(({ ctx }) => ctx.prisma.folder.findMany()),
})
