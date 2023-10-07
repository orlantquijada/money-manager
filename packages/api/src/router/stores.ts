import { protectedProcedure, router } from "../trpc"

export const storesRouter = router({
  listFromUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.store.findMany({
      where: {
        userId: ctx.auth?.userId || "",
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
