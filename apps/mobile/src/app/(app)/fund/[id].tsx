import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TimeMode } from "api";
import { differenceInDays, endOfMonth, endOfWeek, format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  TextInput as RNTextInput,
  ScrollView,
} from "react-native";
import CategoryProgressBars from "@/components/budgets/category-progress-bars";
import { GlassCloseButton } from "@/components/glass-button";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useDebounce } from "@/hooks/use-debounce";
import { useAddExpenseStore } from "@/lib/add-expense";
import {
  type FundWithMeta,
  getTimeModeMultiplier,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { trpc } from "@/utils/api";
import { green, red } from "@/utils/colors";
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

function getPeriodStart(timeMode: TimeMode): Date {
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
  // MONTHLY or EVENTUALLY
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function isPaidInCurrentPeriod(
  paidAt: Date | null | undefined,
  timeMode: TimeMode
): boolean {
  if (!paidAt) return false;
  const periodStart = getPeriodStart(timeMode);
  return new Date(paidAt) >= periodStart;
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
          className={`font-nunito-bold text-base ${isOverBudget ? "text-destructive" : "text-foreground-muted"}`}
        >
          {isOverBudget
            ? `${toCurrencyNarrow(overspent)} overspent`
            : `${toCurrencyNarrow(remaining)} left`}
        </StyledLeanText>
      </StyledLeanView>

      <CategoryProgressBars fund={fund} variant="detail" />

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

type NonNegotiableStatsProps = {
  fund: FundWithMeta;
  amountSaved: number;
  monthlyBudget: number;
  daysUntilReset: number;
  isFunded: boolean;
  paidAt: Date | null;
  onMarkAsPaid: () => void;
};

function NonNegotiableStats({
  fund,
  amountSaved,
  monthlyBudget,
  daysUntilReset,
  isFunded,
  paidAt,
  onMarkAsPaid,
}: NonNegotiableStatsProps) {
  const isPaid = isPaidInCurrentPeriod(paidAt, fund.timeMode);

  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          {TIME_MODE_LABELS[fund.timeMode]} Bill
        </StyledLeanText>
        <StyledLeanText className="font-nunito-bold text-base text-quick-stat-non-negotiable">
          {toCurrencyNarrow(amountSaved)} saved
        </StyledLeanText>
      </StyledLeanView>

      <CategoryProgressBars fund={fund} variant="detail" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-nunito-semibold text-foreground">
          {Math.round((amountSaved / monthlyBudget) * 100)}%
        </StyledLeanText>
        <StyledLeanText className="font-satoshi text-foreground-muted">
          of {toCurrencyNarrow(monthlyBudget)} {TIME_MODE_LABELS[fund.timeMode]}
        </StyledLeanText>
      </StyledLeanView>

      {isPaid && paidAt ? (
        <StyledLeanView
          className="mt-1 items-center rounded-xl py-2"
          style={{
            borderCurve: "continuous",
            backgroundColor: green.green3,
          }}
        >
          <StyledLeanText
            className="font-satoshi-medium"
            style={{ color: green.green11 }}
          >
            ✓ Paid on {format(new Date(paidAt), "MMM d")}
          </StyledLeanText>
        </StyledLeanView>
      ) : (
        <>
          {fund.timeMode !== "EVENTUALLY" && (
            <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
              Resets in {daysUntilReset} days
            </StyledLeanText>
          )}

          {isFunded && (
            <ScalePressable
              className="mt-2 items-center rounded-xl py-3"
              onPress={onMarkAsPaid}
              style={{
                borderCurve: "continuous",
                backgroundColor: green.green3,
              }}
            >
              <StyledLeanText
                className="font-satoshi-medium"
                style={{ color: green.green11 }}
              >
                ✓ Fully Funded — Tap to Mark as Paid
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
  monthlyBudget: number;
  isGoalMet: boolean;
};

function EventuallyStats({
  fund,
  amountSaved,
  monthlyBudget,
  isGoalMet,
}: EventuallyStatsProps) {
  const remaining = Math.max(monthlyBudget - amountSaved, 0);
  const percentSaved =
    monthlyBudget > 0 ? (amountSaved / monthlyBudget) * 100 : 0;
  const textColor =
    percentSaved >= 50 || isGoalMet
      ? "text-quick-stat-non-negotiable"
      : "text-foreground-muted";

  return (
    <StyledLeanView
      className="gap-3 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-foreground-muted">
          Goal
        </StyledLeanText>
        <StyledLeanText className={`font-nunito-bold text-base ${textColor}`}>
          {isGoalMet
            ? "Goal met"
            : `${toCurrencyNarrow(remaining)} away from goal`}
        </StyledLeanText>
      </StyledLeanView>

      <CategoryProgressBars fund={fund} variant="detail" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-nunito-semibold text-foreground">
          {toCurrencyNarrow(amountSaved)} saved
        </StyledLeanText>
        <StyledLeanText className="font-satoshi text-foreground-muted">
          of {toCurrencyNarrow(monthlyBudget)} goal
        </StyledLeanText>
      </StyledLeanView>
    </StyledLeanView>
  );
}

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const cursorColor = useThemeColor("foreground");

  const { data: fund, isLoading: fundLoading } = useQuery(
    trpc.fund.retrieve.queryOptions(fundId)
  );

  const { data: transactions, isLoading: txLoading } = useQuery(
    trpc.transaction.recentByFund.queryOptions(fundId)
  );

  // Editable fund name state
  const [localName, setLocalName] = useState("");
  const debouncedName = useDebounce(localName, 500);
  const lastSavedName = useRef("");

  // Initialize local name when fund loads
  useEffect(() => {
    if (fund?.name && localName === "") {
      setLocalName(fund.name);
      lastSavedName.current = fund.name;
    }
  }, [fund?.name, localName]);

  const updateNameMutation = useMutation(
    trpc.fund.update.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries({ queryKey: ["fund"] });
        lastSavedName.current = debouncedName;
      },
    })
  );

  // Debounced auto-save
  useEffect(() => {
    if (
      debouncedName &&
      debouncedName !== lastSavedName.current &&
      debouncedName.trim() !== ""
    ) {
      updateNameMutation.mutate({ id: fundId, name: debouncedName });
    }
  }, [debouncedName, fundId, updateNameMutation.mutate]);

  // Save on blur (immediate)
  const handleNameBlur = () => {
    if (
      localName &&
      localName !== lastSavedName.current &&
      localName.trim() !== ""
    ) {
      updateNameMutation.mutate({ id: fundId, name: localName });
      lastSavedName.current = localName;
    }
  };

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

  // Quick actions mutations
  const archiveMutation = useMutation(
    trpc.fund.update.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.fund.delete.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const handleAddExpense = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useAddExpenseStore.getState().setSelectedFundId(fundId);
    router.push("/(app)/(tabs)/add-expense");
  };

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Archive Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) {
          archiveMutation.mutate({ id: fundId, enabled: false });
        }
      }
    );
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) {
          deleteMutation.mutate(fundId);
        }
      }
    );
  };

  const isLoading = fundLoading || txLoading;

  // Calculate fund stats
  const isNonNegotiable = fund?.fundType === "NON_NEGOTIABLE";
  const isSpending = fund?.fundType === "SPENDING";
  const monthlyBudget = fund
    ? fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode)
    : 0;
  const amountSaved = fund?.totalSpent ?? 0;
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
        <RNTextInput
          className="flex-1 text-center font-satoshi-medium text-foreground text-lg"
          cursorColor={cursorColor}
          onBlur={handleNameBlur}
          onChangeText={setLocalName}
          returnKeyType="done"
          selectionColor={cursorColor}
          value={localName}
        />
        <StyledLeanView className="w-12" />
      </StyledLeanView>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-6 pb-8"
      >
        {/* Progress Section */}
        {fund.timeMode === "EVENTUALLY" ? (
          <EventuallyStats
            amountSaved={amountSaved}
            fund={fund as FundWithMeta}
            isGoalMet={isFunded}
            monthlyBudget={monthlyBudget}
          />
        ) : (
          <>
            {/* Progress Section (NON_NEGOTIABLE only) */}
            {isNonNegotiable && (
              <NonNegotiableStats
                amountSaved={amountSaved}
                daysUntilReset={daysUntilReset}
                fund={fund as FundWithMeta}
                isFunded={isFunded}
                monthlyBudget={monthlyBudget}
                onMarkAsPaid={handleMarkAsPaid}
                paidAt={fund.paidAt}
              />
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
          </>
        )}

        {/* Transactions */}
        <StyledLeanView className="gap-3">
          <StyledLeanView className="flex-row items-center justify-between">
            <StyledLeanText className="font-satoshi-medium text-foreground-muted">
              Recent Transactions
            </StyledLeanText>
            {transactions && transactions.length > 0 && (
              <ScalePressable
                onPress={() => router.push(`/fund/${fundId}/transactions`)}
              >
                <StyledLeanText className="font-satoshi-medium text-primary">
                  See all
                </StyledLeanText>
              </ScalePressable>
            )}
          </StyledLeanView>

          {(!transactions || transactions.length === 0) && (
            <StyledLeanText className="text-center text-foreground-muted">
              No transactions yet
            </StyledLeanText>
          )}

          {transactions?.slice(0, 5).map((transaction) => (
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

        {/* Quick Actions */}
        <StyledLeanView className="gap-3">
          <StyledLeanText className="font-satoshi-medium text-foreground-muted">
            Actions
          </StyledLeanText>

          <ScalePressable
            className="items-center rounded-xl bg-card py-3"
            onPress={handleAddExpense}
            style={{ borderCurve: "continuous" }}
          >
            <StyledLeanText className="font-satoshi-medium text-primary">
              Add Expense
            </StyledLeanText>
          </ScalePressable>

          <ScalePressable
            className="items-center rounded-xl bg-card py-3"
            onPress={handleArchive}
            style={{ borderCurve: "continuous" }}
          >
            <StyledLeanText className="font-satoshi-medium text-foreground">
              Archive Fund
            </StyledLeanText>
          </ScalePressable>

          <ScalePressable
            className="items-center rounded-xl py-3"
            onPress={handleDelete}
            style={{
              borderCurve: "continuous",
              backgroundColor: red.red3,
            }}
          >
            <StyledLeanText
              className="font-satoshi-medium"
              style={{ color: red.red11 }}
            >
              Delete Fund
            </StyledLeanText>
          </ScalePressable>
        </StyledLeanView>
      </ScrollView>
    </StyledLeanView>
  );
}
