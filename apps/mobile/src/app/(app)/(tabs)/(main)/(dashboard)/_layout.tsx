import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import type { ReactNode } from "react";
import TotalSpent from "@/components/dashboard/total-spent";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";

export default function DashboardLayout() {
  return (
    <StyledLeanView className="flex-1 bg-background pt-safe">
      <StyledLeanView className="mb-4 w-full flex-row items-start justify-between px-4 py-2">
        <TotalSpent />
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
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  children: ReactNode;
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
