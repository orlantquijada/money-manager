import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { useRef } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassButtonIcon from "@/components/glass-button-icon";
import { useTheme } from "@/components/theme-provider";
import { Plus } from "@/icons";
import { cn } from "@/utils/cn";
import { mauveDarkRgb, mauveRgb } from "@/utils/colors";

export default function DashboardLayout() {
  const ref = useRef<BottomSheetModal>(null);

  return (
    <AnimatedTabScreen index={1}>
      <DashboardCreateBottomSheet ref={ref} />

      <SafeAreaView className="flex-1 bg-background">
        <View className="my-8 w-full flex-row items-start justify-between px-4">
          <TotalSpent />

          {/* <Pressable */}
          {/*   className="size-10 items-center justify-center rounded-xl bg-mauveDark1 px-4 transition-all active:scale-95" */}
          {/*   onPress={() => { */}
          {/*     ref.current?.present(); */}
          {/*   }} */}
          {/*   style={{ borderCurve: "continuous" }} */}
          {/* > */}
          {/*   <Plus className="text-mauveDark12" size={20} /> */}
          {/* </Pressable> */}

          <AddButton
            onPress={() => {
              ref.current?.present();
            }}
          />
        </View>

        <Tabs>
          <TabList className="!justify-start flex-row gap-2 border-b-border-secondary border-b-hairline">
            <TabTrigger asChild href="/" name="budgets">
              <TabButton className="ml-4">Budgets</TabButton>
            </TabTrigger>
            <TabTrigger asChild href="/transactions" name="transactions">
              <TabButton>Transactions</TabButton>
            </TabTrigger>
          </TabList>

          <TabSlot />
        </Tabs>
      </SafeAreaView>
    </AnimatedTabScreen>
  );
}

function AddButton({ className, ...props }: PressableProps) {
  const { isDark } = useTheme();

  return (
    <GlassButtonIcon
      glassViewProps={{
        tintColor: isDark ? mauveDarkRgb.mauveDark12 : mauveRgb.mauve12,
        style: {
          borderRadius: 16,
        },
      }}
      onPress={props.onPress}
    >
      <Plus className="size-6 text-background" />
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
    <View className={cn("relative", className)}>
      <Pressable
        className="h-12 items-center justify-center px-2 transition-all active:scale-[.98] active:opacity-75"
        {...props}
      >
        <Text
          className={cn(
            "font-satoshi-semibold text-base text-foreground-muted",
            isFocused && "text-foreground"
          )}
        >
          {children}
        </Text>
      </Pressable>

      {isFocused && (
        <View className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
      )}
    </View>
  );
}
