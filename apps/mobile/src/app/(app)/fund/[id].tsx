import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TimeMode } from "api";
import { differenceInDays, endOfMonth, endOfWeek, format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView } from "react-native";
import CategoryProgressBars from "@/components/budgets/category-progress-bars";
import ProgressBar from "@/components/budgets/progress-bar";
import { GlassCloseButton } from "@/components/glass-button";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import {
  type FundWithMeta,
  getTimeModeMultiplier,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { trpc } from "@/utils/api";
import { green } from "@/utils/colors";
import { toCurrencyNarrow } from "@/utils/format";

function getDaysUntilReset(timeMode: TimeMode): number {
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

type SpendingStatsProps = {
  fund: FundWithMeta;
  spent: number;
  remaining: number;
  overspent: number;
  isOverBudget: boolean;
  monthlyBudget: number;
  daysUntilReset: number;
};

function SpendingStats({
  fund,
  spent,
  remaining,
  overspent,
  isOverBudget,
  monthlyBudget,
  daysUntilReset,
}: SpendingStatsProps) {
  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          {TIME_MODE_LABELS[fund.timeMode]} Budget
        </StyledLeanText>
        <StyledLeanText
          className={`font-nunito-bold text-base ${isOverBudget ? "text-destructive" : "text-quick-stat-spending"}`}
        >
          {isOverBudget
            ? `${toCurrencyNarrow(overspent)} overspent`
            : `${toCurrencyNarrow(remaining)} left`}
        </StyledLeanText>
      </StyledLeanView>

      <CategoryProgressBars fund={fund} />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-nunito-semibold text-foreground">
          {toCurrencyNarrow(spent)} spent
        </StyledLeanText>
        <StyledLeanText className="font-satoshi text-foreground-muted">
          of {toCurrencyNarrow(monthlyBudget)} {TIME_MODE_LABELS[fund.timeMode]}
        </StyledLeanText>
      </StyledLeanView>

      {fund.timeMode !== "EVENTUALLY" && (
        <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
          Resets in {daysUntilReset} days
        </StyledLeanText>
      )}
    </StyledLeanView>
  );
}

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: fund, isLoading: fundLoading } = useQuery(
    trpc.fund.retrieve.queryOptions(fundId)
  );

  const { data: transactions, isLoading: txLoading } = useQuery(
    trpc.transaction.recentByFund.queryOptions(fundId)
  );

  const markAsPaid = useMutation(
    trpc.transaction.markAsPaid.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const handleMarkAsPaid = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Mark as Paid",
      "This will create a transaction for the remaining amount.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark as Paid",
          onPress: () => markAsPaid.mutate({ fundId }),
        },
      ]
    );
  };

  const isLoading = fundLoading || txLoading;

  // Calculate progress for color (needs fund data)
  const isNonNegotiable = fund?.fundType === "NON_NEGOTIABLE";
  const isSpending = fund?.fundType === "SPENDING";
  const monthlyBudget = fund
    ? fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode)
    : 0;
  const amountSaved = fund?.totalSpent ?? 0;
  const progress =
    monthlyBudget > 0 ? Math.min(amountSaved / monthlyBudget, 1) : 0;
  const isFunded = amountSaved >= monthlyBudget;

  // SPENDING fund calculations
  const spent = fund?.totalSpent ?? 0;
  const remaining = Math.max(monthlyBudget - spent, 0);
  const overspent = Math.max(spent - monthlyBudget, 0);
  const isOverBudget = spent > monthlyBudget;
  const daysUntilReset = fund ? getDaysUntilReset(fund.timeMode) : 0;

  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Loading...
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  if (!fund) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Fund not found
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  return (
    <StyledLeanView className="flex-1 bg-background pt-4">
      {/* Header */}
      <StyledLeanView className="flex-row items-center justify-between px-4 pb-4">
        <GlassCloseButton />
        <StyledLeanText
          className="flex-1 text-center font-satoshi-medium text-foreground text-lg"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {fund.name}
        </StyledLeanText>
        <StyledLeanView className="w-12" />
      </StyledLeanView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-6 pb-8"
      >
        {/* Progress Section (NON_NEGOTIABLE only) */}
        {isNonNegotiable && (
          <StyledLeanView
            className="gap-3 rounded-2xl bg-card p-4"
            style={{ borderCurve: "continuous" }}
          >
            <StyledLeanView className="flex-row items-center justify-between">
              <StyledLeanText className="font-satoshi-medium text-foreground-muted">
                Savings Progress
              </StyledLeanText>
              <StyledLeanText className="font-nunito-bold text-base text-quick-stat-non-negotiable">
                {Math.round(progress * 100)}%
              </StyledLeanText>
            </StyledLeanView>

            <ProgressBar colorVariant="non-negotiable" progress={progress} />

            <StyledLeanView className="flex-row items-center justify-between">
              <StyledLeanText className="font-nunito-semibold text-foreground">
                {toCurrencyNarrow(amountSaved)}
              </StyledLeanText>
              <StyledLeanText className="font-satoshi text-foreground-muted">
                of {toCurrencyNarrow(monthlyBudget)}{" "}
                {TIME_MODE_LABELS[fund.timeMode]}
              </StyledLeanText>
            </StyledLeanView>

            {isFunded && (
              <ScalePressable
                className="mt-2 items-center rounded-xl bg-green-3 py-3"
                onPress={handleMarkAsPaid}
                style={{
                  borderCurve: "continuous",
                  backgroundColor: green.green3,
                }}
              >
                <StyledLeanText
                  className="font-satoshi-medium text-green-11"
                  style={{
                    color: green.green11,
                  }}
                >
                  ✓ Fully Funded — Tap to Mark as Paid
                </StyledLeanText>
              </ScalePressable>
            )}
          </StyledLeanView>
        )}

        {/* Progress Section (SPENDING funds) */}
        {isSpending && (
          <SpendingStats
            daysUntilReset={daysUntilReset}
            fund={fund as FundWithMeta}
            isOverBudget={isOverBudget}
            monthlyBudget={monthlyBudget}
            overspent={overspent}
            remaining={remaining}
            spent={spent}
          />
        )}

        {/* Transactions */}
        <StyledLeanView className="gap-3">
          <StyledLeanText className="font-satoshi-medium text-foreground-muted">
            Recent Transactions
          </StyledLeanText>

          {(!transactions || transactions.length === 0) && (
            <StyledLeanText className="text-center text-foreground-muted">
              No transactions yet
            </StyledLeanText>
          )}

          {transactions?.map((transaction) => (
            <StyledLeanView
              className="rounded-xl bg-card p-4"
              key={transaction.id}
              style={{ borderCurve: "continuous" }}
            >
              <StyledLeanView className="flex-row items-center justify-between">
                <StyledLeanView className="flex-1">
                  <StyledLeanText
                    className="font-satoshi-medium text-base text-foreground"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {transaction.store?.name || "No store"}
                  </StyledLeanText>
                  {transaction.note && (
                    <StyledLeanText
                      className="mt-0.5 font-satoshi text-foreground-muted text-sm"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {transaction.note}
                    </StyledLeanText>
                  )}
                </StyledLeanView>
                <StyledLeanView className="items-end">
                  <StyledLeanText className="font-nunito-semibold text-base text-foreground">
                    {toCurrencyNarrow(Number(transaction.amount))}
                  </StyledLeanText>
                  <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
                    {transaction.date
                      ? format(new Date(transaction.date), "MMM d")
                      : ""}
                  </StyledLeanText>
                </StyledLeanView>
              </StyledLeanView>
            </StyledLeanView>
          ))}
        </StyledLeanView>
      </ScrollView>
    </StyledLeanView>
  );
}
