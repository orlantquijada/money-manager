import type { Fund, FundType } from ".prisma/client";
import { BottomSheetSectionList, useBottomSheet } from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { mauveDark } from "~/utils/colors";
import { fundTypeReadableText } from "~/utils/constants";
import { getTotalBudgetedAmount, toCurrencyNarrow } from "~/utils/functions";
import { useTransactionStore } from "~/utils/hooks/useTransactionStore";
import { trpc } from "~/utils/trpc";
import ScaleDownPressable from "../ScaleDownPressable";

// TODO: skeleton
const FundSectionList = memo(({ searchText }: { searchText: string }) => {
  const funds = useFunds();

  const selectedFund = useTransactionStore((s) => s.fund);

  const { forceClose } = useBottomSheet();

  const handleSetFund = (newFund: Fund) => {
    useTransactionStore.setState({
      fund: newFund.id === selectedFund?.id ? undefined : newFund,
      lastSelectedFund: newFund.id === selectedFund?.id ? undefined : newFund,
    });
    forceClose();
  };

  const filteredData = searchText
    ? funds.map((item) => ({
        ...item,
        data: item.data.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase())
        ),
      }))
    : funds;

  return (
    <View className="relative flex-1">
      <LinearGradient
        className="absolute right-0 bottom-0 left-0 z-10 h-14"
        colors={["hsla(240, 5.1%, 11.6%, 0)", mauveDark.mauve2]}
      />
      <BottomSheetSectionList
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, section, index }) => {
          const selected = item.id === selectedFund?.id;
          const moneyLeft =
            item.fundType === "SPENDING"
              ? item.totalBudgetedAmount - item.totalSpent * -1
              : item.totalBudgetedAmount - item.totalSpent;

          return (
            <View
              className={clsx(
                "h-12",
                selected ? "bg-mauveDark4" : "bg-transparent",
                section.data.length - 1 === index && "mb-6"
              )}
            >
              <ScaleDownPressable
                className="h-full flex-row items-center justify-between self-stretch px-4"
                onPress={() => {
                  handleSetFund(item);
                }}
                scale={0.98}
              >
                <Text className="font-satoshi-medium text-base text-mauveDark12">
                  {item.name}
                </Text>

                <View className="flex-row items-center gap-1">
                  <View
                    className={clsx(
                      "h-8 justify-center rounded-lg px-2"
                      // moneyLeft > 0 && "bg-lime10",
                      // moneyLeft < 0 && "bg-red10",
                    )}
                  >
                    <Text
                      className={clsx(
                        "font-nunito-medium text-mauveDark11 text-sm",
                        moneyLeft > 0 && "text-limeDark10",
                        moneyLeft < 0 && "text-redDark10"
                      )}
                    >
                      {toCurrencyNarrow(moneyLeft)}
                    </Text>
                  </View>
                </View>
              </ScaleDownPressable>
            </View>
          );
        }}
        renderSectionHeader={({ section }) =>
          section.data.length ? (
            <View>
              <View className="bg-mauveDark2 px-4 pb-2">
                <Text className="font-satoshi-medium text-mauveDark11 text-sm">
                  {fundTypeReadableText[section.title]}
                </Text>
              </View>
              <View className="relative h-2 w-full overflow-y-visible">
                <LinearGradient
                  className="absolute top-0 right-0 left-0 z-10 h-6"
                  colors={[mauveDark.mauve2, "hsla(240, 5.1%, 11.6%, 0)"]}
                />
              </View>
            </View>
          ) : null
        }
        sections={filteredData || []}
        stickySectionHeadersEnabled
      />
    </View>
  );
});
FundSectionList.displayName = "FundSectionList";

function useFunds() {
  const utils = trpc.useContext();

  // BUG: doesn't return data if previously haven't created a transaction
  // data from create-transaction
  const funds = (utils.fund.list.getData() || []).map((fund) => ({
    ...fund,
    totalBudgetedAmount: getTotalBudgetedAmount(fund),
  }));
  // const { data } = trpc.fund.list.useQuery()
  // if (data !== undefined) funds = data

  return useMemo(() => {
    const fundsGroupedByType: Record<FundType, typeof funds> = {
      SPENDING: [],
      TARGET: [],
      NON_NEGOTIABLE: [],
    };

    for (const fund of funds) {
      fundsGroupedByType[fund.fundType].push(fund);
    }

    return Object.entries(fundsGroupedByType).map(
      ([title, data]) =>
        ({
          title,
          data,
        }) as { title: FundType; data: typeof funds }
    );
  }, [funds]);
}

export default FundSectionList;
