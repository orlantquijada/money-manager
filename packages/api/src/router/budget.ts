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

type ScoreStatus = "on_track" | "needs_attention" | "over_budget";

type ScoreFactor = {
  description: string;
  points: number;
};

type BudgetScore = {
  score: number;
  status: ScoreStatus;
  factors: ScoreFactor[];
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

  /**
   * Returns budget score (0-100) with breakdown factors.
   * Score calculation:
   * - Base: 100
   * - -20 for each fund >100% budget
   * - -5 for each fund >90% budget (but ≤100%)
   * - +10 if >80% of funds are under budget
   */
  score: protectedProcedure.query(async ({ ctx }): Promise<BudgetScore> => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get all funds with budgets
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

    // No budgeted funds = perfect score
    if (budgetedFunds.length === 0) {
      return { score: 100, status: "on_track", factors: [] };
    }

    // Get current month spending
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

    // Calculate score
    let score = 100;
    const factors: ScoreFactor[] = [];
    let fundsUnderBudget = 0;

    for (const fund of budgetedFunds) {
      const budget = Number(fund.budgetedAmount);
      const spent = spendingMap.get(fund.id) ?? 0;
      const utilization = (spent / budget) * 100;

      if (utilization > 100) {
        score -= 20;
        factors.push({
          description: `${fund.name} is over budget`,
          points: -20,
        });
      } else if (utilization > 90) {
        score -= 5;
        factors.push({
          description: `${fund.name} at ${Math.round(utilization)}%`,
          points: -5,
        });
      } else {
        fundsUnderBudget++;
      }
    }

    // Bonus: >80% of funds under budget
    const underBudgetRatio = fundsUnderBudget / budgetedFunds.length;
    if (underBudgetRatio > 0.8) {
      score += 10;
      factors.push({
        description: `${fundsUnderBudget}/${budgetedFunds.length} funds under budget`,
        points: 10,
      });
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine status
    let status: ScoreStatus;
    if (score >= 70) {
      status = "on_track";
    } else if (score >= 40) {
      status = "needs_attention";
    } else {
      status = "over_budget";
    }

    return { score, status, factors };
  }),
});
