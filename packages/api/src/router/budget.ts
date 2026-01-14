import { endOfMonth, startOfMonth } from "date-fns";
import { folders, funds, transactions } from "db/schema";
import { and, asc, eq, gt, gte, inArray, lt, sum } from "drizzle-orm";

import { protectedProcedure, router } from "../trpc";

type AlertType = "over_budget" | "almost_over";
type AlertSeverity = "warning" | "info";

type BudgetAlert = {
  type: AlertType;
  fundId: number;
  fundName: string;
  message: string;
  severity: AlertSeverity;
};

export const budgetRouter = router({
  /**
   * Returns prioritized budget alerts for the current month.
   * Over-budget (>100%) alerts come first, then almost-over (>90%).
   */
  alerts: protectedProcedure.query(async ({ ctx }): Promise<BudgetAlert[]> => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get all funds with budgets (budgetedAmount > 0)
    const budgetedFunds = await ctx.db
      .select({
        id: funds.id,
        name: funds.name,
        budgetedAmount: funds.budgetedAmount,
      })
      .from(funds)
      .innerJoin(folders, eq(funds.folderId, folders.id))
      .where(and(eq(folders.userId, ctx.userId), gt(funds.budgetedAmount, "0")))
      .orderBy(asc(funds.name));

    if (budgetedFunds.length === 0) {
      return [];
    }

    // Get current month spending for these funds
    const spending = await ctx.db
      .select({
        fundId: transactions.fundId,
        amount: sum(transactions.amount).mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          inArray(
            transactions.fundId,
            budgetedFunds.map((f) => f.id)
          ),
          gte(transactions.date, monthStart),
          lt(transactions.date, monthEnd)
        )
      )
      .groupBy(transactions.fundId);

    const spendingMap = new Map(spending.map((s) => [s.fundId, s.amount ?? 0]));

    // Generate alerts
    const alerts: BudgetAlert[] = [];

    for (const fund of budgetedFunds) {
      const budget = Number(fund.budgetedAmount);
      const spent = spendingMap.get(fund.id) ?? 0;
      const utilization = (spent / budget) * 100;

      if (utilization > 100) {
        const overAmount = spent - budget;
        alerts.push({
          type: "over_budget",
          fundId: fund.id,
          fundName: fund.name,
          message: `${fund.name} is ₱${Math.round(overAmount).toLocaleString()} over budget`,
          severity: "warning",
        });
      } else if (utilization > 90) {
        const remaining = budget - spent;
        alerts.push({
          type: "almost_over",
          fundId: fund.id,
          fundName: fund.name,
          message: `${fund.name} has ₱${Math.round(remaining).toLocaleString()} left`,
          severity: "info",
        });
      }
    }

    // Sort: warnings first, then info
    alerts.sort((a, b) => {
      if (a.severity === "warning" && b.severity === "info") return -1;
      if (a.severity === "info" && b.severity === "warning") return 1;
      return 0;
    });

    return alerts;
  }),
});
