import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { FundWithFolderAndBudget } from "api";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import ClockRewind from "@/icons/clock-rewind";
import FolderDuo from "@/icons/folder-duo";
import { useAddExpenseStore } from "@/lib/add-expense";
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
import { exists } from "@/utils/fn";
import { toCurrencyShort } from "@/utils/format";
import FadingEdge, { useOverflowFadeEdge } from "../fading-edge";

type FundPickerSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ListItem =
  | { type: "recents-header" }
  | { type: "recent-fund"; fund: FundWithFolderAndBudget }
  | { type: "folder-header"; folderName: string; folderId: number }
  | { type: "fund"; fund: FundWithFolderAndBudget };

// Helper: Transform folders data into flat fund list with budget info
function transformFoldersToFunds(
  foldersWithFunds: ReturnType<typeof useFoldersWithFunds>["data"]
): FundWithFolderAndBudget[] {
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
}

// Helper: Group funds by folder
function groupFundsByFolder(funds: FundWithFolderAndBudget[]) {
  const folderMap = new Map<
    number,
    { name: string; id: number; funds: FundWithFolderAndBudget[] }
  >();
  for (const fund of funds) {
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
  return folderMap;
}

// Helper: Build list items from funds (with optional recents section)
function buildListItems(
  funds: FundWithFolderAndBudget[],
  recentFunds?: FundWithFolderAndBudget[]
): ListItem[] {
  const listItems: ListItem[] = [];

  // Add "Recently Used" section if provided
  if (recentFunds && recentFunds.length > 0) {
    listItems.push({ type: "recents-header" });
    listItems.push(
      ...recentFunds.map((fund) => ({
        type: "recent-fund" as const,
        fund,
      }))
    );
  }

  // Group funds by folder and add sections
  const folderMap = groupFundsByFolder(funds);
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
}

export function FundPickerSheet({ isOpen, onClose }: FundPickerSheetProps) {
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");
  const iconColor = useThemeColor("foreground-muted");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Pre-compute data BEFORE sheet opens (this runs in the parent, not during animation)
  const { data: foldersWithFunds } = useFoldersWithFunds();
  const recentFundIds = useRecentFundsStore((s) => s.recentFundIds);

  const allFunds = useMemo(
    () => transformFoldersToFunds(foldersWithFunds),
    [foldersWithFunds]
  );

  // Pre-compute initial items (when search is empty) before sheet opens
  const initialItems = useMemo(() => {
    const recentFunds = recentFundIds
      .map((id) => allFunds.find((f) => f.id === id))
      .filter(exists);

    return buildListItems(allFunds, recentFunds);
  }, [allFunds, recentFundIds]);

  // Handle sheet index change (detect close gesture)
  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheet
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor }}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
        width: 80,
      }}
      index={isOpen ? 0 : -1}
      onChange={handleSheetChange}
      snapPoints={["50%", "80%"]}
    >
      <Content
        allFunds={allFunds}
        iconColor={iconColor}
        initialItems={initialItems}
        isDark={isDark}
        onClose={onClose}
      />
    </BottomSheet>
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
  allFunds: FundWithFolderAndBudget[];
  initialItems: ListItem[];
  isDark: boolean;
  iconColor: string;
  onClose: () => void;
};

function Content({
  allFunds,
  initialItems,
  isDark,
  iconColor,
  onClose,
}: ContentProps) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();

  // Get state from store
  const selectedFundId = useAddExpenseStore((s) => s.selectedFundId);
  const setSelectedFundId = useAddExpenseStore((s) => s.setSelectedFundId);

  const { fadeProps, handleScroll } = useOverflowFadeEdge();
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");

  // Use pre-computed items when not searching, only compute when filtering
  const items = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    // When not searching, use pre-computed initial items
    if (!searchLower) {
      return initialItems;
    }

    // Only compute filtered items when actually searching
    const filteredFunds = allFunds.filter((f) =>
      f.name.toLowerCase().includes(searchLower)
    );

    // No recents section when searching
    return buildListItems(filteredFunds);
  }, [search, initialItems, allFunds]);

  const handleSelect = (fund: FundWithFolderAndBudget) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFundId(fund.id);
    onClose();
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
        <FadingEdge fadeColor={backgroundColor} {...fadeProps}>
          <BottomSheetScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {items.map((item) => {
              switch (item.type) {
                case "recents-header":
                  return (
                    <RecentsHeader iconColor={iconColor} key="recents-header" />
                  );
                case "recent-fund":
                  return (
                    <FundRow
                      fund={item.fund}
                      isDark={isDark}
                      isSelected={item.fund.id === selectedFundId}
                      key={`recent-${item.fund.id}`}
                      onSelect={handleSelect}
                    />
                  );
                case "folder-header":
                  return (
                    <FolderHeader
                      iconColor={iconColor}
                      key={`folder-${item.folderId}`}
                      name={item.folderName}
                    />
                  );
                case "fund":
                  return (
                    <FundRow
                      fund={item.fund}
                      isDark={isDark}
                      isSelected={item.fund.id === selectedFundId}
                      key={`fund-${item.fund.id}`}
                      onSelect={handleSelect}
                    />
                  );
                default:
                  return null;
              }
            })}
          </BottomSheetScrollView>
        </FadingEdge>
      )}
    </StyledLeanView>
  );
}

function RecentsHeader({ iconColor }: { iconColor: string }) {
  return (
    <StyledLeanView className="flex-row items-center gap-2 px-6 py-2">
      <ClockRewind color={iconColor} size={16} />
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

function FolderHeader({
  name,
  iconColor,
}: {
  name: string;
  iconColor: string;
}) {
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
  fund: FundWithFolderAndBudget;
  isDark: boolean;
  isSelected: boolean;
  onSelect: (fund: FundWithFolderAndBudget) => void;
};

function FundRow({ fund, isDark, isSelected, onSelect }: FundRowProps) {
  const statusColor = getBudgetStatusColor(fund.progress, isDark);

  const handlePress = () => {
    onSelect(fund);
  };

  return (
    <ScalePressable
      className={cn(
        "flex-row items-center justify-between px-6 py-3",
        isSelected ? "bg-mauve-4" : "bg-background"
      )}
      onPress={handlePress}
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
