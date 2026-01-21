import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { Pressable, Switch } from "react-native";
import GlassButton from "@/components/glass-button";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { ChevronLeft } from "@/icons";
import { usePreferencesStore } from "@/stores/preferences";

export default function SettingsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerStyle: { backgroundColor },
          headerTitleStyle: {
            fontFamily: "Satoshi-Bold",
            fontSize: 17,
            color: foregroundColor,
          },
          headerShadowVisible: false,
          unstable_headerLeftItems: () => [
            {
              label: "label",
              type: "button",
              icon: {
                name: "chevron.left",
                type: "sfSymbol",
              },
              title: "Edit",
              onPress: () => {
                router.back();
                // Do something
              },
            },
          ],
          // headerLeft: () => (
          //   <BackButton
          //     onPress={() => {
          //       router.back();
          //     }}
          //   />
          // ),
        }}
      />
      <StyledLeanView className="flex-1 gap-8 bg-background px-6 pt-6">
        <AIFeaturesSection />
        <AccountSection />
      </StyledLeanView>
    </>
  );
}

function _BackButton({ _onPress }: { _onPress?: () => void }) {
  const iconColor = useThemeColor("foreground");

  return (
    <GlassButton variant="icon">
      <ChevronLeft color={iconColor} size={24} />
    </GlassButton>
  );
}

function AIFeaturesSection() {
  const aiInsightsEnabled = usePreferencesStore(
    (state) => state.aiInsightsEnabled
  );
  const setAiInsightsEnabled = usePreferencesStore(
    (state) => state.setAiInsightsEnabled
  );
  const trackColor = useThemeColor("foreground-muted");
  const thumbColor = useThemeColor("background");
  const activeTrackColor = useThemeColor("lime-9");

  return (
    <StyledLeanView className="gap-4">
      <StyledLeanText className="font-satoshi-semibold text-foreground-muted text-sm uppercase tracking-wide">
        AI Features
      </StyledLeanText>

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanView className="flex-1 gap-0.5">
          <StyledLeanText className="font-satoshi-medium text-base text-foreground">
            Enable AI Insights
          </StyledLeanText>
          <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
            Show contextual whispers in Activity tab
          </StyledLeanText>
        </StyledLeanView>

        <Switch
          ios_backgroundColorClassName="text-lime-9"
          onValueChange={setAiInsightsEnabled}
          thumbColor={thumbColor}
          trackColor={{ false: trackColor, true: activeTrackColor }}
          value={aiInsightsEnabled}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

function AccountSection() {
  const { signOut } = useAuth();
  const destructiveColor = useThemeColor("red-9");

  return (
    <StyledLeanView className="gap-4">
      <StyledLeanText className="font-satoshi-semibold text-foreground-muted text-sm uppercase tracking-wide">
        Account
      </StyledLeanText>

      <Pressable onPress={() => signOut()}>
        <StyledLeanText
          className="font-satoshi-medium text-base"
          style={{ color: destructiveColor }}
        >
          Log Out
        </StyledLeanText>
      </Pressable>
    </StyledLeanView>
  );
}
