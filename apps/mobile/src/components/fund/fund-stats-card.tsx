import { differenceInDays, endOfMonth, endOfWeek } from "date-fns";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import CategoryProgressBars from "@/components/budgets/category-progress-bars";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import {
  type FundWithMeta,
  getTimeModeMultiplier,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { toCurrencyNarrow, toShortDate } from "@/utils/format";

function getDaysUntilReset(timeMode: FundWithMeta["timeMode"]): number {
  const now = new Date();
  if (timeMode === "WEEKLY") {
    return differenceInDays(endOfWeek(now, { weekStartsOn: 0 }), now);
  }
  if (timeMode === "BIMONTHLY") {
    const day = now.getDate();
    return day <= 15 ? 15 - day : differenceInDays(endOfMonth(now), now);
  }
  return differenceInDays(endOfMonth(now), now);
}

function getPeriodStart(timeMode: FundWithMeta["timeMode"]): Date {
  const now = new Date();
  if (timeMode === "WEEKLY") {
    const startOfWeekDate = new Date(now);
    startOfWeekDate.setDate(now.getDate() - now.getDay());
    startOfWeekDate.setHours(0, 0, 0, 0);
    return startOfWeekDate;
  }
  if (timeMode === "BIMONTHLY") {
    const day = now.getDate();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      day <= 15 ? 1 : 16
    );
    start.setHours(0, 0, 0, 0);
    return start;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function isPaidInCurrentPeriod(
  paidAt: Date | null | undefined,
  timeMode: FundWithMeta["timeMode"]
): boolean {
  if (!paidAt) return false;
  const periodStart = getPeriodStart(timeMode);
  return new Date(paidAt) >= periodStart;
}

type Props = {
  fund: FundWithMeta;
  onMarkAsPaid?: () => void;
};

export default function FundStatsCard({ fund, onMarkAsPaid }: Props) {
  const monthlyBudget =
    fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode);
  const daysUntilReset = getDaysUntilReset(fund.timeMode);

  if (fund.timeMode === "EVENTUALLY") {
    return (
      <EventuallyStats
        amountSaved={fund.totalSpent}
        fund={fund}
        goalAmount={monthlyBudget}
      />
    );
  }

  if (fund.fundType === "NON_NEGOTIABLE") {
    return (
      <NonNegotiableStats
        amountSaved={fund.totalSpent}
        daysUntilReset={daysUntilReset}
        fund={fund}
        monthlyBudget={monthlyBudget}
        onMarkAsPaid={onMarkAsPaid}
      />
    );
  }

  return (
    <SpendingStats
      daysUntilReset={daysUntilReset}
      fund={fund}
      monthlyBudget={monthlyBudget}
      spent={fund.totalSpent}
    />
  );
}

type SpendingStatsProps = {
  fund: FundWithMeta;
  spent: number;
  monthlyBudget: number;
  daysUntilReset: number;
};

function SpendingStats({
  fund,
  spent,
  monthlyBudget,
  daysUntilReset,
}: SpendingStatsProps) {
  const remaining = Math.max(monthlyBudget - spent, 0);
  const overspent = Math.max(spent - monthlyBudget, 0);
  const isOverBudget = spent > monthlyBudget;

  const periodLabels: Record<string, string> = {
    WEEKLY: "Weekly Budget",
    BIMONTHLY: "Bimonthly Budget",
    MONTHLY: "Monthly Budget",
    EVENTUALLY: "Budget",
  };
  const periodLabel = periodLabels[fund.timeMode] ?? "Budget";

  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          {periodLabel}
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanText
        className={`font-nunito-bold text-2xl ${isOverBudget ? "text-destructive" : "text-foreground"}`}
      >
        {isOverBudget
          ? `${toCurrencyNarrow(overspent)} overspent`
          : `${toCurrencyNarrow(remaining)} left`}
      </StyledLeanText>

      <CategoryProgressBars fund={fund} variant="detail" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi text-foreground-muted">
          {toCurrencyNarrow(spent)} spent of {toCurrencyNarrow(monthlyBudget)}{" "}
          {TIME_MODE_LABELS[fund.timeMode] || "monthly"}
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        Resets in {daysUntilReset} days
      </StyledLeanText>
    </StyledLeanView>
  );
}

type NonNegotiableStatsProps = {
  fund: FundWithMeta;
  amountSaved: number;
  monthlyBudget: number;
  daysUntilReset: number;
  onMarkAsPaid?: () => void;
};

function NonNegotiableStats({
  fund,
  amountSaved,
  monthlyBudget,
  daysUntilReset,
  onMarkAsPaid,
}: NonNegotiableStatsProps) {
  const isPaid = isPaidInCurrentPeriod(fund.paidAt, fund.timeMode);
  const isFunded = amountSaved >= monthlyBudget;
  const percentSaved =
    monthlyBudget > 0 ? Math.round((amountSaved / monthlyBudget) * 100) : 0;

  const billLabels: Record<string, string> = {
    WEEKLY: "Weekly Bill",
    BIMONTHLY: "Bimonthly Bill",
    MONTHLY: "Monthly Bill",
    EVENTUALLY: "Bill",
  };
  const periodLabel = billLabels[fund.timeMode] ?? "Bill";

  const handleMarkAsPaid = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onMarkAsPaid) {
      Alert.alert(
        "Mark as Paid",
        "This will create a transaction for the remaining amount.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Mark as Paid", onPress: onMarkAsPaid },
        ]
      );
    }
  };

  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          {periodLabel}
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanText className="font-nunito-bold text-2xl text-quick-stat-non-negotiable">
        {toCurrencyNarrow(amountSaved)} saved
      </StyledLeanText>

      <CategoryProgressBars fund={fund} variant="detail" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi text-foreground-muted">
          {percentSaved}% of {toCurrencyNarrow(monthlyBudget)}{" "}
          {TIME_MODE_LABELS[fund.timeMode] || "monthly"}
        </StyledLeanText>
      </StyledLeanView>

      {isPaid && fund.paidAt ? (
        <StyledLeanView
          className="mt-1 items-center rounded-xl border border-lime-9 py-2"
          style={{ borderCurve: "continuous" }}
        >
          <StyledLeanText className="font-satoshi-medium text-quick-stat-non-negotiable">
            Paid on {toShortDate(new Date(fund.paidAt))}
          </StyledLeanText>
        </StyledLeanView>
      ) : (
        <>
          <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
            Resets in {daysUntilReset} days
          </StyledLeanText>

          {isFunded && onMarkAsPaid && (
            <ScalePressable
              className="mt-2 items-center rounded-xl border border-lime-9 py-3"
              onPress={handleMarkAsPaid}
              style={{ borderCurve: "continuous" }}
            >
              <StyledLeanText className="font-satoshi-medium text-quick-stat-non-negotiable">
                Tap to Mark as Paid
              </StyledLeanText>
            </ScalePressable>
          )}
        </>
      )}
    </StyledLeanView>
  );
}

type EventuallyStatsProps = {
  fund: FundWithMeta;
  amountSaved: number;
  goalAmount: number;
};

function EventuallyStats({
  fund,
  amountSaved,
  goalAmount,
}: EventuallyStatsProps) {
  const remaining = Math.max(goalAmount - amountSaved, 0);
  const isGoalMet = amountSaved >= goalAmount;
  const textColor =
    isGoalMet || amountSaved >= goalAmount * 0.5
      ? "text-quick-stat-non-negotiable"
      : "text-foreground";

  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          Goal
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanText className={`font-nunito-bold text-2xl ${textColor}`}>
        {isGoalMet ? "Goal met" : `${toCurrencyNarrow(remaining)} to go`}
      </StyledLeanText>

      <CategoryProgressBars fund={fund} variant="detail" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi text-foreground-muted">
          {toCurrencyNarrow(amountSaved)} saved of{" "}
          {toCurrencyNarrow(goalAmount)} goal
        </StyledLeanText>
      </StyledLeanView>
    </StyledLeanView>
  );
}
