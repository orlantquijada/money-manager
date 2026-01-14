import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import type { RefObject } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { toWholeCurrency } from "@/utils/format";
import { layoutSpringify, TotalSpentSlideOutUp } from "@/utils/motion";
import { ScalePressable } from "../scale-pressable";
import Skeleton from "../skeleton";

type TotalSpentProps = {
  scoreSheetRef?: RefObject<BottomSheetModal | null>;
};

export default function TotalSpent({ scoreSheetRef }: TotalSpentProps) {
  const { data: thisMonthTotal = 0, isLoading: isLoadingTotal } = useQuery(
    trpc.transaction.totalThisMonth.queryOptions()
  );

  const { data: scoreData, isLoading: isLoadingScore } = useQuery(
    trpc.budget.score.queryOptions()
  );

  const isLoading = isLoadingTotal || isLoadingScore;

  return (
    <StyledLeanView>
      <StyledLeanView className="w-full flex-row items-center">
        {isLoadingTotal ? (
          <Skeleton height={40} width={120} />
        ) : (
          <Animated.Text
            className="mr-2 font-nunito-bold text-4xl text-foreground"
            entering={FadeIn.duration(300).delay(100)}
            exiting={TotalSpentSlideOutUp}
            key={thisMonthTotal}
            layout={layoutSpringify("snappy")}
          >
            {toWholeCurrency(Math.round(thisMonthTotal))}
          </Animated.Text>
        )}

        {!isLoading && scoreData && (
          <BudgetScoreIndicator
            onPress={() => scoreSheetRef?.current?.present()}
            score={scoreData.score}
            status={scoreData.status}
          />
        )}
      </StyledLeanView>

      <StyledLeanText className="mr-1 font-satoshi-medium text-base text-foreground-muted">
        Total spent this month
      </StyledLeanText>
    </StyledLeanView>
  );
}

type BudgetScoreIndicatorProps = {
  score: number;
  status: "on_track" | "needs_attention" | "over_budget";
  onPress?: () => void;
};

function BudgetScoreIndicator({
  score,
  status,
  onPress,
}: BudgetScoreIndicatorProps) {
  const emoji = getStatusEmoji(status);
  const bgColor = getStatusBgColor(status);

  return (
    <Animated.View
      entering={FadeInDown.withInitialValues({
        transform: [{ translateY: 12 }],
      }).springify()}
      layout={layoutSpringify("snappy")}
    >
      <ScalePressable
        className={cn(
          "flex-row items-center gap-1 rounded-full px-2 py-1",
          bgColor
        )}
        onPress={onPress}
        opacityValue={0.8}
        scaleValue={0.95}
      >
        <StyledLeanText className="text-sm">{emoji}</StyledLeanText>
        <StyledLeanText className="font-nunito-bold text-foreground text-sm">
          {score}
        </StyledLeanText>
      </ScalePressable>
    </Animated.View>
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

function getStatusBgColor(
  status: "on_track" | "needs_attention" | "over_budget"
): string {
  switch (status) {
    case "on_track":
      return "bg-lime-4";
    case "needs_attention":
      return "bg-amber-4";
    case "over_budget":
      return "bg-red-4";
  }
}
