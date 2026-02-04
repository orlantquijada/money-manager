import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActionSheetIOS,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
} from "react-native";
import { withSpring } from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";
import {
  CollapsibleActionBarControlled,
  useCollapsibleBarScroll,
} from "@/components/fund/collapsible-action-bar";
import { EditFundSheet } from "@/components/fund/edit-fund-sheet";
import FundInsights from "@/components/fund/fund-insights";
import FundStatsCard from "@/components/fund/fund-stats-card";
import { MoveFolderSheet } from "@/components/fund/move-folder-sheet";
import SpendingPaceWarning from "@/components/fund/spending-pace-warning";
import GlassIconButton from "@/components/glass-icon-button";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useAddExpenseStore } from "@/lib/add-expense";
import { type FundWithMeta, getTimeModeMultiplier } from "@/lib/fund";
import { trpc } from "@/utils/api";
import { toCurrencyNarrow, toShortDate } from "@/utils/format";
import { transitions } from "@/utils/motion";

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const headerHeight = useHeaderHeight();

  const editSheetRef = useRef<BottomSheetModal>(null);
  const moveSheetRef = useRef<BottomSheetModal>(null);

  const { isCollapsed } = useCollapsibleBarScroll();
  const lastScrollY = useRef(0);

  const {
    data: fund,
    isLoading: fundLoading,
    refetch: refetchFund,
  } = useQuery(trpc.fund.retrieve.queryOptions(fundId));

  const {
    data: transactions,
    isLoading: txLoading,
    refetch: refetchTx,
  } = useQuery(trpc.transaction.recentByFund.queryOptions(fundId));

  const { data: topStores = [] } = useQuery(
    trpc.fund.topStores.queryOptions({ fundId, limit: 3 })
  );

  const { data: storeCount = 0 } = useQuery(
    trpc.fund.storeCount.queryOptions(fundId)
  );

  const { data: periodComparison } = useQuery(
    trpc.fund.periodComparison.queryOptions(fundId)
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchFund(), refetchTx()]);
    setIsRefreshing(false);
  }, [refetchFund, refetchTx]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const diff = currentY - lastScrollY.current;

      if (Math.abs(diff) < 5) return;

      if (diff > 0 && currentY > 50) {
        isCollapsed.value = withSpring(1, transitions.soft);
      } else if (diff < 0) {
        isCollapsed.value = withSpring(0, transitions.soft);
      }

      lastScrollY.current = currentY;
    },
    [isCollapsed]
  );

  const markAsPaid = useMutation(
    trpc.transaction.markAsPaid.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
      },
    })
  );

  const archiveMutation = useMutation(
    trpc.fund.update.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.fund.delete.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const handleAddExpense = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useAddExpenseStore.getState().setSelectedFundId(fundId);
    router.navigate("/add-expense");
  }, [fundId, router]);

  const handleMarkAsPaid = useCallback(() => {
    markAsPaid.mutate({ fundId });
  }, [fundId, markAsPaid]);

  const handleEdit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    editSheetRef.current?.present();
  }, []);

  const handleMoveFolder = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    moveSheetRef.current?.present();
  }, []);

  const handleArchive = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Archive Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: "Archive this fund?",
        message: "You can restore it later from settings.",
      },
      (index) => {
        if (index === 1) {
          archiveMutation.mutate({ id: fundId, enabled: false });
        }
      }
    );
  }, [fundId, archiveMutation]);

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: "Delete this fund?",
        message:
          "This action cannot be undone. All transactions will be preserved but unlinked.",
      },
      (index) => {
        if (index === 1) {
          deleteMutation.mutate(fundId);
        }
      }
    );
  }, [fundId, deleteMutation]);

  const isLoading = fundLoading || txLoading;

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
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }
        scrollEventThrottle={48}
        style={{ paddingTop: Platform.OS === "android" ? headerHeight : 0 }}
      >
        {/* Stats Section */}
        <FundStatsCard
          fund={fund as FundWithMeta}
          onMarkAsPaid={handleMarkAsPaid}
        />

        {/* Spending Pace Warning */}
        {fund.fundType === "SPENDING" && (
          <SpendingPaceWarning
            budget={monthlyBudget}
            spent={fund.totalSpent}
            timeMode={fund.timeMode}
          />
        )}

        {/* Insights */}
        <FundInsights
          fundType={fund.fundType}
          periodComparison={periodComparison ?? null}
          storeCount={storeCount}
          topStores={topStores}
        />

        {/* Transactions */}
        <StyledLeanView className="gap-3">
          <StyledLeanView className="flex-row items-center justify-between">
            <StyledLeanText className="font-satoshi-semibold text-base text-foreground-muted">
              Recent Transactions
            </StyledLeanText>
            {transactions && transactions.length > 0 && (
              <Link asChild href={`/funds/${fundId}/transactions`}>
                <ScalePressable hitSlop={10} opacityValue={0.75}>
                  <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
                    See all
                  </StyledLeanText>
                </ScalePressable>
              </Link>
            )}
          </StyledLeanView>

          {(!transactions || transactions.length === 0) && (
            <StyledLeanText className="py-4 text-center text-foreground-muted">
              No transactions yet
            </StyledLeanText>
          )}

          {transactions?.slice(0, 5).map((transaction) => (
            <ScalePressable
              className="rounded-xl bg-card p-4"
              key={transaction.id}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
              style={{ borderCurve: "continuous" }}
            >
              <StyledLeanView className="flex-row items-center justify-between">
                <StyledLeanView className="flex-1">
                  <StyledLeanText
                    className="font-satoshi-medium text-base text-foreground"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {transaction.store?.name || "No store"}
                  </StyledLeanText>
                  {transaction.note && (
                    <StyledLeanText
                      className="mt-0.5 font-satoshi text-foreground-muted text-sm"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {transaction.note}
                    </StyledLeanText>
                  )}
                </StyledLeanView>
                <StyledLeanView className="items-end">
                  <StyledLeanText className="font-nunito-semibold text-base text-foreground">
                    {toCurrencyNarrow(Number(transaction.amount))}
                  </StyledLeanText>
                  <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
                    {transaction.date
                      ? toShortDate(new Date(transaction.date))
                      : ""}
                  </StyledLeanText>
                </StyledLeanView>
              </StyledLeanView>
            </ScalePressable>
          ))}
        </StyledLeanView>
      </ScrollView>

      {/* Collapsible Bottom Action Bar */}
      <CollapsibleActionBarControlled
        isCollapsed={isCollapsed}
        label={actionLabel}
        onPress={handleAddExpense}
      />

      {/* Edit Sheet */}
      <EditFundSheet fund={fund} ref={editSheetRef} />

      {/* Move Folder Sheet */}
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
