import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { ChevronRight } from "@/icons";
import { type BudgetAlert, BudgetAlertCard } from "./budget-alert-card";
import type { FundData } from "./pie-chart-segmented";

const MAX_ALERTS = 3;
const ALERT_THRESHOLD = 90; // 90% budget utilization triggers alert

type Props = {
  stats:
    | {
        byFund: FundData[];
      }
    | undefined;
  isLoading?: boolean;
  onSeeAll: () => void;
};

type FundWithBudget = FundData & { budgetUtilization: number };

function hasBudgetUtilization(f: FundData): f is FundWithBudget {
  return (
    f.budgetUtilization !== undefined && f.budgetUtilization >= ALERT_THRESHOLD
  );
}

/**
 * Computes budget alerts from stats byFund data.
 * Returns alerts for funds >= 90% budget utilization.
 */
function computeAlerts(byFund: FundData[]): BudgetAlert[] {
  return byFund
    .filter(hasBudgetUtilization)
    .map((f) => {
      const utilization = f.budgetUtilization;
      const isOver = utilization >= 100;
      return {
        fundId: f.fundId,
        fundName: f.fundName,
        type: isOver ? "over_budget" : "almost_over",
        utilization,
        overage: isOver ? f.amount - (f.budgetedAmount ?? 0) : null,
        severity: isOver ? "critical" : "warning",
      } satisfies BudgetAlert;
    })
    .sort((a, b) => {
      // Critical alerts first
      if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
      // Then by utilization descending
      return b.utilization - a.utilization;
    });
}

export function BudgetAlerts({ stats, isLoading, onSeeAll }: Props) {
  const router = useRouter();

  const alerts = useMemo(
    () => computeAlerts(stats?.byFund ?? []),
    [stats?.byFund]
  );

  const displayAlerts = alerts.slice(0, MAX_ALERTS);
  const hasMore = alerts.length > MAX_ALERTS;

  const handleAlertPress = useCallback(
    (fundId: number) => {
      router.push({
        pathname: "/funds/[id]",
        params: { id: String(fundId) },
      });
    },
    [router]
  );

  // Hide section entirely when no alerts or loading
  if (isLoading || displayAlerts.length === 0) {
    return null;
  }

  return (
    <StyledLeanView className="gap-2">
      {/* Header */}
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted text-xs">
          Budget Alerts
        </StyledLeanText>
        {hasMore && (
          <ScalePressable
            className="flex-row items-center gap-0.5"
            onPress={onSeeAll}
            scaleValue={0.95}
          >
            <StyledLeanText className="font-satoshi-medium text-foreground-muted text-xs">
              See all
            </StyledLeanText>
            <ChevronRight className="text-foreground-muted" size={12} />
          </ScalePressable>
        )}
      </StyledLeanView>

      {/* Alert cards */}
      <StyledLeanView className="gap-2">
        {displayAlerts.map((alert) => (
          <BudgetAlertCard
            alert={alert}
            key={alert.fundId}
            onPress={() => handleAlertPress(alert.fundId)}
          />
        ))}
      </StyledLeanView>
    </StyledLeanView>
  );
}

// Export for use in alerts modal
export { computeAlerts };
