import { stores } from "db/schema";
import { asc } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";

export const storesRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.stores.findMany({
      // TODO: implement auth
      // where: eq(Store.userId, ctx.auth.userId || ""),
      orderBy: asc(stores.name),
      columns: {
        name: true,
        id: true,
        lastSelectedFundId: true,
      },
    })
  ),
});
