import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { ScrollView, Text } from "react-native";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import Budget from "@/components/budgets/budget";
import { GlassIconButton } from "@/components/glass-button";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFabHeight } from "@/hooks/use-fab-height";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";

function useOpenStates() {
  const statesRef = useRef<Map<number, SharedValue<boolean>>>(new Map());

  const getOpenState = useCallback((id: number): SharedValue<boolean> => {
    const existing = statesRef.current.get(id);
    if (existing) return existing;

    // makeMutable creates a real SharedValue outside of hooks
    const sharedValue = makeMutable(true);
    statesRef.current.set(id, sharedValue);

    return sharedValue;
  }, []);

  const collapseAll = useCallback(() => {
    for (const state of statesRef.current.values()) {
      state.value = false;
    }
  }, []);

  return { getOpenState, collapseAll };
}

export default function BudgetsScreen() {
  const { data: foldersWithFunds, isLoading } = useFoldersWithFunds();
  const { getOpenState, collapseAll } = useOpenStates();
  const fabHeight = useFabHeight();
  const createSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <DashboardCreateBottomSheet ref={createSheetRef} />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-3 pt-4 min-h-full"
        contentContainerStyle={{ paddingBottom: fabHeight + 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <StyledLeanView className="w-full flex-row items-center justify-end gap-1.5">
          {foldersWithFunds && foldersWithFunds.length > 0 && (
            <ScalePressable
              className="rounded-lg px-3 py-1.5"
              onPress={collapseAll}
              scaleValue={0.95}
            >
              <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
                Collapse all
              </StyledLeanText>
            </ScalePressable>
          )}

          <GlassIconButton
            icon="plus"
            onPress={() => {
              createSheetRef.current?.present();
            }}
            size="sm"
          />
        </StyledLeanView>

        {foldersWithFunds?.map((folder) => (
          <Budget
            folderId={folder.id}
            folderName={folder.name}
            funds={folder.funds}
            key={folder.id}
            open={getOpenState(folder.id)}
          />
        ))}

        {!isLoading && foldersWithFunds?.length === 0 && (
          <Text className="text-center text-mauveDark3">
            No folders yet. Create a fund to get started!
          </Text>
        )}
      </ScrollView>
    </>
  );
}
