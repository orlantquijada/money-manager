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
  listWithFunds: publicProcedure.query(({ ctx }) =>
    ctx.prisma.folder.findMany({
      include: {
        funds: true,
      },
    }),
  ),
  list: publicProcedure.query(({ ctx }) => ctx.prisma.folder.findMany()),
})
