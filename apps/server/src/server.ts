import fastify from "fastify"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { clerkPlugin } from "@clerk/fastify"
import { createContext, appRouter, authRouter } from "api"
import { getHostIP } from "./utils"

export function createServer() {
  const app = fastify({
    maxParamLength: 5000,
    logger: true,
  })

  app.register(clerkPlugin)

  app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext },
  })

  app.register(fastifyTRPCPlugin, {
    prefix: "/auth",
    trpcOptions: { router: authRouter },
  })

  app.get("/ping", async () => {
    return "pong"
  })

  const stop = () => app.close()
  const start = async () => {
    const host =
      process.env.NODE_ENV === "development" ? getHostIP() : "0.0.0.0"
    const port =
      process.env.NODE_ENV === "development" ? 3000 : Number(process.env.PORT)

    try {
      await app.listen({ port, host })
      if (process.env.NODE_ENV === "development")
        console.log(`listening on ${host}:${port}`)
    } catch (err) {
      app.log.error("err", err)
      process.exit(1)
    }
  }

  return { app, start, stop }
}
