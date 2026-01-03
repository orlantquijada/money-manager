import { Host, HStack, Text as SwiftText } from "@expo/ui/swift-ui";
import { frame, glassEffect } from "@expo/ui/swift-ui/modifiers";
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
import DashboardCreateBottomSheet from "@/components/bottom-sheet/create-bottom-sheet";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassButtonIcon from "@/components/glass-button-icon";
import { Plus } from "@/icons";
import { cn } from "@/utils/cn";
import { mauveRgb } from "@/utils/colors";

export default function DashboardLayout() {
  const ref = useRef<BottomSheetModal>(null);

  return (
    <>
      <DashboardCreateBottomSheet ref={ref} />

      <SafeAreaView className="flex-1 bg-violet1">
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

function AddButton({ className, ...props }: PressableProps) {
  const SIZE = 40;

  return (
    <GlassButtonIcon
      glassViewProps={{
        tintColor: mauveRgb.mauve12,
        style: {
          borderRadius: 16,
        },
      }}
      onPress={props.onPress}
    >
      <Plus className="size-6 text-mauve1" />
    </GlassButtonIcon>
  );

  return (
    <Pressable {...props} className={cn("bg-mauve1 p-4", className)}>
      {/* <GlassView */}
      {/*   glassEffectStyle="regular" */}
      {/*   isInteractive */}
      {/*   style={{ */}
      {/*     // width: 40, */}
      {/*     width: 64, */}
      {/*     aspectRatio: 1, */}
      {/*     borderRadius: 999, */}
      {/*     justifyContent: "center", */}
      {/*     alignItems: "center", */}
      {/*   }} */}
      {/* > */}
      {/*   <Plus className="text-mauveDark1" size={20} /> */}
      {/* </GlassView> */}

      <Host matchContents>
        <HStack
          modifiers={[
            frame({ height: SIZE, width: SIZE }),
            glassEffect({
              glass: {
                variant: "regular",
                interactive: true,
                // tint: "#e9e8ea",
                tint: "#1a1523",
                // tint: "#ededef",
              },
              shape: "circle",
            }),
          ]}
        >
          <SwiftText color="#fdfcfd" size={24}>
            +
          </SwiftText>
        </HStack>
      </Host>

      {/* <View */}
      {/*   style={{ */}
      {/*     // width: 40, */}
      {/*     width: 64, */}
      {/*     aspectRatio: 1, */}
      {/*     borderRadius: 999, */}
      {/*     justifyContent: "center", */}
      {/*     alignItems: "center", */}
      {/*   }} */}
      {/* > */}
      {/*   <Plus className="text-mauveDark1" size={20} /> */}
      {/* </View> */}
    </Pressable>
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
