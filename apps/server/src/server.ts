import fastify from "fastify"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { clerkPlugin } from "@clerk/fastify"
import { createContext, appRouter, authRouter } from "api"
import { getHostIP } from "./utils"

export function createServer() {
  const port = Number(process.env.PORT) || 3000
  const server = fastify({
    maxParamLength: 5000,
    logger: true,
  })

  server.register(clerkPlugin)

  server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext },
  })

  server.register(fastifyTRPCPlugin, {
    prefix: "/auth",
    trpcOptions: { router: authRouter },
  })

  server.get("/ping", async () => {
    return "pong"
  })

  const stop = () => server.close()
  const start = async () => {
    const host =
      process.env.NODE_ENV === "development" ? getHostIP() : "0.0.0.0"

    try {
      await server.listen({ port, host })
      if (process.env.NODE_ENV === "development")
        console.log(`listening on ${host}:${port}`)
    } catch (err) {
      server.log.error("err", err)
      process.exit(1)
    }
  }

  return { server, start, stop }
}
