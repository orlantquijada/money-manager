import { z } from "zod";

export const fundTypeSchema = z.union([
  z.literal("SPENDING"),
  z.literal("NON_NEGOTIABLE"),
  z.literal("TARGET"),
]);

export const timeModeSchema = z.union([
  z.literal("WEEKLY"),
  z.literal("MONTHLY"),
  z.literal("BIMONTHLY"),
  z.literal("EVENTUALLY"),
]);
