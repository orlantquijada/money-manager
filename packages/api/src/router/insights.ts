import { endOfMonth, getDaysInMonth, startOfMonth, subMonths } from "date-fns";
import { folders, funds, transactions } from "db/schema";
import { and, count, desc, eq, gte, inArray, lt, sum } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

type TimeMode = "WEEKLY" | "MONTHLY" | "BIMONTHLY" | "EVENTUALLY";

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

// Health status thresholds
const HEALTH_ON_TRACK_MAX = 80; // < 80% is on track
const HEALTH_AT_RISK_MAX = 100; // 80-100% is at risk, > 100% is overspent

export interface EnvelopeHealth {
  onTrack: number;
  atRisk: number;
  overspent: number;
}

export interface FundHighlight {
  fundId: number;
  fundName: string;
  amount: number;
  budgeted: number;
  percentage: number;
}

export interface SpendingCategory {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
}

export interface MonthComparison {
  current: number;
  previous: number;
  percentageChange: number;
  isFirstMonth: boolean;
}

type SuggestionType = "overspent_recurring" | "overspent_large" | null;

type Suggestion = {
  type: SuggestionType;
  message: string;
  fundName: string;
} | null;

export const insightsRouter = router({
  /**
   * Returns monthly statistics for the insights screen.
   */
  monthlyStats: protectedProcedure
    .input(
      z
        .object({
          month: z.date().optional(),
        })
        .optional()
    )
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Data aggregation requires multiple conditionals
    .query(async ({ ctx, input }) => {
      const referenceDate = input?.month ?? new Date();
      const monthStart = startOfMonth(referenceDate);
      const monthEnd = endOfMonth(referenceDate);

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
        .where(and(eq(folders.userId, ctx.userId)));

      // Get all recurring funds (non-EVENTUALLY with budget)
      const recurringFunds = budgetedFunds.filter(
        (f) => f.timeMode !== "EVENTUALLY" && Number(f.budgetedAmount) > 0
      );

      const allFundIds = budgetedFunds.map((f) => f.id);

      // Get current month spending for all funds
      const spending =
        allFundIds.length > 0
          ? await ctx.db
              .select({
                fundId: transactions.fundId,
                amount: sum(transactions.amount).mapWith(Number),
              })
              .from(transactions)
              .where(
                and(
                  inArray(transactions.fundId, allFundIds),
                  gte(transactions.date, monthStart),
                  lt(transactions.date, monthEnd)
                )
              )
              .groupBy(transactions.fundId)
          : [];

      const spendingMap = new Map(
        spending.map((s) => [s.fundId, s.amount ?? 0])
      );

      // Calculate envelope health
      const envelopeHealth: EnvelopeHealth = {
        onTrack: 0,
        atRisk: 0,
        overspent: 0,
      };

      const fundUtilizations: Array<{
        fundId: number;
        fundName: string;
        spent: number;
        budget: number;
        utilization: number;
        remaining: number;
      }> = [];

      for (const fund of recurringFunds) {
        const monthlyBudget = getMonthlyBudget(
          Number(fund.budgetedAmount),
          fund.timeMode as TimeMode,
          referenceDate
        );
        if (monthlyBudget === null || monthlyBudget === 0) {
          continue;
        }

        const spent = spendingMap.get(fund.id) ?? 0;
        const utilization = (spent / monthlyBudget) * 100;
        const remaining = monthlyBudget - spent;

        fundUtilizations.push({
          fundId: fund.id,
          fundName: fund.name,
          spent,
          budget: monthlyBudget,
          utilization,
          remaining,
        });

        if (utilization < HEALTH_ON_TRACK_MAX) {
          envelopeHealth.onTrack++;
        } else if (utilization <= HEALTH_AT_RISK_MAX) {
          envelopeHealth.atRisk++;
        } else {
          envelopeHealth.overspent++;
        }
      }

      // Find top overspent (highest overage)
      const overspentFunds = fundUtilizations
        .filter((f) => f.utilization > 100)
        .sort((a, b) => b.spent - b.budget - (a.spent - a.budget));
      const topOverspent: FundHighlight | null = overspentFunds[0]
        ? {
            fundId: overspentFunds[0].fundId,
            fundName: overspentFunds[0].fundName,
            amount: overspentFunds[0].spent - overspentFunds[0].budget,
            budgeted: overspentFunds[0].budget,
            percentage: overspentFunds[0].utilization,
          }
        : null;

      // Find top leftover (most remaining budget)
      const underBudgetFunds = fundUtilizations
        .filter((f) => f.remaining > 0)
        .sort((a, b) => b.remaining - a.remaining);
      const topLeftover: FundHighlight | null = underBudgetFunds[0]
        ? {
            fundId: underBudgetFunds[0].fundId,
            fundName: underBudgetFunds[0].fundName,
            amount: underBudgetFunds[0].remaining,
            budgeted: underBudgetFunds[0].budget,
            percentage: underBudgetFunds[0].utilization,
          }
        : null;

      // Month comparison
      const prevMonthStart = startOfMonth(subMonths(referenceDate, 1));
      const prevMonthEnd = endOfMonth(subMonths(referenceDate, 1));

      const [currentTotal] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, monthStart),
            lt(transactions.date, monthEnd)
          )
        );

      const [previousTotal] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, prevMonthStart),
            lt(transactions.date, prevMonthEnd)
          )
        );

      // Check if user had any transactions before this month
      const [firstTransaction] = await ctx.db
        .select({ count: count() })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            lt(transactions.date, monthStart)
          )
        );

      const isFirstMonth = (firstTransaction?.count ?? 0) === 0;

      const currentAmount = currentTotal?.amount ?? 0;
      const previousAmount = previousTotal?.amount ?? 0;
      const percentageChange =
        previousAmount > 0
          ? ((currentAmount - previousAmount) / previousAmount) * 100
          : 0;

      const monthComparison: MonthComparison = {
        current: currentAmount,
        previous: previousAmount,
        percentageChange,
        isFirstMonth,
      };

      // Spending breakdown (top 5 + Other)
      const spendingByFund = await ctx.db
        .select({
          fundId: transactions.fundId,
          fundName: funds.name,
          amount: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(funds, eq(transactions.fundId, funds.id))
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, monthStart),
            lt(transactions.date, monthEnd)
          )
        )
        .groupBy(transactions.fundId, funds.name)
        .orderBy(desc(sum(transactions.amount)));

      const totalSpending = spendingByFund.reduce(
        (sum, f) => sum + (f.amount ?? 0),
        0
      );

      const top5 = spendingByFund.slice(0, 5);
      const otherAmount = spendingByFund
        .slice(5)
        .reduce((sum, f) => sum + (f.amount ?? 0), 0);

      const spendingBreakdown: SpendingCategory[] = top5.map((f) => ({
        fundId: f.fundId,
        fundName: f.fundName,
        amount: f.amount ?? 0,
        percentage:
          totalSpending > 0 ? ((f.amount ?? 0) / totalSpending) * 100 : 0,
      }));

      if (otherAmount > 0) {
        spendingBreakdown.push({
          fundId: -1, // Sentinel for "Other"
          fundName: "Other",
          amount: otherAmount,
          percentage:
            totalSpending > 0 ? (otherAmount / totalSpending) * 100 : 0,
        });
      }

      // Rule-based suggestion
      let suggestion: Suggestion = null;

      // Check for funds overspent 2+ months in a row
      for (const fund of overspentFunds.slice(0, 3)) {
        // Check if overspent last month
        const [lastMonthSpending] = await ctx.db
          .select({ amount: sum(transactions.amount).mapWith(Number) })
          .from(transactions)
          .where(
            and(
              eq(transactions.fundId, fund.fundId),
              gte(transactions.date, prevMonthStart),
              lt(transactions.date, prevMonthEnd)
            )
          );

        const lastMonthAmount = lastMonthSpending?.amount ?? 0;
        const fundInfo = recurringFunds.find((f) => f.id === fund.fundId);
        if (!fundInfo) {
          continue;
        }

        const lastMonthBudget = getMonthlyBudget(
          Number(fundInfo.budgetedAmount),
          fundInfo.timeMode as TimeMode,
          subMonths(referenceDate, 1)
        );

        if (lastMonthBudget && lastMonthAmount > lastMonthBudget) {
          suggestion = {
            type: "overspent_recurring",
            message: `${fund.fundName} has been over budget for 2 months in a row. Consider increasing your budget or finding ways to reduce spending.`,
            fundName: fund.fundName,
          };
          break;
        }
      }

      // If no recurring overspend, check for large overspend (>150%)
      const topOverspentFund = overspentFunds[0];
      if (
        !suggestion &&
        topOverspentFund &&
        topOverspentFund.utilization > 150
      ) {
        suggestion = {
          type: "overspent_large",
          message: `${topOverspentFund.fundName} is significantly over budget. This might be a good time to review your spending patterns.`,
          fundName: topOverspentFund.fundName,
        };
      }

      return {
        envelopeHealth,
        topOverspent,
        topLeftover,
        monthComparison,
        spendingBreakdown,
        suggestion,
        totalSpending,
      };
    }),

  /**
   * Generates an AI-powered monthly summary using Gemini Flash.
   * Returns null if API key is not configured or generation fails.
   */
  summary: protectedProcedure
    .input(
      z
        .object({
          month: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { generateMonthlySummary } = await import("../services/gemini");

      const referenceDate = input?.month ?? new Date();
      const monthStart = startOfMonth(referenceDate);
      const monthEnd = endOfMonth(referenceDate);

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
        .where(and(eq(folders.userId, ctx.userId)));

      const recurringFunds = budgetedFunds.filter(
        (f) => f.timeMode !== "EVENTUALLY" && Number(f.budgetedAmount) > 0
      );

      const allFundIds = budgetedFunds.map((f) => f.id);

      // Get current month spending
      const spending =
        allFundIds.length > 0
          ? await ctx.db
              .select({
                fundId: transactions.fundId,
                amount: sum(transactions.amount).mapWith(Number),
              })
              .from(transactions)
              .where(
                and(
                  inArray(transactions.fundId, allFundIds),
                  gte(transactions.date, monthStart),
                  lt(transactions.date, monthEnd)
                )
              )
              .groupBy(transactions.fundId)
          : [];

      const spendingMap = new Map(
        spending.map((s) => [s.fundId, s.amount ?? 0])
      );

      // Calculate envelope health
      const envelopeHealth = { onTrack: 0, atRisk: 0, overspent: 0 };
      let topOverspent: {
        fundName: string;
        amount: number;
        percentage: number;
      } | null = null;
      let topLeftover: { fundName: string; amount: number } | null = null;
      let maxOverage = 0;
      let maxRemaining = 0;

      for (const fund of recurringFunds) {
        const monthlyBudget = getMonthlyBudget(
          Number(fund.budgetedAmount),
          fund.timeMode as TimeMode,
          referenceDate
        );
        if (!monthlyBudget) {
          continue;
        }

        const spent = spendingMap.get(fund.id) ?? 0;
        const utilization = (spent / monthlyBudget) * 100;
        const remaining = monthlyBudget - spent;
        const overage = spent - monthlyBudget;

        if (utilization < 80) {
          envelopeHealth.onTrack++;
        } else if (utilization <= 100) {
          envelopeHealth.atRisk++;
        } else {
          envelopeHealth.overspent++;
        }

        if (overage > maxOverage) {
          maxOverage = overage;
          topOverspent = {
            fundName: fund.name,
            amount: overage,
            percentage: utilization,
          };
        }

        if (remaining > maxRemaining) {
          maxRemaining = remaining;
          topLeftover = { fundName: fund.name, amount: remaining };
        }
      }

      // Month comparison
      const prevMonthStart = startOfMonth(subMonths(referenceDate, 1));
      const prevMonthEnd = endOfMonth(subMonths(referenceDate, 1));

      const [currentTotal] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, monthStart),
            lt(transactions.date, monthEnd)
          )
        );

      const [previousTotal] = await ctx.db
        .select({ amount: sum(transactions.amount).mapWith(Number) })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            gte(transactions.date, prevMonthStart),
            lt(transactions.date, prevMonthEnd)
          )
        );

      const [firstTransaction] = await ctx.db
        .select({ count: count() })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, ctx.userId),
            lt(transactions.date, monthStart)
          )
        );

      const isFirstMonth = (firstTransaction?.count ?? 0) === 0;
      const currentAmount = currentTotal?.amount ?? 0;
      const previousAmount = previousTotal?.amount ?? 0;
      const percentageChange =
        previousAmount > 0
          ? ((currentAmount - previousAmount) / previousAmount) * 100
          : 0;

      const text = await generateMonthlySummary(
        {
          envelopeHealth,
          topOverspent,
          topLeftover,
          monthComparison: {
            current: currentAmount,
            previous: previousAmount,
            percentageChange,
            isFirstMonth,
          },
          totalSpending: currentAmount,
        },
        process.env.GOOGLE_AI_API_KEY
      );

      return {
        text,
        generatedAt: new Date(),
      };
    }),
});
