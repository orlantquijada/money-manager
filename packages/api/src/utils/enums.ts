import { z } from "zod";

export const fundTypeSchema = z.union([
  z.literal("SPENDING"),
  z.literal("NON_NEGOTIABLE"),
  // TODO: re-enable when TARGET fundtype is restored
  // z.literal("TARGET"),
]);

export const timeModeSchema = z.union([
  z.literal("WEEKLY"),
  z.literal("MONTHLY"),
  z.literal("BIMONTHLY"),
  z.literal("EVENTUALLY"),
]);
