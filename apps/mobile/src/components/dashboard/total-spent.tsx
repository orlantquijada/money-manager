import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { AnimatedArrowDown } from "@/icons";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { toWholeCurrency } from "@/utils/format";
import {
  layoutSpringify,
  TotalSpentSlideOutUp,
  totalSpentSlideOutUpConfig,
  transitions,
} from "@/utils/motion";
import Skeleton from "../skeleton";
import { useThemeColor } from "../theme-provider";

export default function TotalSpent() {
  const { data: thisMonthTotal = 0, isLoading: isLoadingThisMonth } = useQuery(
    trpc.transaction.totalThisMonth.queryOptions()
  );

  const { data: lastMonthTotal = 0, isLoading: isLoadingLastMonth } = useQuery(
    trpc.transaction.totalLastMonth.queryOptions()
  );

  const isLoading = isLoadingThisMonth || isLoadingLastMonth;

  const comparison = useMemo(() => {
    if (lastMonthTotal === 0) {
      return { percentage: 0, isIncrease: false, hasData: false };
    }

    const difference = thisMonthTotal - lastMonthTotal;
    const percentage = Math.abs((difference / lastMonthTotal) * 100);

    return {
      percentage: Math.round(percentage),
      isIncrease: difference > 0,
      hasData: true,
    };
  }, [thisMonthTotal, lastMonthTotal]);

  return (
    <StyledLeanView>
      <StyledLeanView className="w-full flex-row items-center">
        {isLoading ? (
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

        {!isLoading && comparison.hasData && (
          <ProgressIndicator
            isIncrease={comparison.isIncrease}
            percentage={comparison.percentage}
          />
        )}
      </StyledLeanView>

      <StyledLeanText className="mr-1 font-satoshi-medium text-base text-foreground-muted">
        Total spent this month
      </StyledLeanText>
    </StyledLeanView>
  );
}

type ProgressIndicatorProps = {
  isIncrease: boolean;
  percentage: number;
};

function ProgressIndicator({ isIncrease, percentage }: ProgressIndicatorProps) {
  const increaseColor = useThemeColor("red-11");
  const decreaseColor = useThemeColor("lime-11");

  return (
    <Animated.View
      className="flex-row justify-center gap-1"
      entering={FadeInDown.withInitialValues({
        transform: [{ translateY: 12 }],
      }).springify()}
      layout={layoutSpringify("snappy").delay(totalSpentSlideOutUpConfig.delay)}
    >
      <StyledLeanView
        className={cn(
          "size-5 items-center justify-center rounded-full",
          isIncrease ? "bg-red-4" : "bg-lime-4"
        )}
      >
        <AnimatedArrowDown
          animate={{
            color: isIncrease ? increaseColor : decreaseColor,
            rotate: isIncrease ? "180deg" : "0deg",
          }}
          size={16}
          transition={transitions.snappy}
        />
      </StyledLeanView>
      <StyledLeanText
        className={cn(
          "font-nunito-medium text-sm",
          isIncrease ? "text-red-11" : "text-lime-11"
        )}
      >
        {percentage}%
      </StyledLeanText>
    </Animated.View>
  );
}
