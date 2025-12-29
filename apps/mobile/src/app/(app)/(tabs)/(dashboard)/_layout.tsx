import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import TotalSpent from "@/components/dashboard/total-spent";
import { Plus } from "@/icons";
import { cn } from "@/utils/cn";

export default function DashboardLayout() {
  const ref = useRef<BottomSheetModal>(null);

  return (
    <>
      <DashboardCreateBottomSheet ref={ref} />

      <SafeAreaView className="flex-1 bg-violet1">
        <View className="my-8 w-full flex-row items-start justify-between px-4">
          <TotalSpent />

          <Pressable
            className="size-10 items-center justify-center rounded-xl bg-mauveDark1 px-4 transition-all active:scale-95"
            onPress={() => {
              ref.current?.present();
            }}
            style={{ borderCurve: "continuous" }}
          >
            <Plus className="text-mauveDark12" size={20} />
          </Pressable>
        </View>

        <Tabs>
          <TabList className="!justify-start flex-row gap-2 border-b-hairline border-b-mauve5">
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
    </>
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
            "font-satoshi-semibold text-base text-mauve12/50",
            isFocused && "text-mauve12"
          )}
        >
          {children}
        </Text>
      </Pressable>

      {isFocused && (
        <View className="absolute inset-x-0 bottom-0 h-0.5 bg-mauve12" />
      )}
    </View>
  );
}
