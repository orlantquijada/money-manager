import os from "os"
import fastify from "fastify"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { clerkPlugin } from "@clerk/fastify"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { createContext, appRouter, authRouter } from "api"

const { app, start } = createServer()

if (process.env.NODE_ENV === "development") {
  start()
}

export default async (req: VercelRequest, res: VercelResponse) => {
  await app.ready()
  app.server.emit("request", req, res)
}

/////////////////// utils ///////////////////

function createServer() {
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

/**
 * Gets the IP address of your host-machine.
 * NOTE: this is only a helper function for development.
 */
export function getHostIP() {
  const interfaces = os.networkInterfaces()
  const ipv4Interface = Object.values(interfaces)
    .flat()
    .find(
      (intf) =>
        intf?.family === "IPv4" &&
        !intf.internal &&
        intf.address.startsWith("192.168"),
    )

  return ipv4Interface?.address ?? ""
}
