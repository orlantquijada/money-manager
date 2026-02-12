import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { usePreferencesStore } from "@/stores/preferences";
import { trpc } from "@/utils/api";
import { toWholeCurrency } from "@/utils/format";
import { layoutSpringify, TotalSpentSlideOutUp } from "@/utils/motion";
import { ScalePressable } from "../scale-pressable";
import Skeleton from "../skeleton";

export default function TotalSpent() {
  const { data: thisMonthTotal = 0, isLoading: isLoadingTotal } = useQuery(
    trpc.transaction.totalThisMonth.queryOptions()
  );
  const { data: folders = [], isLoading: isLoadingFolders } =
    useFoldersWithFunds();

  const balanceHidden = usePreferencesStore((s) => s.balanceHidden);
  const toggleBalanceHidden = usePreferencesStore((s) => s.toggleBalanceHidden);

  const totalBudgeted = folders
    .flatMap((f) => f.funds)
    .filter((fund) => fund.timeMode !== "EVENTUALLY")
    .reduce((sum, fund) => sum + fund.monthlyBudget, 0);

  const formatAmount = (amount: number) =>
    balanceHidden ? "••••••" : toWholeCurrency(Math.round(amount));

  const isLoading = isLoadingTotal || isLoadingFolders;

  return (
    <StyledLeanView>
      {isLoading ? (
        <Skeleton height={40} width={120} />
      ) : (
        <>
          <StyledLeanView className="flex-row items-center gap-2">
            <Animated.Text
              className="font-nunito-bold text-4xl text-foreground"
              entering={FadeIn.duration(300).delay(100)}
              exiting={TotalSpentSlideOutUp}
              key={balanceHidden ? "hidden" : thisMonthTotal}
              layout={layoutSpringify("snappy")}
            >
              {formatAmount(thisMonthTotal)}
            </Animated.Text>
            <Animated.View layout={layoutSpringify("snappy")}>
              <ScalePressable
                hitSlop={8}
                onPress={toggleBalanceHidden}
                opacityValue={0.7}
              >
                <StyledIconSymbol
                  colorClassName="accent-foreground-muted"
                  name={balanceHidden ? "eye.slash" : "eye"}
                  size={16}
                />
              </ScalePressable>
            </Animated.View>
          </StyledLeanView>
          <Text className="flex-row text-base text-foreground-muted">
            of
            <Text className="font-nunito-bold text-foreground">
              {" "}
              {formatAmount(totalBudgeted)}{" "}
            </Text>
            this month
          </Text>
        </>
      )}
    </StyledLeanView>
  );
}
