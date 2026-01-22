import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { TextInput } from "react-native";

import { Amount, useAmount } from "@/components/add-expense/amount";
import { FundPickerSheet } from "@/components/add-expense/fund-picker-sheet";
import { MetadataRow } from "@/components/add-expense/metadata-row";
import Numpad from "@/components/add-expense/numpad";
import { SaveButton } from "@/components/add-expense/save-button";
import { StorePickerSheet } from "@/components/add-expense/store-picker-sheet";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { DateSelector } from "@/components/date-selector";
import { GlassCloseButton } from "@/components/glass-button";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanView, StyledSafeAreaView } from "@/config/interop";
import { useSubmitTransaction } from "@/hooks/use-create-transaction";
import { useFoldersWithFunds } from "@/hooks/use-folders-with-funds";
import { useAddExpenseStore } from "@/lib/add-expense";
import { cn } from "@/utils/cn";

export default function AddExpense() {
  const router = useRouter();
  const mutedForegroundColor = useThemeColor("foreground-muted");
  const foregroundColor = useThemeColor("foreground");

  // Bottom sheet refs
  const fundSheetRef = useRef<BottomSheetModal>(null);
  const storeSheetRef = useRef<BottomSheetModal>(null);

  // Amount state (kept separate as specified)
  const { amount, handleKeyPress, reset: resetAmount } = useAmount();

  // Store state via Zustand
  const date = useAddExpenseStore((s) => s.date);
  const setDate = useAddExpenseStore((s) => s.setDate);
  const selectedFundId = useAddExpenseStore((s) => s.selectedFundId);
  const selectedStore = useAddExpenseStore((s) => s.selectedStore);
  const note = useAddExpenseStore((s) => s.note);
  const setNote = useAddExpenseStore((s) => s.setNote);

  // Transaction mutation
  const { submit, isPending, canSubmit } = useSubmitTransaction(
    amount,
    resetAmount
  );

  // Data fetching for fund display
  const { data: foldersWithFunds } = useFoldersWithFunds();
  const selectedFund = useMemo(() => {
    if (!(foldersWithFunds && selectedFundId)) return null;
    for (const folder of foldersWithFunds) {
      const fund = folder.funds.find((f) => f.id === selectedFundId);
      if (fund) return { ...fund, folderName: folder.name };
    }
    return null;
  }, [foldersWithFunds, selectedFundId]);

  // Handlers
  const handleCancel = useCallback(() => {
    router.navigate("/(app)/(tabs)/(main)/(dashboard)");
  }, [router]);

  const openFundPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fundSheetRef.current?.present();
  }, []);

  const openStorePicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    storeSheetRef.current?.present();
  }, []);

  return (
    <AnimatedTabScreen index={0}>
      <StyledSafeAreaView className="flex-1 bg-background py-4">
        <Header date={date} onCancel={handleCancel} onDateChange={setDate} />

        <StyledLeanView className="flex-1 px-4">
          {/* Amount Display */}
          <StyledLeanView className="grow items-center justify-center">
            <Amount amount={amount} />
          </StyledLeanView>

          {/* Metadata Section */}
          <StyledLeanView className="mb-10">
            <StyledLeanView className="flex-row items-center justify-between gap-3">
              {/* Row 1: Store + Fund */}
              <MetadataRow
                segments={[
                  {
                    label: selectedFund?.name || "Fund",
                    onPress: openFundPicker,
                    hasValue: !!selectedFund,
                  },
                  {
                    label: selectedStore?.name || "Store",
                    onPress: openStorePicker,
                    hasValue: !!selectedStore,
                  },
                ]}
              />
              {/* Save Button */}
              <SaveButton
                disabled={!canSubmit}
                loading={isPending}
                onPress={submit}
              />
            </StyledLeanView>

            {/* Row 2: Note */}
            <TextInput
              className="h-10 px-1 font-satoshi-medium text-base text-foreground-secondary"
              cursorColor={foregroundColor}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={mutedForegroundColor}
              selectionColor={foregroundColor}
              style={{ lineHeight: undefined }}
              value={note}
            />
          </StyledLeanView>

          <Numpad onPress={handleKeyPress} />
        </StyledLeanView>
      </StyledSafeAreaView>

      {/* Bottom Sheets */}
      <FundPickerSheet ref={fundSheetRef} />
      <StorePickerSheet ref={storeSheetRef} />
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
        "w-full flex-row items-center justify-between px-4",
        className
      )}
    >
      <GlassCloseButton onPress={onCancel} />
      <DateSelector date={date} onDateChange={onDateChange} />
    </StyledLeanView>
  );
}
