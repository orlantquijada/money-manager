import { db } from "db/client";

export const createTRPCContext = () => ({
  db,
});
