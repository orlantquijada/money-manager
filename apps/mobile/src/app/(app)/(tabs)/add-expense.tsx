import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import { Amount, useAmount } from "@/components/add-expense/amount";
import { FundPickerSheet } from "@/components/add-expense/fund-picker-sheet";
import { MetadataRow } from "@/components/add-expense/metadata-row";
import Numpad from "@/components/add-expense/numpad";
import { SaveButton } from "@/components/add-expense/save-button";
import { StorePickerSheet } from "@/components/add-expense/store-picker-sheet";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { DateSelector } from "@/components/date-selector.ios";
import { GlassCloseButton } from "@/components/glass-button";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanView, StyledSafeAreaView } from "@/config/interop";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { useRecentFundsStore } from "@/stores/recent-funds";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";

type FundWithFolder = {
  id: number;
  name: string;
  folderId: number;
  folderName: string;
};

type Store = {
  id: number;
  name: string;
  lastSelectedFundId: number | null;
};

export default function AddExpense() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addRecentFund = useRecentFundsStore((s) => s.addRecentFund);
  const mutedForegroundColor = useThemeColor("foreground-muted");
  const foregroundColor = useThemeColor("foreground");

  // Bottom sheet refs
  const fundPickerRef = useRef<BottomSheetModal>(null);
  const storePickerRef = useRef<BottomSheetModal>(null);

  // Form state
  const [date, setDate] = useState(new Date());
  const { amount, handleKeyPress } = useAmount();
  const [selectedFundId, setSelectedFundId] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [note, setNote] = useState("");

  // Data fetching
  const { data: foldersWithFunds } = useFoldersWithFunds();

  // Flatten funds with folder info
  const allFunds = useMemo(() => {
    if (!foldersWithFunds) return [];
    return foldersWithFunds.flatMap((folder) =>
      folder.funds.map((fund) => ({
        ...fund,
        folderName: folder.name,
        folderId: folder.id,
      }))
    );
  }, [foldersWithFunds]);

  const selectedFund = useMemo(
    () => allFunds.find((f) => f.id === selectedFundId) ?? null,
    [allFunds, selectedFundId]
  );

  // Transaction mutation
  const createTransaction = useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: (_data, variables) => {
        addRecentFund(variables.fundId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.replace({ pathname: "/(app)/(tabs)/(dashboard)" });
      },
    })
  );

  const canSubmit = selectedFundId !== null && amount > 0;

  // Handlers
  const handleCancel = useCallback(() => {
    router.navigate("/(app)/(tabs)/(dashboard)");
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    createTransaction.mutate({
      fundId: selectedFundId,
      amount,
      date: date.toISOString(),
      note: note.trim() || undefined,
      store: selectedStore?.name ?? "",
    });
  }, [
    canSubmit,
    selectedFundId,
    selectedStore,
    amount,
    date,
    note,
    createTransaction,
  ]);

  const handleFundSelect = useCallback((fund: FundWithFolder) => {
    setSelectedFundId(fund.id);
  }, []);

  const handleStoreSelect = useCallback(
    (store: Store) => {
      setSelectedStore(store);
      // Smart default: pre-fill fund if store has one and no fund is selected
      if (store.lastSelectedFundId && !selectedFundId) {
        setSelectedFundId(store.lastSelectedFundId);
      }
    },
    [selectedFundId]
  );

  const openFundPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fundPickerRef.current?.present();
  }, []);

  const openStorePicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    storePickerRef.current?.present();
  }, []);

  return (
    <AnimatedTabScreen index={0}>
      <StyledSafeAreaView className="flex-1 bg-background">
        <StyledLeanView className="flex-1 px-4">
          <Header
            className="mt-4"
            date={date}
            onCancel={handleCancel}
            onDateChange={setDate}
          />

          {/* Amount Display */}
          <StyledLeanView className="grow items-center justify-center">
            <Amount amount={amount} />
          </StyledLeanView>

          {/* Metadata Section */}
          <StyledLeanView className="mb-6">
            {/* Row 1: Store + Fund */}
            <MetadataRow
              segments={[
                {
                  label: selectedStore?.name || "Store",
                  onPress: openStorePicker,
                  hasValue: !!selectedStore,
                },
                {
                  label: selectedFund?.name || "Fund",
                  onPress: openFundPicker,
                  hasValue: !!selectedFund,
                },
              ]}
              showBorder
            />

            {/* Row 2: Note */}
            <TextInput
              className="h-10 px-1 font-satoshi-medium text-base"
              cursorColor={foregroundColor}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={mutedForegroundColor}
              selectionColor={foregroundColor}
              style={{
                color: foregroundColor,
                padding: 0,
                lineHeight: undefined,
              }}
              value={note}
            />
          </StyledLeanView>

          <Numpad className="-mx-4 mb-6 px-4" onPress={handleKeyPress} />

          {/* Save Button */}
          <SaveButton
            className="my-4"
            disabled={!canSubmit}
            loading={createTransaction.isPending}
            onPress={handleSubmit}
          />
        </StyledLeanView>
      </StyledSafeAreaView>

      {/* Bottom Sheets */}
      <FundPickerSheet
        onSelect={handleFundSelect}
        ref={fundPickerRef}
        selectedFundId={selectedFundId}
      />
      <StorePickerSheet
        onSelect={handleStoreSelect}
        ref={storePickerRef}
        selectedStore={selectedStore}
      />
    </AnimatedTabScreen>
  );
}

type HeaderProps = {
  className?: string;
  date: Date;
  onDateChange: (date: Date) => void;
  onCancel: () => void;
};

function Header({ className, date, onDateChange, onCancel }: HeaderProps) {
  return (
    <StyledLeanView
      className={cn(
        "h-10 w-full flex-row items-center justify-between",
        className
      )}
    >
      <DateSelector date={date} onDateChange={onDateChange} />
      <GlassCloseButton onPress={onCancel} />
    </StyledLeanView>
  );
}
