import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import type { Ref } from "react";
import {
  StyledBottomSheetView,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";
import { useThemeColor } from "../theme-provider";

type BudgetScoreSheetProps = {
  ref: Ref<BottomSheetModal>;
};

export default function BudgetScoreSheet({ ref }: BudgetScoreSheetProps) {
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const handleBackgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={ScoreBackdrop}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      detached
      enableDynamicSizing
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
      }}
      handleStyle={{
        backgroundColor: handleBackgroundColor,
      }}
      index={0}
      name="budget-score"
      ref={ref}
      style={{
        borderCurve: "continuous",
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <Content />
    </BottomSheetModal>
  );
}
BudgetScoreSheet.displayName = "BudgetScoreSheet";

function ScoreBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  );
}

function Content() {
  const { data } = useQuery(trpc.budget.score.queryOptions());

  if (!data) {
    return null;
  }

  const { score, status, factors } = data;
  const emoji = getStatusEmoji(status);
  const statusLabel = getStatusLabel(status);

  return (
    <StyledBottomSheetView className="flex-1 bg-background px-6 pb-6">
      <StyledLeanView className="mb-4 flex-row items-center gap-2">
        <StyledLeanText className="font-satoshi-bold text-foreground text-xl">
          Budget Score: {score}
        </StyledLeanText>
        <StyledLeanText className="text-xl">{emoji}</StyledLeanText>
      </StyledLeanView>

      {factors.length > 0 ? (
        <StyledLeanView className="gap-1">
          {factors.map((factor, index) => (
            <FactorRow
              description={factor.description}
              key={index}
              points={factor.points}
            />
          ))}

          <StyledLeanView className="my-2 h-px bg-border-secondary" />

          <StyledLeanView className="flex-row items-center justify-between">
            <StyledLeanText className="font-nunito-bold text-foreground text-lg">
              {score}
            </StyledLeanText>
            <StyledLeanText className="font-satoshi-medium text-base text-foreground-muted">
              {statusLabel}
            </StyledLeanText>
          </StyledLeanView>
        </StyledLeanView>
      ) : (
        <StyledLeanText className="font-satoshi-medium text-base text-foreground-muted">
          No budgeted funds yet. Add budgets to your funds to track your score.
        </StyledLeanText>
      )}
    </StyledBottomSheetView>
  );
}

type FactorRowProps = {
  description: string;
  points: number;
};

function FactorRow({ description, points }: FactorRowProps) {
  const isPositive = points > 0;
  const sign = isPositive ? "+" : "";

  return (
    <StyledLeanView className="flex-row items-center gap-3">
      <StyledLeanText
        className={cn(
          "w-10 font-nunito-bold text-base",
          isPositive ? "text-lime-11" : "text-red-11"
        )}
      >
        {sign}
        {points}
      </StyledLeanText>
      <StyledLeanText
        className="flex-1 font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {description}
      </StyledLeanText>
    </StyledLeanView>
  );
}

function getStatusEmoji(
  status: "on_track" | "needs_attention" | "over_budget"
): string {
  switch (status) {
    case "on_track":
      return "\u{1F7E2}"; // Green circle
    case "needs_attention":
      return "\u{1F7E1}"; // Yellow circle
    case "over_budget":
      return "\u{1F534}"; // Red circle
  }
}

function getStatusLabel(
  status: "on_track" | "needs_attention" | "over_budget"
): string {
  switch (status) {
    case "on_track":
      return "On Track";
    case "needs_attention":
      return "Needs Attention";
    case "over_budget":
      return "Over Budget";
  }
}
