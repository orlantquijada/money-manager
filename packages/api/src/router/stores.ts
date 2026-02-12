import { stores } from "db/schema";
import { asc, eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";
import type { StorePick } from "../utils/types";

export const storesRouter = router({
  list: protectedProcedure.query(async ({ ctx }): Promise<StorePick[]> => {
    const result = await ctx.db.query.stores.findMany({
      where: eq(stores.userId, ctx.userId),
      orderBy: asc(stores.name),
      columns: {
        name: true,
        id: true,
        lastSelectedFundId: true,
      },
      with: {
        lastSelectedFund: {
          columns: { name: true },
        },
      },
    });

    return result.map((store) => ({
      id: store.id,
      name: store.name,
      lastSelectedFundId: store.lastSelectedFundId,
      lastSelectedFundName: store.lastSelectedFund?.name ?? null,
    }));
  }),
});
