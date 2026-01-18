import { useQuery } from "@tanstack/react-query";
import Animated, { FadeIn } from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { toWholeCurrency } from "@/utils/format";
import { layoutSpringify, TotalSpentSlideOutUp } from "@/utils/motion";
import Skeleton from "../skeleton";

export default function TotalSpent() {
  const { data: thisMonthTotal = 0, isLoading: isLoadingTotal } = useQuery(
    trpc.transaction.totalThisMonth.queryOptions()
  );

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
      </StyledLeanView>

      <StyledLeanText className="mr-1 font-satoshi-medium text-base text-foreground-muted">
        Total spent this month
      </StyledLeanText>
    </StyledLeanView>
  );
}
