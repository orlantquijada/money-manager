import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { db } from "db/client";

// type Session = Required<ReturnType<typeof getAuth>>;

// type CreateContextOptions = {
//   // auth: Session | null;
//   auth: null;
// };

export function createContext(opts: CreateFastifyContextOptions) {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
