import { useUser } from "@clerk/clerk-expo";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useRef } from "react";
import { Image, ScrollView } from "react-native";
import { makeMutable, type SharedValue } from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import Budget from "@/components/budgets/budget";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassIconButton from "@/components/glass-icon-button";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { useFabHeight } from "@/hooks/use-fab-height";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import FolderDuo from "@/icons/folder-duo";

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

function ProfileButton() {
  const { user } = useUser();

  return (
    <StyledGlassButton
      onPress={() => router.push("/settings")}
      size="md"
      tintColorClassName="accent-muted"
      variant="icon"
    >
      {user?.imageUrl ? (
        <Image
          className="size-8 rounded-full"
          source={{ uri: user.imageUrl }}
        />
      ) : (
        <StyledIconSymbol
          colorClassName="accent-muted-foreground"
          name="person.circle.fill"
          size={24}
        />
      )}
    </StyledGlassButton>
  );
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
        <StyledLeanView className="mb-4 w-full flex-row items-start justify-between py-2">
          <TotalSpent />
          <ProfileButton />
        </StyledLeanView>

        <StyledLeanView className="w-full flex-row items-center justify-end">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <GlassIconButton
                hitSlop={10}
                icon="ellipsis"
                opacityValue={0.7}
                scaleValue={0.9}
                size="sm"
              />
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
          <StyledLeanView className="flex-1 items-center justify-center px-8 py-16">
            <FolderDuo className="text-foreground-muted" size={48} />

            <StyledLeanText className="mt-4 font-satoshi-medium text-foreground">
              No funds yet
            </StyledLeanText>

            <StyledLeanText className="mt-2 text-center font-satoshi text-foreground-muted">
              Create a fund to start budgeting
            </StyledLeanText>

            <StyledGlassButton
              className="mt-6"
              intent="primary"
              onPress={() => createSheetRef.current?.present()}
              size="md"
              tintColorClassName="accent-foreground"
            >
              <StyledLeanText className="font-satoshi-medium text-background">
                Create Fund
              </StyledLeanText>
            </StyledGlassButton>
          </StyledLeanView>
        )}
      </ScrollView>
    </>
  );
}
