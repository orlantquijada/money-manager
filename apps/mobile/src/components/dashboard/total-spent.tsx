import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { trpc } from "@/utils/api";
import { toWholeCurrency } from "@/utils/format";
import { layoutSpringify, TotalSpentSlideOutUp } from "@/utils/motion";
import Skeleton from "../skeleton";

export default function TotalSpent() {
  const { data: thisMonthTotal = 0, isLoading: isLoadingTotal } = useQuery(
    trpc.transaction.totalThisMonth.queryOptions()
  );
  const { data: folders = [], isLoading: isLoadingFolders } =
    useFoldersWithFunds();

  const totalBudgeted = folders
    .flatMap((f) => f.funds)
    .filter((fund) => fund.timeMode !== "EVENTUALLY")
    .reduce((sum, fund) => sum + fund.monthlyBudget, 0);

  const isLoading = isLoadingTotal || isLoadingFolders;

  return (
    <StyledLeanView>
      {isLoading ? (
        <Skeleton height={40} width={120} />
      ) : (
        <>
          <Animated.Text
            className="font-nunito-bold text-4xl text-foreground"
            entering={FadeIn.duration(300).delay(100)}
            exiting={TotalSpentSlideOutUp}
            key={thisMonthTotal}
            layout={layoutSpringify("snappy")}
          >
            {toWholeCurrency(Math.round(thisMonthTotal))}
          </Animated.Text>
          <Text className="flex-row text-base text-foreground-muted">
            of
            <Text className="font-nunito-bold text-foreground">
              {" "}
              {toWholeCurrency(Math.round(totalBudgeted))}{" "}
            </Text>
            this month
          </Text>
        </>
      )}
    </StyledLeanView>
  );
}
