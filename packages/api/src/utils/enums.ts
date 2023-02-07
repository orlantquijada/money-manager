import { z } from "zod"

export const fundTypeSchema = z.union([
  z.literal("SPENDING"),
  z.literal("NON_NEGOTIABLE"),
  z.literal("TARGET"),
])
