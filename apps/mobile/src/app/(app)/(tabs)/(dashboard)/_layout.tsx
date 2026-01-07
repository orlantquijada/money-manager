import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { useRef } from "react";
import { type PressableProps, View } from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassButtonIcon from "@/components/glass-button-icon";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import {
  StyledLeanText,
  StyledLeanView,
  StyledSafeAreaView,
} from "@/config/interop";
import { Plus } from "@/icons";
import { cn } from "@/utils/cn";

export default function DashboardLayout() {
  const ref = useRef<BottomSheetModal>(null);

  return (
    <AnimatedTabScreen index={1}>
      <DashboardCreateBottomSheet ref={ref} />

      <StyledSafeAreaView className="flex-1 bg-background">
        <View className="my-8 w-full flex-row items-start justify-between px-4">
          <TotalSpent />

          <AddButton
            onLongPress={() => {
              ref.current?.present();
            }}
            onPress={() => {
              ref.current?.present();
            }}
          />
        </View>

        <Tabs>
          <TabList
            className="flex-row gap-2 border-b-border-secondary border-b-hairline"
            style={{ justifyContent: "flex-start" }}
          >
            <TabTrigger asChild href="/" name="budgets">
              <TabButton className="ml-4">Budgets</TabButton>
            </TabTrigger>
            <TabTrigger asChild href="/transactions" name="transactions">
              <TabButton>Transactions</TabButton>
            </TabTrigger>
          </TabList>

          <TabSlot />
        </Tabs>
      </StyledSafeAreaView>
    </AnimatedTabScreen>
  );
}

function AddButton({ className, ...props }: PressableProps) {
  const tintColor = useThemeColor("foreground");

  return (
    <GlassButtonIcon
      glassViewProps={{
        style: {
          borderRadius: 16,
        },
      }}
      tintColor={tintColor}
      {...props}
    >
      <Plus className="text-background" size={24} />
    </GlassButtonIcon>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  children: React.ReactNode;
};

function TabButton({
  children,
  isFocused,
  className,
  ...props
}: TabButtonProps) {
  return (
    <StyledLeanView className={cn("relative", className)}>
      <ScalePressable
        className="h-12 items-center justify-center px-2"
        opacityValue={0.75}
        scaleValue={0.98}
        {...props}
      >
        <StyledLeanText
          className={cn(
            "font-satoshi-semibold text-base text-foreground-muted",
            isFocused && "text-foreground"
          )}
        >
          {children}
        </StyledLeanText>
      </ScalePressable>

      {isFocused && (
        <StyledLeanView className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
      )}
    </StyledLeanView>
  );
}
