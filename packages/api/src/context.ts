import { verifyToken } from "@clerk/backend";
import { db } from "db/client";

type CreateContextOptions = {
  authToken?: string | null;
};

export const createTRPCContext = async (opts: CreateContextOptions = {}) => {
  let userId: string | null = null;

  if (opts.authToken) {
    try {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (secretKey) {
        const verified = await verifyToken(opts.authToken, {
          secretKey,
        });
        userId = verified.sub;
      } else {
        console.warn("CLERK_SECRET_KEY not set");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  return {
    db,
    userId,
  };
};
