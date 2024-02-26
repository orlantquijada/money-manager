import type { FastifyReply, FastifyRequest } from "fastify"
import { createServer } from "./server"

const { app, start } = createServer()

if (process.env.NODE_ENV === "development") {
  start()
}

export default async function handler(req: FastifyRequest, res: FastifyReply) {
  await app.ready()
  app.server.emit("request", req, res)
}
