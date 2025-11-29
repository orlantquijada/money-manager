import type { Fund } from ".prisma/client";
import {
  BottomSheetFlatList,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { memo, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { mauveDark } from "~/utils/colors";
import {
  debounce,
  getTotalBudgetedAmount,
  toCurrencyNarrow,
} from "~/utils/functions";
import { useTransactionStore } from "~/utils/hooks/useTransactionStore";
import { trpc } from "~/utils/trpc";
import CheckIcon from "../../../assets/icons/checkbox-circle-duo-dark.svg";
import ChevronDownIcon from "../../../assets/icons/hero-icons/chevron-down.svg";
import ScaleDownPressable from "../ScaleDownPressable";
import FundSectionList from "./FundSectionList";

export function FundBottomSheetContent() {
  const { dismiss } = useBottomSheetModal();

  const [input, setInput] = useState("");
  const [deferredInput, setDeferredInput] = useState("");

  const handleDeferredSetInput = useMemo(
    () =>
      debounce((text: string) => {
        setDeferredInput(text);
      }, 500),
    []
  );

  return (
    <View className="flex-1">
      <View className="h-16 flex-row items-center justify-between px-4">
        <ScaleDownPressable
          hitSlop={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
          }}
          onPress={() => {
            dismiss();
          }}
          opacity={0.5}
          scale={0.9}
        >
          <ChevronDownIcon
            color={mauveDark.mauve12}
            height={20}
            strokeWidth={3}
            width={20}
          />
        </ScaleDownPressable>

        <TextInput
          className="ml-4 h-full grow font-satoshi-medium text-mauveDark12 text-xl"
          onChangeText={(text) => {
            setInput(text);
            handleDeferredSetInput(text);
          }}
          placeholder="Search Funds"
          placeholderTextColor={mauveDark.mauve10}
        />
      </View>

      <MotiView
        animate={{ opacity: deferredInput !== input ? 0.5 : 1 }}
        className={"flex-1"}
      >
        {/* <FundList searchText={deferredInput} /> */}
        <FundSectionList searchText={deferredInput} />
      </MotiView>
    </View>
  );
}

// WARN: DEAD CODE
const FundList = memo(({ searchText }: { searchText: string }) => {
  const { data, status } = useFunds();

  const selectedFund = useTransactionStore((s) => s.fund);

  const { forceClose } = useBottomSheet();

  if (status !== "success") {
    return (
      <View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
            height={20}
            width={200}
          />
        </View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
            height={20}
            width={180}
          />
        </View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
            height={20}
            width={240}
          />
        </View>
      </View>
    );
  }

  const filteredData = searchText
    ? data.filter(({ name }) =>
        name.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  const handleSetFund = (newFund: Fund) => {
    useTransactionStore.setState({
      fund: newFund.id === selectedFund?.id ? undefined : newFund,
    });
    forceClose();
  };

  return (
    <BottomSheetFlatList
      data={filteredData}
      keyboardShouldPersistTaps="always"
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const selected = item.id === selectedFund?.id;
        const moneyLeft = item.totalBudgetedAmount - item.totalSpent;

        return (
          <View
            className={clsx(
              "h-12",
              selected ? "bg-mauveDark4" : "bg-transparent"
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
                      "font-nunito-medium text-sm",
                      moneyLeft > 0 && "text-limeDark10",
                      moneyLeft < 0 && "text-redDark10"
                    )}
                  >
                    {toCurrencyNarrow(moneyLeft)}
                  </Text>
                </View>

                {selected ? (
                  <CheckIcon color={mauveDark.mauve12} height={20} width={20} />
                ) : null}
              </View>
            </ScaleDownPressable>
          </View>
        );
      }}
    />
  );
});
FundList.displayName = "FundList";

function useFunds() {
  return trpc.fund.list.useQuery(undefined, {
    select: (funds) =>
      funds.map((fund) => ({
        ...fund,
        totalBudgetedAmount: getTotalBudgetedAmount(fund),
      })),
  });
}
