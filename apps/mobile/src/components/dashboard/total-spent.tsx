import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { AnimatedArrowDown } from "@/icons";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { lime, red } from "@/utils/colors";
import { toCurrencyShort } from "@/utils/format";
import {
  layoutSpringify,
  TotalSpentSlideOutUp,
  totalSpentSlideOutUpConfig,
  transitions,
} from "@/utils/motion";
import Skeleton from "../skeleton";

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
    <View>
      <View className="w-full flex-row items-center">
        {isLoading ? (
          <Skeleton height={40} width={120} />
        ) : (
          <Animated.Text
            className="mr-2 font-nunito-bold text-4xl text-mauve12"
            entering={FadeIn.duration(300).delay(100)}
            exiting={TotalSpentSlideOutUp}
            key={thisMonthTotal}
            layout={layoutSpringify("snappy")}
          >
            {toCurrencyShort(thisMonthTotal)}
          </Animated.Text>
        )}

        {!isLoading && comparison.hasData && (
          <ProgressIndicator
            isIncrease={comparison.isIncrease}
            percentage={comparison.percentage}
          />
        )}
      </View>

      <Text className="mr-1 font-satoshi-medium text-base text-mauve10">
        Total spent this month
      </Text>
    </View>
  );
}

type ProgressIndicatorProps = {
  isIncrease: boolean;
  percentage: number;
};

function ProgressIndicator({ isIncrease, percentage }: ProgressIndicatorProps) {
  return (
    <Animated.View
      className="flex-row gap-1"
      entering={FadeInDown.withInitialValues({
        transform: [{ translateY: 12 }],
      }).springify()}
      layout={layoutSpringify("snappy").delay(totalSpentSlideOutUpConfig.delay)}
    >
      <View
        className={cn(
          "aspect-square h-5 items-center justify-center rounded-full transition-all",
          isIncrease ? "bg-red4" : "bg-lime4"
        )}
      >
        <AnimatedArrowDown
          animate={{
            color: isIncrease ? red.red11 : lime.lime11,
            rotate: isIncrease ? "180deg" : "0deg",
          }}
          size={16}
          transition={transitions.snappy}
        />
      </View>
      <Text
        className={cn(
          "font-satoshi-medium text-sm transition-all",
          isIncrease ? "text-red11" : "text-lime11"
        )}
      >
        {percentage}%
      </Text>
    </Animated.View>
  );
}
