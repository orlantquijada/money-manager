import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FundType, TimeMode } from "api";
import * as Haptics from "expo-haptics";
import { type Ref, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";
import { mauveA } from "@/utils/colors";

type Fund = {
  id: number;
  name: string;
  budgetedAmount: number;
  timeMode: TimeMode;
  fundType: FundType;
  dueDay: number | null;
};

type Props = {
  ref: Ref<BottomSheetModal>;
  fund: Fund | null;
  onSuccess?: () => void;
};

const TIME_MODE_OPTIONS: { value: TimeMode; label: string }[] = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "BIMONTHLY", label: "Bimonthly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "EVENTUALLY", label: "Eventually (Goal)" },
];

const DUE_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

export function EditFundSheet({ ref, fund, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const backgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor }}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
        width: 80,
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      ref={ref}
      snapPoints={["70%"]}
      topInset={insets.top}
    >
      {fund && <Content fund={fund} onSuccess={onSuccess} />}
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

function Content({ fund, onSuccess }: { fund: Fund; onSuccess?: () => void }) {
  const insets = useSafeAreaInsets();
  const { close } = useBottomSheet();
  const queryClient = useQueryClient();

  const [name, setName] = useState(fund.name);
  const [amount, setAmount] = useState(fund.budgetedAmount.toString());
  const [timeMode, setTimeMode] = useState<TimeMode>(fund.timeMode);
  const [dueDay, setDueDay] = useState<number | null>(fund.dueDay);

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");

  useEffect(() => {
    setName(fund.name);
    setAmount(fund.budgetedAmount.toString());
    setTimeMode(fund.timeMode);
    setDueDay(fund.dueDay);
  }, [fund]);

  const updateMutation = useMutation(
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

  const handleSave = () => {
    const parsedAmount = Number.parseFloat(amount) || 0;
    updateMutation.mutate({
      id: fund.id,
      name: name.trim(),
      budgetedAmount: parsedAmount,
      timeMode,
      dueDay: fund.fundType === "NON_NEGOTIABLE" ? dueDay : null,
    });
  };

  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";

  return (
    <StyledLeanView className="flex-1 bg-background">
      <StyledLeanView className="px-6 pb-4">
        <StyledLeanText className="font-satoshi-bold text-foreground text-xl">
          Edit Fund
        </StyledLeanText>
      </StyledLeanView>

      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <StyledLeanView className="gap-6 px-6">
          <StyledLeanView className="gap-2">
            <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
              Name
            </StyledLeanText>
            <BottomSheetTextInput
              autoCapitalize="words"
              cursorColor={foregroundColor}
              onChangeText={setName}
              placeholder="Fund name"
              placeholderTextColor={mutedColor}
              selectionColor={foregroundColor}
              style={{
                fontFamily: "Satoshi-Medium",
                fontSize: 16,
                color: foregroundColor,
                backgroundColor: "transparent",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: mutedColor,
              }}
              value={name}
            />
          </StyledLeanView>

          <StyledLeanView className="gap-2">
            <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
              Budget Amount
            </StyledLeanText>
            <StyledLeanView
              className="flex-row items-center rounded-xl border border-foreground-muted px-4"
              style={{ borderCurve: "continuous" }}
            >
              <StyledLeanText className="font-azeret-mono-regular text-foreground">
                ₱
              </StyledLeanText>
              <BottomSheetTextInput
                cursorColor={foregroundColor}
                keyboardType="decimal-pad"
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={mutedColor}
                selectionColor={foregroundColor}
                style={{
                  flex: 1,
                  fontFamily: "AzeretMono-Regular",
                  fontSize: 16,
                  color: foregroundColor,
                  paddingVertical: 12,
                  paddingLeft: 8,
                }}
                value={amount}
              />
            </StyledLeanView>
          </StyledLeanView>

          <StyledLeanView className="gap-2">
            <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
              Budget Period
            </StyledLeanText>
            <StyledLeanView className="flex-row flex-wrap gap-2">
              {TIME_MODE_OPTIONS.map((option) => (
                <ScalePressable
                  className={cn(
                    "rounded-xl px-4 py-2",
                    timeMode === option.value
                      ? "bg-primary"
                      : "border border-foreground-muted"
                  )}
                  key={option.value}
                  onPress={() => setTimeMode(option.value)}
                  style={{ borderCurve: "continuous" }}
                >
                  <StyledLeanText
                    className={cn(
                      "font-satoshi-medium",
                      timeMode === option.value
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {option.label}
                  </StyledLeanText>
                </ScalePressable>
              ))}
            </StyledLeanView>
          </StyledLeanView>

          {isNonNegotiable && (
            <StyledLeanView className="gap-2">
              <StyledLeanText className="font-satoshi-medium text-foreground-muted text-sm">
                Due Day (Day of Month)
              </StyledLeanText>
              <BottomSheetScrollView
                contentContainerStyle={{ gap: 8 }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {DUE_DAY_OPTIONS.map((day) => (
                  <ScalePressable
                    className={cn(
                      "h-10 w-10 items-center justify-center rounded-xl",
                      dueDay === day
                        ? "bg-primary"
                        : "border border-foreground-muted"
                    )}
                    key={day}
                    onPress={() => setDueDay(day)}
                    style={{ borderCurve: "continuous" }}
                  >
                    <StyledLeanText
                      className={cn(
                        "font-satoshi-medium",
                        dueDay === day
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {day}
                    </StyledLeanText>
                  </ScalePressable>
                ))}
              </BottomSheetScrollView>
            </StyledLeanView>
          )}
        </StyledLeanView>
      </BottomSheetScrollView>

      <StyledLeanView
        className="absolute right-0 bottom-0 left-0 border-border border-t bg-background px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <ScalePressable
          className="items-center rounded-xl bg-primary py-4"
          disabled={updateMutation.isPending}
          onPress={handleSave}
          style={{ borderCurve: "continuous" }}
        >
          <StyledLeanText className="font-satoshi-medium text-primary-foreground">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </StyledLeanText>
        </ScalePressable>
      </StyledLeanView>
    </StyledLeanView>
  );
}
