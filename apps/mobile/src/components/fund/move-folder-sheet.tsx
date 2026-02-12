import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import type { Ref } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol.ios";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";

type Props = {
  ref: Ref<BottomSheetModal>;
  fundId: number;
  currentFolderId: number;
  onSuccess?: () => void;
};

export function MoveFolderSheet({
  ref,
  fundId,
  currentFolderId,
  onSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor }}
      enableDynamicSizing
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
        width: 80,
      }}
      ref={ref}
      topInset={insets.top}
    >
      <Content
        currentFolderId={currentFolderId}
        fundId={fundId}
        onSuccess={onSuccess}
      />
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
  fundId: number;
  currentFolderId: number;
  onSuccess?: () => void;
};

function Content({ fundId, currentFolderId, onSuccess }: ContentProps) {
  const insets = useSafeAreaInsets();
  const { close } = useBottomSheet();
  const queryClient = useQueryClient();
  const primaryColor = useThemeColor("primary");

  const { data: folders } = useQuery(trpc.folder.list.queryOptions());

  const moveMutation = useMutation(
    trpc.fund.update.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries({ queryKey: ["fund"] });
        queryClient.invalidateQueries({ queryKey: ["folder"] });
        onSuccess?.();
        close();
      },
    })
  );

  const handleSelect = (folderId: number) => {
    if (folderId === currentFolderId) {
      close();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    moveMutation.mutate({ id: fundId, folderId });
  };

  return (
    <StyledLeanView className="bg-background">
      <StyledLeanView className="px-6 pb-4">
        <StyledLeanText className="font-satoshi-bold text-foreground text-xl">
          Move to Folder
        </StyledLeanText>
      </StyledLeanView>

      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {folders?.map((folder) => {
          const isSelected = folder.id === currentFolderId;
          return (
            <ScalePressable
              className={cn(
                "flex-row items-center justify-between px-6 py-4",
                isSelected && "bg-mauve-3"
              )}
              key={folder.id}
              onPress={() => handleSelect(folder.id)}
              opacityValue={0.7}
              scaleValue={0.98}
            >
              <StyledLeanText
                className={cn(
                  "font-satoshi-medium text-base",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {folder.name}
              </StyledLeanText>
              {isSelected && (
                <IconSymbol color={primaryColor} name="checkmark" size={20} />
              )}
            </ScalePressable>
          );
        })}
      </BottomSheetScrollView>
    </StyledLeanView>
  );
}
