import { z } from "zod"
import { router, publicProcedure } from "../trpc"
import { fundTypeSchema } from "../utils/enums"

export const fundsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        budgetedAmount: z.number().default(0),
        fundType: fundTypeSchema,
        folderId: z.number(),
      }),
    )
    .mutation(({ input, ctx }) => ctx.prisma.fund.create({ data: input })),
})
