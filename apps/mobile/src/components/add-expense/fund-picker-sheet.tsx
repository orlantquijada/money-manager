import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetTextInput,
  useBottomSheet,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { type Ref, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FadingEdge, { useOverflowFadeEdge } from "@/components/fading-edge";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import FolderDuo from "@/icons/folder-duo";
import { fundWithMeta } from "@/lib/fund";
import { useRecentFundsStore } from "@/stores/recent-funds";
import { cn } from "@/utils/cn";
import {
  amber,
  amberDark,
  lime,
  limeDark,
  mauveA,
  red,
  redDark,
} from "@/utils/colors";
import { toCurrencyShort } from "@/utils/format";

type FundWithFolder = {
  id: number;
  name: string;
  folderId: number;
  folderName: string;
  amountLeft: number;
  progress: number;
};

type FundPickerSheetProps = {
  ref: Ref<BottomSheetModal>;
  selectedFundId: number | null;
  onSelect: (fund: FundWithFolder) => void;
};

export function FundPickerSheet({
  ref,
  selectedFundId,
  onSelect,
}: FundPickerSheetProps) {
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
      name="fund-picker"
      ref={ref}
      snapPoints={["50%", "80%"]}
    >
      <Content onSelect={onSelect} selectedFundId={selectedFundId} />
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

type ListItem =
  | { type: "recents-header" }
  | { type: "recent-fund"; fund: FundWithFolder }
  | { type: "folder-header"; folderName: string; folderId: number }
  | { type: "fund"; fund: FundWithFolder };

function Content({
  selectedFundId,
  onSelect,
}: {
  selectedFundId: number | null;
  onSelect: (fund: FundWithFolder) => void;
}) {
  const { close } = useBottomSheet();
  const { data: foldersWithFunds } = useFoldersWithFunds();
  const recentFundIds = useRecentFundsStore((s) => s.recentFundIds);
  const [search, setSearch] = useState("");
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const insets = useSafeAreaInsets();

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  // Transform folders data into flat fund list with budget info
  const allFunds = useMemo(() => {
    if (!foldersWithFunds) return [];
    return foldersWithFunds.flatMap((folder) =>
      folder.funds.map((fund) => {
        const meta = fundWithMeta(fund);
        return {
          id: fund.id,
          name: fund.name,
          folderId: folder.id,
          folderName: folder.name,
          amountLeft: meta.amountLeft,
          progress: meta.progress,
        };
      })
    );
  }, [foldersWithFunds]);

  // Build list items with sections
  const items = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    const filteredFunds = searchLower
      ? allFunds.filter((f) => f.name.toLowerCase().includes(searchLower))
      : allFunds;

    const listItems: ListItem[] = [];

    // Add "Recently Used" section (only when not searching)
    if (!searchLower) {
      const recentFunds = recentFundIds
        .map((id) => allFunds.find((f) => f.id === id))
        .filter((f): f is FundWithFolder => f !== undefined);

      if (recentFunds.length > 0) {
        listItems.push({ type: "recents-header" });
        listItems.push(
          ...recentFunds.map((fund) => ({
            type: "recent-fund" as const,
            fund,
          }))
        );
      }
    }

    // Group filtered funds by folder
    const folderMap = new Map<
      number,
      { name: string; id: number; funds: FundWithFolder[] }
    >();
    for (const fund of filteredFunds) {
      const existing = folderMap.get(fund.folderId);
      if (existing) {
        existing.funds.push(fund);
      } else {
        folderMap.set(fund.folderId, {
          name: fund.folderName,
          id: fund.folderId,
          funds: [fund],
        });
      }
    }

    // Add folder sections
    for (const folder of folderMap.values()) {
      listItems.push({
        type: "folder-header",
        folderName: folder.name,
        folderId: folder.id,
      });
      listItems.push(
        ...folder.funds.map((fund) => ({ type: "fund" as const, fund }))
      );
    }

    return listItems;
  }, [allFunds, search, recentFundIds]);

  const handleSelect = (fund: FundWithFolder) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(fund);
    close();
  };

  const showEmptyState = items.length === 0 && search.trim();

  return (
    <StyledLeanView className="flex-1 bg-background">
      {/* Search Input */}
      <StyledLeanView className="px-6 py-2">
        <BottomSheetTextInput
          autoCapitalize="none"
          autoCorrect={false}
          cursorColor={foregroundColor}
          onChangeText={setSearch}
          placeholder="Search funds..."
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

      {showEmptyState ? (
        <StyledLeanView className="flex-1 items-center justify-center px-6">
          <StyledLeanText
            className="text-center font-satoshi-medium text-foreground-muted"
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            No funds match "{search.trim()}"
          </StyledLeanText>
        </StyledLeanView>
      ) : (
        <FadingEdge
          fadeColor={backgroundColor}
          showStart={false}
          {...fadeProps}
        >
          <FlashList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={items}
            drawDistance={500}
            extraData={selectedFundId}
            getItemType={(item: ListItem) => item.type}
            keyExtractor={(item: ListItem) => {
              switch (item.type) {
                case "recents-header":
                  return "recents-header";
                case "recent-fund":
                  return `recent-${item.fund.id}`;
                case "folder-header":
                  return `folder-${item.folderId}`;
                case "fund":
                  return `fund-${item.fund.id}`;
              }
            }}
            onScroll={handleScroll}
            renderItem={({ item }: { item: ListItem }) => {
              switch (item.type) {
                case "recents-header":
                  return <RecentsHeader />;
                case "recent-fund":
                  return (
                    <FundRow
                      fund={item.fund}
                      isSelected={item.fund.id === selectedFundId}
                      onPress={() => handleSelect(item.fund)}
                    />
                  );
                case "folder-header":
                  return <FolderHeader name={item.folderName} />;
                case "fund":
                  return (
                    <FundRow
                      fund={item.fund}
                      isSelected={item.fund.id === selectedFundId}
                      onPress={() => handleSelect(item.fund)}
                    />
                  );
              }
            }}
            renderScrollComponent={BottomSheetScrollable}
            scrollEventThrottle={16}
          />
        </FadingEdge>
      )}
    </StyledLeanView>
  );
}

function RecentsHeader() {
  const mutedColor = useThemeColor("foreground-muted");

  return (
    <StyledLeanView className="flex-row items-center gap-2 px-6 py-2">
      <IconSymbol color={mutedColor} name="clock.arrow.circlepath" size={14} />
      <StyledLeanText
        className="font-satoshi-medium text-foreground-muted text-sm"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        Recently Used
      </StyledLeanText>
    </StyledLeanView>
  );
}

function FolderHeader({ name }: { name: string }) {
  const iconColor = useThemeColor("foreground-muted");

  return (
    <StyledLeanView className="mt-3 flex-row items-center gap-2 px-6 py-2">
      <FolderDuo color={iconColor} size={16} />
      <StyledLeanText
        className="font-satoshi-medium text-foreground-muted text-sm"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {name}
      </StyledLeanText>
    </StyledLeanView>
  );
}

function getBudgetStatusColor(progress: number, isDark: boolean) {
  if (progress < 0.7) {
    return isDark ? limeDark.lime9 : lime.lime9;
  }
  if (progress < 0.9) {
    return isDark ? amberDark.amber9 : amber.amber9;
  }
  return isDark ? redDark.red9 : red.red9;
}

type FundRowProps = {
  fund: FundWithFolder;
  isSelected: boolean;
  onPress: () => void;
};

function FundRow({ fund, isSelected, onPress }: FundRowProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const statusColor = getBudgetStatusColor(fund.progress, isDark);

  return (
    <ScalePressable
      className={cn(
        "flex-row items-center justify-between px-6 py-3",
        isSelected ? "bg-mauve-4" : "bg-background"
      )}
      onPress={onPress}
      opacityValue={0.7}
      scaleValue={0.98}
    >
      {/* Fund name on left */}
      <StyledLeanText
        className="mr-3 flex-1 font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {fund.name}
      </StyledLeanText>

      {/* Budget info on right */}
      <StyledLeanView className="flex-row items-center gap-2">
        {/* Mini progress bar */}
        <StyledLeanView className="h-2 w-10 overflow-hidden rounded-full border border-mauve-6 bg-mauve-5">
          <StyledLeanView
            className="h-full rounded-full"
            style={{
              width: `${Math.min(fund.progress * 100, 100)}%`,
              backgroundColor: statusColor,
            }}
          />
        </StyledLeanView>

        <StyledLeanText
          className="font-nunito-bold text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ color: statusColor }}
        >
          {toCurrencyShort(fund.amountLeft)}
        </StyledLeanText>
      </StyledLeanView>
    </ScalePressable>
  );
}
