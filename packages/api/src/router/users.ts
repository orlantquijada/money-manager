import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const usersRouter = router({
  // Ensure user exists in database (called on sign-in)
  ensureUser: protectedProcedure
    .input(
      z
        .object({
          name: z.string().nullable().optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.userId),
      });

      if (existingUser) {
        return existingUser;
      }

      // Create new user with Clerk ID
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
});
