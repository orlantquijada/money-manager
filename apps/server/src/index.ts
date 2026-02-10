import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { appRouter, createTRPCContext } from "api";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "../env";

const isDev = process.env.NODE_ENV === "development";

const { app, start } = createApp();

start();

export default app;

function createApp() {
  const app = new Hono();

  app.use(logger());
  app.use(
    "*",
    cors({
      origin: env.CORS_ORIGIN,
    })
  );

  app.get("/ping", async (c) => c.text("pong"));
  app.use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
      createContext: (_opts, c) => {
        const authHeader = c.req.header("Authorization");
        const authToken = authHeader?.startsWith("Bearer ")
          ? authHeader.slice(7)
          : null;
        const timezone = c.req.header("x-timezone") || "UTC";
        return createTRPCContext({ authToken, timezone });
      },
    })
  );

  const start = () => {
    if (!isDev) {
      return;
    }

    const port = 3000;
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`listening on :${port}`);
  };

  return { app, start };
}
