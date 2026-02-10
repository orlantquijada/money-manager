import { TZDate } from "@date-fns/tz";
import { endOfMonth, getDaysInMonth, startOfMonth } from "date-fns";
import { folders, funds, transactions } from "db/schema";
import { and, asc, eq, gt, gte, inArray, lt, sum } from "drizzle-orm";

import { protectedProcedure, router } from "../trpc";

type TimeMode = "WEEKLY" | "MONTHLY" | "BIMONTHLY" | "EVENTUALLY";
type AlertType = "over_budget" | "almost_over";
type AlertSeverity = "warning" | "info";

/**
 * Converts a fund's budgeted amount to its monthly equivalent based on timeMode.
 * Returns null for EVENTUALLY funds (no recurring budget).
 */
function getMonthlyBudget(
  amount: number,
  timeMode: TimeMode,
  referenceDate: Date
): number | null {
  switch (timeMode) {
    case "WEEKLY":
      return amount * (getDaysInMonth(referenceDate) / 7);
    case "MONTHLY":
      return amount;
    case "BIMONTHLY":
      return amount * 2;
    case "EVENTUALLY":
      return null;
    default:
      return null;
  }
}

export interface BudgetAlert {
  type: AlertType;
  fundId: number;
  fundName: string;
  message: string;
  severity: AlertSeverity;
}

export const budgetRouter = router({
  /**
   * Returns prioritized budget alerts for the current month.
   * Over-budget (>100%) alerts come first, then almost-over (>90%).
   */
  alerts: protectedProcedure.query(async ({ ctx }): Promise<BudgetAlert[]> => {
    const now = TZDate.tz(ctx.timezone);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const budgetedFunds = await ctx.db
      .select({
        id: funds.id,
        name: funds.name,
        budgetedAmount: funds.budgetedAmount,
        timeMode: funds.timeMode,
      })
      .from(funds)
      .innerJoin(folders, eq(funds.folderId, folders.id))
      .where(and(eq(folders.userId, ctx.userId), gt(funds.budgetedAmount, "0")))
      .orderBy(asc(funds.name));

    const recurringFunds = budgetedFunds.filter(
      (f) => f.timeMode !== "EVENTUALLY"
    );

    if (recurringFunds.length === 0) {
      return [];
    }

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
            recurringFunds.map((f) => f.id)
          ),
          gte(transactions.date, monthStart),
          lt(transactions.date, monthEnd)
        )
      )
      .groupBy(transactions.fundId);

    const spendingMap = new Map(spending.map((s) => [s.fundId, s.amount ?? 0]));

    const alerts: BudgetAlert[] = [];

    for (const fund of recurringFunds) {
      const monthlyBudget = getMonthlyBudget(
        Number(fund.budgetedAmount),
        fund.timeMode as TimeMode,
        now
      );
      if (monthlyBudget === null) {
        continue;
      }
      const spent = spendingMap.get(fund.id) ?? 0;
      const utilization = (spent / monthlyBudget) * 100;

      if (utilization > 100) {
        const overAmount = spent - monthlyBudget;
        alerts.push({
          type: "over_budget",
          fundId: fund.id,
          fundName: fund.name,
          message: `${fund.name} is ₱${Math.round(overAmount).toLocaleString()} over budget`,
          severity: "warning",
        });
      } else if (utilization > 90) {
        const remaining = monthlyBudget - spent;
        alerts.push({
          type: "almost_over",
          fundId: fund.id,
          fundName: fund.name,
          message: `${fund.name} has ₱${Math.round(remaining).toLocaleString()} left`,
          severity: "info",
        });
      }
    }

    alerts.sort((a, b) => {
      if (a.severity === "warning" && b.severity === "info") {
        return -1;
      }
      if (a.severity === "info" && b.severity === "warning") {
        return 1;
      }
      return 0;
    });

    return alerts;
  }),
});
