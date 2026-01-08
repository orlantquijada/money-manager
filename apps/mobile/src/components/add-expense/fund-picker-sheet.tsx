import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheet,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import type { Ref } from "react";
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
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { mauveA } from "@/utils/colors";

type FundWithFolder = {
  id: number;
  name: string;
  folderId: number;
  folderName: string;
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
  | { type: "header"; folderName: string; folderId: number }
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
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor("background");

  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  // Build flat list with section headers
  const items: ListItem[] = (foldersWithFunds ?? []).flatMap((folder) => [
    { type: "header" as const, folderName: folder.name, folderId: folder.id },
    ...folder.funds.map((fund) => ({
      type: "fund" as const,
      fund: {
        id: fund.id,
        name: fund.name,
        folderId: folder.id,
        folderName: folder.name,
      },
    })),
  ]);

  const handleSelect = (fund: FundWithFolder) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(fund);
    close();
  };

  return (
    <StyledLeanView className="flex-1 bg-background">
      <StyledLeanText className="mb-4 px-6 font-satoshi-bold text-foreground text-xl">
        Select Fund
      </StyledLeanText>

      <FadingEdge fadeColor={backgroundColor} showStart={false} {...fadeProps}>
        <FlashList
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          data={items}
          getItemType={(item: ListItem) => item.type}
          keyExtractor={(item: ListItem) =>
            item.type === "header"
              ? `header-${item.folderId}`
              : `fund-${item.fund.id}`
          }
          onScroll={handleScroll}
          renderItem={({ item }: { item: ListItem }) =>
            item.type === "header" ? (
              <FolderHeader name={item.folderName} />
            ) : (
              <FundRow
                fund={item.fund}
                isSelected={item.fund.id === selectedFundId}
                onPress={() => handleSelect(item.fund)}
              />
            )
          }
          renderScrollComponent={BottomSheetScrollable}
          scrollEventThrottle={16}
        />
      </FadingEdge>
    </StyledLeanView>
  );
}

function FolderHeader({ name }: { name: string }) {
  const iconColor = useThemeColor("foreground-muted");

  return (
    <StyledBottomSheetView className="flex-row items-center gap-2 bg-muted px-6 py-2">
      <IconSymbol color={iconColor} name="folder" size={14} />
      <StyledLeanText
        className="font-satoshi-medium text-foreground-muted text-sm"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {name}
      </StyledLeanText>
    </StyledBottomSheetView>
  );
}

type FundRowProps = {
  fund: FundWithFolder;
  isSelected: boolean;
  onPress: () => void;
};

function FundRow({ fund, isSelected, onPress }: FundRowProps) {
  const selectedColor = useThemeColor("primary");
  const foregroundColor = useThemeColor("foreground");

  return (
    <ScalePressable
      className="flex-row items-center justify-between border-mauve-7 border-b-hairline bg-background px-6 py-3"
      onPress={onPress}
      opacityValue={0.7}
      scaleValue={0.98}
    >
      <StyledLeanText
        className="font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {fund.name}
      </StyledLeanText>
      {isSelected && (
        <IconSymbol
          color={selectedColor ?? foregroundColor}
          name="checkmark"
          size={18}
        />
      )}
    </ScalePressable>
  );
}
