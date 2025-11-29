import type { Store } from ".prisma/client";
import {
  BottomSheetFlatList,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";
import { Skeleton } from "moti/skeleton";
import { memo, useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { mauveDark, violet } from "~/utils/colors";
import { debounce } from "~/utils/functions";
import { useTransactionStore } from "~/utils/hooks/useTransactionStore";
import { trpc } from "~/utils/trpc";
import CheckIcon from "../../../assets/icons/checkbox-circle-duo-dark.svg";

import ChevronDownIcon from "../../../assets/icons/hero-icons/chevron-down.svg";
import PlusIcon from "../../../assets/icons/plus-rec-filled-dark.svg";
import ScaleDownPressable from "../ScaleDownPressable";

export function StoreBottomSheetContent() {
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
          placeholder="Search or add Store"
          placeholderTextColor={mauveDark.mauve10}
        />

        {/* <ScaleDownPressable> */}
        {/*   <Button> */}
        {/*     <Text className="font-satoshi-medium text-mauve12 text-base"> */}
        {/*       Done */}
        {/*     </Text> */}
        {/*   </Button> */}
        {/* </ScaleDownPressable> */}
      </View>

      <MotiView
        animate={{ opacity: deferredInput !== input ? 0.5 : 1 }}
        className={"flex-1"}
      >
        <StoreList searchText={deferredInput} />
      </MotiView>
    </View>
  );
}

const StoreList = memo(({ searchText }: { searchText: string }) => {
  const { data, status } = trpc.store.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });
  const utils = trpc.useContext();

  // data from create-transaction
  const funds = utils.fund.list.getData();

  const formDataStore = useTransactionStore((s) => s.store);

  const animate = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        "worklet";

        return {
          backgroundColor: pressed ? mauveDark.mauve6 : mauveDark.mauve4,
        };
      },
    []
  );

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

  const finalData =
    !searchText &&
    formDataStore &&
    !data.some(({ name }) => name === formDataStore)
      ? [
          ...filteredData,
          { id: -1, name: formDataStore, lastSelectedFundId: null },
        ]
      : filteredData;

  const hasNoStore = data.length === 0;

  const handleSetStore = (newStore: string | Omit<Store, "userId">) => {
    let storeName = typeof newStore === "string" ? newStore : newStore.name;
    if (storeName === formDataStore) {
      storeName = "";
    }

    useTransactionStore.setState((prev) => ({
      store: storeName,
      fund:
        typeof newStore !== "string" &&
        prev.lastSelectedFund === undefined &&
        newStore.lastSelectedFundId
          ? funds?.find((fund) => fund.id === newStore.lastSelectedFundId)
          : prev.fund,
    }));
    forceClose();
  };

  return (
    <View className="flex-1">
      {searchText && !finalData.map(({ name }) => name).includes(searchText) ? (
        <MotiPressable
          animate={animate}
          onPress={() => {
            handleSetStore(searchText);
          }}
          style={{ marginBottom: 8 }}
          transition={{ type: "timing", duration: 250 }}
        >
          <View className="h-16 flex-row items-center px-4">
            <PlusIcon color={violet.violet8} height={20} width={20} />

            <Text className="ml-2 font-satoshi-medium text-base text-violet8">
              Add &quot;{searchText}&quot; Store
            </Text>
          </View>
        </MotiPressable>
      ) : null}

      <BottomSheetFlatList
        data={finalData}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View>
            {hasNoStore ? (
              <View className="mb-4 px-4">
                <Text className="font-satoshi text-base text-mauveDark12">
                  <Text className="font-satoshi-bold underline">Stores</Text>{" "}
                  give you a little more information about an expense; It can be
                  what you bought, or where you had it, like{" "}
                  <Text className="font-satoshi-bold-italic text-mauveDark11">
                    Jollibee
                  </Text>
                  .
                </Text>

                <Text className="mt-4 font-satoshi text-base text-mauveDark12">
                  Start typing to add a store.
                </Text>
              </View>
            ) : null}
          </View>
        )}
        renderItem={({ item }) => {
          const selected = item.name === formDataStore;

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
                  handleSetStore(item);
                }}
                scale={0.98}
              >
                <Text className="font-satoshi-medium text-base text-mauveDark12">
                  {item.name}
                </Text>
                {selected ? (
                  <CheckIcon color={mauveDark.mauve12} height={20} width={20} />
                ) : null}
              </ScaleDownPressable>
            </View>
          );
        }}
      />
    </View>
  );
});
StoreList.displayName = "StoreList";
