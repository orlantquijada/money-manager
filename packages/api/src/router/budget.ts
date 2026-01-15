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

type ScoreStatus = "on_track" | "needs_attention" | "over_budget";

interface ScoreFactor {
  description: string;
  points: number;
}

export interface BudgetScore {
  score: number;
  status: ScoreStatus;
  factors: ScoreFactor[];
}

type FundStatus = "over_budget" | "at_risk" | "on_track";

interface FundDetail {
  id: number;
  name: string;
  status: FundStatus;
  utilization: number;
  spent: number;
  budget: number;
  pointImpact: number;
}

interface Insight {
  message: string;
  fundId: number;
}

export interface BudgetScoreDetails {
  score: number;
  status: ScoreStatus;
  factors: ScoreFactor[];
  funds: FundDetail[];
  insight: Insight | null;
}

export const budgetRouter = router({
  /**
   * Returns prioritized budget alerts for the current month.
   * Over-budget (>100%) alerts come first, then almost-over (>90%).
   */
  alerts: protectedProcedure.query(async ({ ctx }): Promise<BudgetAlert[]> => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get all funds with budgets (budgetedAmount > 0), excluding EVENTUALLY
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

    // Filter out EVENTUALLY funds (no recurring budget)
    const recurringFunds = budgetedFunds.filter(
      (f) => f.timeMode !== "EVENTUALLY"
    );

    if (recurringFunds.length === 0) {
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
            recurringFunds.map((f) => f.id)
          ),
          gte(transactions.date, monthStart),
          lt(transactions.date, monthEnd)
        )
      )
      .groupBy(transactions.fundId);

    const spendingMap = new Map(spending.map((s) => [s.fundId, s.amount ?? 0]));

    // Generate alerts
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

    // Sort: warnings first, then info
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
        timeMode: funds.timeMode,
      })
      .from(funds)
      .innerJoin(folders, eq(funds.folderId, folders.id))
      .where(and(eq(folders.userId, ctx.userId), gt(funds.budgetedAmount, "0")))
      .orderBy(asc(funds.name));

    // Filter out EVENTUALLY funds (no recurring budget)
    const recurringFunds = budgetedFunds.filter(
      (f) => f.timeMode !== "EVENTUALLY"
    );

    // No recurring budgeted funds = perfect score
    if (recurringFunds.length === 0) {
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
            recurringFunds.map((f) => f.id)
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
    const underBudgetRatio = fundsUnderBudget / recurringFunds.length;
    if (underBudgetRatio > 0.8) {
      score += 10;
      factors.push({
        description: `${fundsUnderBudget}/${recurringFunds.length} funds under budget`,
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

  /**
   * Returns comprehensive score data for the Budget Score Modal.
   * Includes score, status, all funds with utilization details, and actionable insight.
   */
  scoreDetails: protectedProcedure.query(
    async ({ ctx }): Promise<BudgetScoreDetails> => {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      // Get all funds with budgets
      const budgetedFunds = await ctx.db
        .select({
          id: funds.id,
          name: funds.name,
          budgetedAmount: funds.budgetedAmount,
          timeMode: funds.timeMode,
        })
        .from(funds)
        .innerJoin(folders, eq(funds.folderId, folders.id))
        .where(
          and(eq(folders.userId, ctx.userId), gt(funds.budgetedAmount, "0"))
        )
        .orderBy(asc(funds.name));

      // Filter out EVENTUALLY funds (no recurring budget)
      const recurringFunds = budgetedFunds.filter(
        (f) => f.timeMode !== "EVENTUALLY"
      );

      // No recurring budgeted funds = perfect score
      if (recurringFunds.length === 0) {
        return {
          score: 100,
          status: "on_track",
          factors: [],
          funds: [],
          insight: null,
        };
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
              recurringFunds.map((f) => f.id)
            ),
            gte(transactions.date, monthStart),
            lt(transactions.date, monthEnd)
          )
        )
        .groupBy(transactions.fundId);

      const spendingMap = new Map(
        spending.map((s) => [s.fundId, s.amount ?? 0])
      );

      // Calculate per-fund data and score
      let score = 100;
      const factors: ScoreFactor[] = [];
      const fundDetails: FundDetail[] = [];
      let fundsUnderBudget = 0;

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

        let fundStatus: FundStatus;
        let pointImpact: number;

        if (utilization > 100) {
          fundStatus = "over_budget";
          pointImpact = -20;
          score -= 20;
          factors.push({
            description: `${fund.name} is over budget`,
            points: -20,
          });
        } else if (utilization > 90) {
          fundStatus = "at_risk";
          pointImpact = -5;
          score -= 5;
          factors.push({
            description: `${fund.name} at ${Math.round(utilization)}%`,
            points: -5,
          });
        } else {
          fundStatus = "on_track";
          pointImpact = 0;
          fundsUnderBudget++;
        }

        fundDetails.push({
          id: fund.id,
          name: fund.name,
          status: fundStatus,
          utilization: Math.round(utilization * 10) / 10,
          spent,
          budget: monthlyBudget,
          pointImpact,
        });
      }

      // Bonus: >80% of funds under budget
      const underBudgetRatio = fundsUnderBudget / recurringFunds.length;
      if (underBudgetRatio > 0.8) {
        score += 10;
        factors.push({
          description: `${fundsUnderBudget}/${recurringFunds.length} funds under budget`,
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

      // Sort funds by status: over_budget → at_risk → on_track
      const statusOrder: Record<FundStatus, number> = {
        over_budget: 0,
        at_risk: 1,
        on_track: 2,
      };
      fundDetails.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

      // Generate insight: find fund with largest point recovery opportunity
      let insight: Insight | null = null;
      const overBudgetFund = fundDetails.find(
        (f) => f.status === "over_budget"
      );
      const atRiskFund = fundDetails.find((f) => f.status === "at_risk");

      if (overBudgetFund) {
        insight = {
          message: `Bring ${overBudgetFund.name} back on track to gain +20 points`,
          fundId: overBudgetFund.id,
        };
      } else if (atRiskFund) {
        insight = {
          message: `Keep ${atRiskFund.name} under 90% to gain +5 points`,
          fundId: atRiskFund.id,
        };
      }

      return { score, status, factors, funds: fundDetails, insight };
    }
  ),
});
