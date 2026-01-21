import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import {
  ActionSheetIOS,
  Alert,
  Linking,
  ScrollView,
  Switch,
} from "react-native";

import { ScalePressable } from "@/components/scale-pressable";
import { useTheme, useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { ChevronRight } from "@/icons";
import { usePreferencesStore } from "@/stores/preferences";
import { trpc } from "@/utils/api";

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
              icon: { name: "chevron.left", type: "sfSymbol" },
              title: "Edit",
              onPress: () => router.back(),
            },
          ],
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-8 px-6 py-6"
      >
        <ProfileSection />
        <AppearanceSection />
        <PreferencesSection />
        <DataSection />
        <AboutSection />
        <AccountSection />
      </ScrollView>
    </>
  );
}

// =============================================================================
// Profile Section
// =============================================================================

function getUserInitial(user: ReturnType<typeof useUser>["user"]) {
  if (user?.firstName) return user.firstName[0];
  const email = user?.emailAddresses[0]?.emailAddress;
  if (email) return email[0].toUpperCase();
  return "?";
}

function ProfileSection() {
  const { user } = useUser();

  const handleManageAccount = async () => {
    // Open Clerk's user profile management portal
    await WebBrowser.openBrowserAsync("https://accounts.clerk.dev/user");
  };

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="Profile" />

      <StyledLeanView className="flex-row items-center gap-4">
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
          />
        ) : (
          <StyledLeanView className="h-14 w-14 items-center justify-center rounded-full bg-mauve-4">
            <StyledLeanText className="font-satoshi-bold text-foreground text-lg">
              {getUserInitial(user)}
            </StyledLeanText>
          </StyledLeanView>
        )}

        <StyledLeanView className="flex-1 gap-0.5">
          <StyledLeanText className="font-satoshi-medium text-base text-foreground">
            {user?.fullName ?? "User"}
          </StyledLeanText>
          <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
            {user?.primaryEmailAddress?.emailAddress ?? ""}
          </StyledLeanText>
        </StyledLeanView>
      </StyledLeanView>

      <NavigationRow label="Manage Account" onPress={handleManageAccount} />
    </StyledLeanView>
  );
}

// =============================================================================
// Appearance Section
// =============================================================================

function AppearanceSection() {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="Appearance" />

      <StyledLeanView className="flex-row gap-3">
        <ThemeButton
          icon="sun.max.fill"
          isActive={activeTheme === "light"}
          label="Light"
          onPress={() => setTheme("light")}
        />
        <ThemeButton
          icon="moon.fill"
          isActive={activeTheme === "dark"}
          label="Dark"
          onPress={() => setTheme("dark")}
        />
        <ThemeButton
          icon="iphone"
          isActive={activeTheme === "system"}
          label="System"
          onPress={() => setTheme("system")}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

const themeIconMap: Record<string, string> = {
  "sun.max.fill": "☀️",
  "moon.fill": "🌙",
  iphone: "📱",
};

function ThemeButton({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const activeColor = useThemeColor("violet-9");
  const inactiveColor = useThemeColor("foreground-muted");

  return (
    <ScalePressable
      className={`flex-1 items-center gap-2 rounded-xl py-4 ${
        isActive ? "bg-violet-3" : "bg-mauve-3"
      }`}
      onPress={onPress}
    >
      <StyledLeanText
        className="text-2xl"
        style={{ color: isActive ? activeColor : inactiveColor }}
      >
        {themeIconMap[icon]}
      </StyledLeanText>
      <StyledLeanText
        className={`font-satoshi-medium text-sm ${
          isActive ? "text-violet-11" : "text-foreground-muted"
        }`}
      >
        {label}
      </StyledLeanText>
    </ScalePressable>
  );
}

// =============================================================================
// Preferences Section
// =============================================================================

function PreferencesSection() {
  const aiInsightsEnabled = usePreferencesStore((s) => s.aiInsightsEnabled);
  const setAiInsightsEnabled = usePreferencesStore(
    (s) => s.setAiInsightsEnabled
  );

  const defaultFundType = usePreferencesStore((s) => s.defaultFundType);
  const setDefaultFundType = usePreferencesStore((s) => s.setDefaultFundType);

  const defaultTimeMode = usePreferencesStore((s) => s.defaultTimeMode);
  const setDefaultTimeMode = usePreferencesStore((s) => s.setDefaultTimeMode);

  const alertThreshold = usePreferencesStore((s) => s.alertThreshold);
  const setAlertThreshold = usePreferencesStore((s) => s.setAlertThreshold);

  const trackColor = useThemeColor("foreground-muted");
  const thumbColor = useThemeColor("background");
  const activeTrackColor = useThemeColor("lime-9");

  const fundTypeLabels = {
    SPENDING: "Spending",
    NON_NEGOTIABLE: "Non-Negotiable",
  };

  const timeModeLabels = {
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    BIMONTHLY: "Bimonthly",
    EVENTUALLY: "Eventually",
  };

  const handleFundTypePicker = () => {
    const fundTypes = ["SPENDING", "NON_NEGOTIABLE"] as const;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Spending", "Non-Negotiable"],
        cancelButtonIndex: 0,
        title: "Default Fund Type",
        message: "Choose the default type for new funds",
      },
      (buttonIndex) => {
        if (buttonIndex > 0) setDefaultFundType(fundTypes[buttonIndex - 1]);
      }
    );
  };

  const handleTimeModePicker = () => {
    const timeModes = ["WEEKLY", "MONTHLY", "BIMONTHLY", "EVENTUALLY"] as const;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Weekly", "Monthly", "Bimonthly", "Eventually"],
        cancelButtonIndex: 0,
        title: "Default Time Mode",
        message: "Choose the default time mode for new funds",
      },
      (buttonIndex) => {
        if (buttonIndex > 0) setDefaultTimeMode(timeModes[buttonIndex - 1]);
      }
    );
  };

  const handleAlertThresholdPicker = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "75%", "80%", "85%", "90%", "95%", "100%"],
        cancelButtonIndex: 0,
        title: "Budget Alert Threshold",
        message: "Get notified when spending reaches this percentage",
      },
      (buttonIndex) => {
        const thresholds = [75, 80, 85, 90, 95, 100];
        const threshold = thresholds[buttonIndex - 1];
        if (buttonIndex > 0 && threshold !== undefined)
          setAlertThreshold(threshold);
      }
    );
  };

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="Preferences" />

      <ToggleRow
        description="Show contextual whispers in Activity tab"
        label="AI Insights"
        onValueChange={setAiInsightsEnabled}
        thumbColor={thumbColor}
        trackColor={{ false: trackColor, true: activeTrackColor }}
        value={aiInsightsEnabled}
      />

      <NavigationRow
        label="Default Fund Type"
        onPress={handleFundTypePicker}
        value={fundTypeLabels[defaultFundType]}
      />

      <NavigationRow
        label="Default Time Mode"
        onPress={handleTimeModePicker}
        value={timeModeLabels[defaultTimeMode]}
      />

      <NavigationRow
        label="Budget Alert Threshold"
        onPress={handleAlertThresholdPicker}
        value={`${alertThreshold}%`}
      />
    </StyledLeanView>
  );
}

// =============================================================================
// Data Section
// =============================================================================

function DataSection() {
  const queryClient = useQueryClient();
  const clearAllMutation = useMutation(
    trpc.transaction.clearAll.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.transaction.pathFilter());
        queryClient.invalidateQueries(trpc.fund.pathFilter());
        queryClient.invalidateQueries(trpc.folder.pathFilter());
      },
    })
  );

  const handleExportData = async () => {
    try {
      const data = await queryClient.fetchQuery(
        trpc.user.exportData.queryOptions()
      );
      const jsonString = JSON.stringify(data, null, 2);
      const date = new Date().toISOString().split("T")[0];
      const fileName = `money-manager-export-${date}.json`;
      const filePath = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(filePath, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/json",
          dialogTitle: "Export Data",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch {
      Alert.alert("Error", "Failed to export data");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your transactions, funds, and folders. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearAllMutation.mutate(),
        },
      ]
    );
  };

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="Data" />

      <NavigationRow label="Export Data" onPress={handleExportData} />

      <DestructiveButton label="Clear All Data" onPress={handleClearData} />
    </StyledLeanView>
  );
}

// =============================================================================
// About Section
// =============================================================================

function AboutSection() {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? "1";

  const handleSendFeedback = () => {
    Linking.openURL("mailto:support@moneymanager.app?subject=App Feedback");
  };

  const handlePrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync("https://moneymanager.app/privacy");
  };

  const handleTermsOfService = async () => {
    await WebBrowser.openBrowserAsync("https://moneymanager.app/terms");
  };

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="About" />

      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-medium text-base text-foreground">
          Version
        </StyledLeanText>
        <StyledLeanText className="font-satoshi text-base text-foreground-muted">
          {appVersion} ({buildNumber})
        </StyledLeanText>
      </StyledLeanView>

      <NavigationRow label="Send Feedback" onPress={handleSendFeedback} />
      <NavigationRow label="Privacy Policy" onPress={handlePrivacyPolicy} />
      <NavigationRow label="Terms of Service" onPress={handleTermsOfService} />
    </StyledLeanView>
  );
}

// =============================================================================
// Account Section
// =============================================================================

function AccountSection() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => signOut() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: async () => {
            try {
              await user?.delete();
              await signOut();
            } catch {
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <StyledLeanView className="gap-4">
      <SectionHeader title="Account" />

      <DestructiveButton label="Log Out" onPress={handleLogout} />
      <DestructiveButton label="Delete Account" onPress={handleDeleteAccount} />
    </StyledLeanView>
  );
}

// =============================================================================
// Shared Components
// =============================================================================

function SectionHeader({ title }: { title: string }) {
  return (
    <StyledLeanText className="font-satoshi-semibold text-foreground-muted text-sm uppercase tracking-wide">
      {title}
    </StyledLeanText>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  trackColor,
  thumbColor,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor: { false: string; true: string };
  thumbColor: string;
}) {
  return (
    <StyledLeanView className="flex-row items-center justify-between">
      <StyledLeanView className="flex-1 gap-0.5">
        <StyledLeanText className="font-satoshi-medium text-base text-foreground">
          {label}
        </StyledLeanText>
        {description && (
          <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
            {description}
          </StyledLeanText>
        )}
      </StyledLeanView>

      <Switch
        onValueChange={onValueChange}
        thumbColor={thumbColor}
        trackColor={trackColor}
        value={value}
      />
    </StyledLeanView>
  );
}

function NavigationRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress: () => void;
}) {
  const chevronColor = useThemeColor("foreground-muted");

  return (
    <ScalePressable
      className="flex-row items-center justify-between py-1"
      onPress={onPress}
    >
      <StyledLeanText className="font-satoshi-medium text-base text-foreground">
        {label}
      </StyledLeanText>
      <StyledLeanView className="flex-row items-center gap-2">
        {value && (
          <StyledLeanText className="font-satoshi text-base text-foreground-muted">
            {value}
          </StyledLeanText>
        )}
        <ChevronRight color={chevronColor} size={16} />
      </StyledLeanView>
    </ScalePressable>
  );
}

function DestructiveButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const destructiveColor = useThemeColor("red-9");

  return (
    <ScalePressable className="py-1" onPress={onPress}>
      <StyledLeanText
        className="font-satoshi-medium text-base"
        style={{ color: destructiveColor }}
      >
        {label}
      </StyledLeanText>
    </ScalePressable>
  );
}
