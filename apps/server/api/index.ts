import os from "node:os";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "api";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "../env.js";

const isDev = process.env.NODE_ENV === "development";

const { start, app } = createServer();

if (isDev) {
  start();
}

export default app;

function createServer() {
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
    })
  );

  const start = () => {
    const host = isDev ? getHostIP() : "0.0.0.0";
    const port = isDev ? 3000 : Number(process.env.PORT);

    serve({
      fetch: app.fetch,
      port,
      hostname: host,
    });

    if (isDev) {
      console.log(`listening on ${host}:${port}`);
    }
  };

  return { start, app };
}

function getHostIP() {
  const interfaces = os.networkInterfaces();
  const ipv4Interface = Object.values(interfaces)
    .flat()
    .find(
      (intf) =>
        intf?.family === "IPv4" &&
        !intf.internal &&
        intf.address.startsWith("192.168")
    );

  return ipv4Interface?.address ?? "";
}
