import { z } from "zod"
import { publicProcedure, router } from "../trpc"

export const storesRouter = router({
  listFromUserId: publicProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.prisma.store.findMany({
      where: {
        userId: input,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        id: true,
        lastSelectedFundId: true,
      },
    })
  }),
})
