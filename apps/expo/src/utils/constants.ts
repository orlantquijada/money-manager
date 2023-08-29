import type { FundType } from ".prisma/client"
import { getDaysInMonth } from "date-fns"

export const screenPadding = 16

export const COMMON_FOLDER_NAMES = [
  "Bills",
  "Wants",
  "Needs",
  "Targets",
  "Spending",
  "Non-negotiable",
  "Entertainment",
  "Subscriptions",
]

export const dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const userId = "cll8yetw20000t78i1hb031tf"

export const daysInCurrentMonth = getDaysInMonth(new Date())

export const fundTypeReadableText: Record<FundType, string> = {
  NON_NEGOTIABLE: "Nonnegotiable",
  TARGET: "Target",
  SPENDING: "Spending",
}
