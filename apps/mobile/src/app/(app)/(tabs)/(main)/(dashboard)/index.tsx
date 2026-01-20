import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { ScrollView, Text } from "react-native";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import Budget from "@/components/budgets/budget";
import { GlassIconButton } from "@/components/glass-button";
import { StyledLeanView } from "@/config/interop";
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

  const expandAll = useCallback(() => {
    for (const state of statesRef.current.values()) {
      state.value = true;
    }
  }, []);

  return { getOpenState, collapseAll, expandAll };
}

export default function BudgetsScreen() {
  const { data: foldersWithFunds, isLoading } = useFoldersWithFunds();
  const { getOpenState, collapseAll, expandAll } = useOpenStates();
  const fabHeight = useFabHeight();
  const createSheetRef = useRef<BottomSheetModal>(null);

  const hasFolders = foldersWithFunds && foldersWithFunds.length > 0;

  return (
    <>
      <DashboardCreateBottomSheet ref={createSheetRef} />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pt-4 min-h-full"
        contentContainerStyle={{ paddingBottom: fabHeight + 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <StyledLeanView className="w-full flex-row items-center justify-end">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <GlassIconButton icon="ellipsis" size="sm" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {hasFolders && (
                <>
                  <DropdownMenu.Item key="collapse-all" onSelect={collapseAll}>
                    <DropdownMenu.ItemTitle>
                      Collapse all
                    </DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{ name: "chevron.up" }} />
                  </DropdownMenu.Item>
                  <DropdownMenu.Item key="expand-all" onSelect={expandAll}>
                    <DropdownMenu.ItemTitle>Expand all</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon ios={{ name: "chevron.down" }} />
                  </DropdownMenu.Item>
                </>
              )}
              <DropdownMenu.Item
                key="new-fund"
                onSelect={() => createSheetRef.current?.present()}
              >
                <DropdownMenu.ItemTitle>New Fund</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{ name: "plus" }} />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </StyledLeanView>

        <StyledLeanView className="gap-6">
          {foldersWithFunds?.map((folder) => (
            <Budget
              folderId={folder.id}
              folderName={folder.name}
              funds={folder.funds}
              key={folder.id}
              open={getOpenState(folder.id)}
            />
          ))}
        </StyledLeanView>

        {!isLoading && foldersWithFunds?.length === 0 && (
          <Text className="text-center text-mauveDark3">
            No folders yet. Create a fund to get started!
          </Text>
        )}
      </ScrollView>
    </>
  );
}
