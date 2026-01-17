import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { useRef } from "react";
import type { PressableProps } from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassButton from "@/components/glass-button";
import { ScalePressable } from "@/components/scale-pressable";
import { useTabBarHeight } from "@/components/tab-bar";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Plus, SettingsGear } from "@/icons";
import { cn } from "@/utils/cn";

export default function DashboardLayout() {
  const createSheetRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const tabBarHeight = useTabBarHeight();

  return (
    <AnimatedTabScreen index={1}>
      <DashboardCreateBottomSheet ref={createSheetRef} />

      <StyledLeanView
        className="flex-1 bg-background pt-safe"
        style={{ paddingBottom: tabBarHeight }}
      >
        <StyledLeanView className="mb-4 w-full flex-row items-start justify-between px-4 py-2">
          <TotalSpent />

          {/* <StyledLeanView className="flex-row items-center gap-3"> */}
          {/*   <SettingsButton */}
          {/*     onPress={() => { */}
          {/*       router.push("/settings"); */}
          {/*     }} */}
          {/*   /> */}
          {/*   <AddButton */}
          {/*     onLongPress={() => { */}
          {/*       createSheetRef.current?.present(); */}
          {/*     }} */}
          {/*     onPress={() => { */}
          {/*       createSheetRef.current?.present(); */}
          {/*     }} */}
          {/*   /> */}
          {/* </StyledLeanView> */}
        </StyledLeanView>

        <Tabs>
          <TabList
            className="flex-row gap-2 border-b-border-secondary border-b-hairline"
            style={{ justifyContent: "flex-start" }}
          >
            <TabTrigger asChild href="/" name="budgets">
              <TabButton className="ml-4">Budgets</TabButton>
            </TabTrigger>
            <TabTrigger asChild href="/activity" name="Activity">
              <TabButton>Activity</TabButton>
            </TabTrigger>
          </TabList>

          <TabSlot />
        </Tabs>
      </StyledLeanView>
    </AnimatedTabScreen>
  );
}

function SettingsButton({ onPress }: { onPress: () => void }) {
  const iconColor = useThemeColor("foreground-muted");

  return (
    <ScalePressable hitSlop={10} onPress={onPress} scaleValue={0.9}>
      <SettingsGear color={iconColor} size={22} />
    </ScalePressable>
  );
}

function AddButton({ className, ...props }: PressableProps) {
  const tintColor = useThemeColor("foreground");

  return (
    <GlassButton
      glassViewProps={{
        style: {
          borderRadius: 16,
        },
      }}
      tintColor={tintColor}
      {...props}
    >
      <Plus className="text-background" size={24} />
    </GlassButton>
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
