import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useRef } from "react";
import { Platform, RefreshControl, ScrollView } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  CollapsibleActionBarControlled,
  useCollapsibleBarScroll,
} from "@/components/fund/collapsible-action-bar";
import { EditFundSheet } from "@/components/fund/edit-fund-sheet";
import FundInsights from "@/components/fund/fund-insights";
import FundStatsCard from "@/components/fund/fund-stats-card";
import { MoveFolderSheet } from "@/components/fund/move-folder-sheet";
import { RecentTransactions } from "@/components/fund/recent-transactions";
import SpendingPaceWarning from "@/components/fund/spending-pace-warning";
import GlassIconButton from "@/components/glass-icon-button";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFundActions } from "@/hooks/use-fund-actions";
import { useFundDetailQueries } from "@/hooks/use-fund-detail-queries";
import { type FundWithMeta, getTimeModeMultiplier } from "@/lib/fund";

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const headerHeight = useHeaderHeight();

  const editSheetRef = useRef<BottomSheetModal>(null);
  const moveSheetRef = useRef<BottomSheetModal>(null);

  const { isCollapsed, onScroll } = useCollapsibleBarScroll();
  const {
    fund,
    transactions,
    topStores,
    storeCount,
    periodComparison,
    isLoading,
    isRefreshing,
    handleRefresh,
  } = useFundDetailQueries(fundId);
  const { handleAddExpense, handleMarkAsPaid, handleArchive, handleDelete } =
    useFundActions(fundId);

  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    editSheetRef.current?.present();
  }, []);

  const handleMoveFolder = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    moveSheetRef.current?.present();
  }, []);

  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Loading...
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  if (!fund) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Fund not found
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  const monthlyBudget =
    fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode);
  const isEventually = fund.timeMode === "EVENTUALLY";
  const actionLabel = isEventually ? "Add to Goal" : "Add Expense";

  return (
    <>
      <Stack.Screen
        options={{
          title: fund.name,
          headerRight: () => (
            <HeaderMenu
              onArchive={handleArchive}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onMoveFolder={handleMoveFolder}
            />
          ),
        }}
      />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-6 pb-32 px-4"
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }
        scrollEventThrottle={48}
        style={{ paddingTop: Platform.OS === "android" ? headerHeight : 0 }}
      >
        <FundStatsCard
          fund={fund as FundWithMeta}
          onMarkAsPaid={handleMarkAsPaid}
        />

        {fund.fundType === "SPENDING" && (
          <SpendingPaceWarning
            budget={monthlyBudget}
            spent={fund.totalSpent}
            timeMode={fund.timeMode}
          />
        )}

        <FundInsights
          fundType={fund.fundType}
          periodComparison={periodComparison ?? null}
          storeCount={storeCount}
          topStores={topStores}
        />

        <RecentTransactions fundId={fundId} transactions={transactions ?? []} />
      </ScrollView>

      <CollapsibleActionBarControlled
        isCollapsed={isCollapsed}
        label={actionLabel}
        onPress={handleAddExpense}
      />

      <EditFundSheet fund={fund} ref={editSheetRef} />

      <MoveFolderSheet
        currentFolderId={fund.folderId}
        fundId={fundId}
        ref={moveSheetRef}
      />
    </>
  );
}

type HeaderMenuProps = {
  onEdit: () => void;
  onMoveFolder: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

function HeaderMenu({
  onEdit,
  onMoveFolder,
  onArchive,
  onDelete,
}: HeaderMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <GlassIconButton icon="ellipsis" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item key="edit" onSelect={onEdit}>
          <DropdownMenu.ItemTitle>Edit Fund</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "pencil" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="move" onSelect={onMoveFolder}>
          <DropdownMenu.ItemTitle>Move to Folder</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "folder" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item key="archive" onSelect={onArchive}>
          <DropdownMenu.ItemTitle>Archive Fund</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "archivebox" }} />
        </DropdownMenu.Item>
        <DropdownMenu.Item destructive key="delete" onSelect={onDelete}>
          <DropdownMenu.ItemTitle>Delete Fund</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
