import { Fund } from ".prisma/client"

export * from "./routes"

export type FundWithMeta = Fund & {
  totalSpent: number
  totalBudgetedAmount: number
}
