import { folders, stores, transactions, users } from "db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const usersRouter = router({
  ensureUser: protectedProcedure
    .input(
      z
        .object({
          name: z.string().nullable().optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.userId),
      });

      if (existingUser) {
        return existingUser;
      }

      const [newUser] = await ctx.db
        .insert(users)
        .values({
          id: ctx.userId,
          name: input?.name ?? null,
        })
        .returning();

      return newUser;
    }),

  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(12),
        name: z.string().nullable().default(null),
      })
    )
    .mutation(({ ctx, input }) => ctx.db.insert(users).values(input)),

  remove: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(users).where(eq(users.id, ctx.userId));
  }),

  exportData: protectedProcedure.query(async ({ ctx }) => {
    const userFolders = await ctx.db.query.folders.findMany({
      where: eq(folders.userId, ctx.userId),
      with: {
        funds: {
          with: {
            transactions: true,
          },
        },
      },
    });

    const userStores = await ctx.db.query.stores.findMany({
      where: eq(stores.userId, ctx.userId),
    });

    const userTransactions = await ctx.db.query.transactions.findMany({
      where: eq(transactions.userId, ctx.userId),
    });

    return {
      exportedAt: new Date().toISOString(),
      folders: userFolders,
      stores: userStores,
      transactions: userTransactions,
    };
  }),
});
