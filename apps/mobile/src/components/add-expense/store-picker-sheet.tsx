import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetTextInput,
  useBottomSheet,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { type Ref, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FadingEdge, { useOverflowFadeEdge } from "@/components/fading-edge";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  StyledBottomSheetView,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";

type Store = {
  id: number;
  name: string;
  lastSelectedFundId: number | null;
};

type StorePickerSheetProps = {
  ref: Ref<BottomSheetModal>;
  selectedStore: Store | null;
  onSelect: (store: Store) => void;
};

export function StorePickerSheet({
  ref,
  selectedStore,
  onSelect,
}: StorePickerSheetProps) {
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor }}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
        width: 80,
      }}
      index={0}
      name="store-picker"
      ref={ref}
      snapPoints={["50%", "80%"]}
    >
      <Content onSelect={onSelect} selectedStore={selectedStore} />
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

function Content({
  selectedStore,
  onSelect,
}: {
  selectedStore: Store | null;
  onSelect: (store: Store) => void;
}) {
  const { close } = useBottomSheet();
  const { data: stores } = useQuery(trpc.store.list.queryOptions());
  const [search, setSearch] = useState("");
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const insets = useSafeAreaInsets();

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (!search.trim()) return stores;
    return stores.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [stores, search]);

  const exactMatch = useMemo(() => {
    if (!(search.trim() && stores)) return false;
    return stores.some(
      (s) => s.name.toLowerCase() === search.trim().toLowerCase()
    );
  }, [stores, search]);

  const showAddNew = search.trim().length > 0 && !exactMatch;

  const handleSelect = (store: Store) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(store);
    setSearch("");
    close();
  };

  const handleAddNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStore: Store = {
      id: 0,
      name: search.trim(),
      lastSelectedFundId: null,
    };
    onSelect(newStore);
    setSearch("");
    close();
  };

  return (
    <StyledLeanView className="flex-1">
      {/* Search Input */}
      <StyledLeanView className="px-6 py-3">
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
          className="flex-row items-center gap-2 px-6 py-3"
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
        <FadingEdge fadeColor={backgroundColor} {...fadeProps}>
          <FlashList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={filteredStores}
            keyExtractor={(item: Store) => `store-${item.id}`}
            onScroll={handleScroll}
            renderItem={({ item }: { item: Store }) => (
              <StoreRow
                isSelected={selectedStore?.id === item.id}
                onPress={() => handleSelect(item)}
                store={item}
              />
            )}
            renderScrollComponent={BottomSheetScrollable}
            scrollEventThrottle={16}
          />
        </FadingEdge>
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
  store: Store;
  isSelected: boolean;
  onPress: () => void;
};

function StoreRow({ store, isSelected, onPress }: StoreRowProps) {
  return (
    <ScalePressable
      className={cn("px-6 py-3", isSelected ? "bg-mauve-4" : "bg-background")}
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
    </ScalePressable>
  );
}
