import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import type { ReactNode } from "react";
import { Image, StyleSheet } from "react-native";
import TotalSpent from "@/components/dashboard/total-spent";
import GlassButton from "@/components/glass-button";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import {
  StyledIconSymbol,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { cn } from "@/utils/cn";

export default function DashboardLayout() {
  return (
    <StyledLeanView className="flex-1 bg-background pt-safe-offset-4">
      <StyledLeanView className="mb-4 w-full flex-row items-start justify-between px-4 py-2">
        <TotalSpent />
        <ProfileButton />
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

function ProfileButton() {
  const { user } = useUser();
  const tintColor = useThemeColor("muted");

  return (
    <GlassButton
      onPress={() => router.push("/settings")}
      size="md"
      tintColor={tintColor}
      variant="icon"
    >
      {user?.imageUrl ? (
        <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
      ) : (
        <StyledIconSymbol
          colorClassName="accent-muted-foreground"
          name="person.circle.fill"
          size={24}
        />
      )}
    </GlassButton>
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

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
  },
});
