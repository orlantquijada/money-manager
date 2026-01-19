import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import type { StorePick } from "api";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  StyledBottomSheetView,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { useAddExpenseStore } from "@/lib/add-expense";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";

type StorePickerSheetProps = {
  ref: React.Ref<BottomSheetModal>;
};

export function StorePickerSheet({ ref }: StorePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  // Pre-fetch stores data before sheet opens
  const { data: stores } = useQuery(trpc.store.list.queryOptions());

  return (
    <BottomSheetModal
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor }}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
        width: 80,
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      ref={ref}
      snapPoints={["50%", "100%"]}
      topInset={insets.top}
    >
      <Content stores={stores ?? []} />
    </BottomSheetModal>
  );
}

function Backdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  );
}

type ContentProps = {
  stores: StorePick[];
};

function Content({ stores }: ContentProps) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();
  const { close } = useBottomSheet();

  // Get state from store
  const selectedStore = useAddExpenseStore((s) => s.selectedStore);
  const selectStoreWithFundDefault = useAddExpenseStore(
    (s) => s.selectStoreWithFundDefault
  );

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");

  const filteredStores = useMemo(() => {
    if (!search.trim()) return stores;
    return stores.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stores, search]);

  const exactMatch = useMemo(() => {
    if (!search.trim()) return false;
    return stores.some(
      (s) => s.name.toLowerCase() === search.trim().toLowerCase()
    );
  }, [stores, search]);

  const showAddNew = search.trim().length > 0 && !exactMatch;

  const handleSelect = (store: StorePick) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    selectStoreWithFundDefault(store);
    setSearch("");
    close();
  };

  const handleAddNew = () => {
    const newStore: StorePick = {
      id: 0,
      name: search.trim(),
      lastSelectedFundId: null,
      lastSelectedFundName: null,
    };
    handleSelect(newStore);
  };

  return (
    <StyledLeanView className="flex-1">
      {/* Search Input */}
      <StyledLeanView className="px-6 pt-2 pb-4">
        <BottomSheetTextInput
          autoCapitalize="words"
          autoCorrect={false}
          cursorColor={foregroundColor}
          onChangeText={setSearch}
          placeholder="Search or add Store"
          placeholderTextColor={mutedColor}
          selectionColor={foregroundColor}
          style={{
            fontFamily: "Satoshi-Medium",
            fontSize: 16,
            color: foregroundColor,
            padding: 0,
          }}
          value={search}
        />
      </StyledLeanView>

      {/* Add New Store Option */}
      {showAddNew && (
        <ScalePressable
          className="mt-4 flex-row items-center gap-2 px-6 py-3"
          onPress={handleAddNew}
          opacityValue={0.7}
          scaleValue={0.98}
        >
          <IconSymbol color={mutedColor} name="plus" size={16} />
          <StyledLeanText
            className="font-satoshi-medium text-base text-foreground"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            Add "{search.trim()}"
          </StyledLeanText>
        </ScalePressable>
      )}

      {/* Store List */}
      {filteredStores.length > 0 ? (
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: 16,
          }}
          scrollEventThrottle={16}
        >
          {filteredStores.map((store) => (
            <StoreRow
              isSelected={selectedStore?.id === store.id}
              key={`store-${store.id}`}
              onPress={() => handleSelect(store)}
              store={store}
            />
          ))}
        </BottomSheetScrollView>
      ) : (
        !showAddNew && (
          <StyledBottomSheetView className="flex-1 items-center justify-center px-6">
            <StyledLeanText
              className="text-center font-satoshi-medium text-foreground-muted"
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {search.trim()
                ? "No stores match your search"
                : "No stores yet. Stores are created automatically when you add transactions."}
            </StyledLeanText>
          </StyledBottomSheetView>
        )
      )}
    </StyledLeanView>
  );
}

type StoreRowProps = {
  store: StorePick;
  isSelected: boolean;
  onPress: () => void;
};

function StoreRow({ store, isSelected, onPress }: StoreRowProps) {
  return (
    <ScalePressable
      className={cn(
        "flex-row items-center justify-between gap-1.5 px-6 py-3",
        isSelected ? "bg-mauve-4" : "bg-background"
      )}
      onPress={onPress}
      opacityValue={0.7}
      scaleValue={0.98}
    >
      <StyledLeanText
        className="font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {store.name}
      </StyledLeanText>
      {store.lastSelectedFundName && (
        <StyledLeanText
          className="font-satoshi-medium text-foreground-muted"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {store.lastSelectedFundName}
        </StyledLeanText>
      )}
    </ScalePressable>
  );
}
