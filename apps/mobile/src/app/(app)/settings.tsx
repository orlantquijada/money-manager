import { useAuth, useUser } from "@clerk/clerk-expo";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Linking,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomSheetModal from "@/components/bottom-sheet";
import { ScalePressable } from "@/components/scale-pressable";
import { useTheme, useThemeColor } from "@/components/theme-provider";
import type { IconSymbolName } from "@/components/ui/icon-symbol";
import {
  StyledIconSymbol,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { usePreferencesStore } from "@/stores/preferences";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerTintColor = useThemeColor("foreground-muted");

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBlurEffect: "none",
          headerTintColor,
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-6 px-4"
        contentContainerStyle={{
          paddingTop: Platform.OS === "android" ? insets.top + 64 : 0,
          paddingBottom: insets.bottom + 24,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ProfileHeader />
        <AccountSection />
        {/* <AppearanceSection /> */}
        <PreferencesSection />
        <DataSection />
        <AboutSection />
        <DangerSection />
        <VersionFooter />
      </ScrollView>
    </>
  );
}

// =============================================================================
// Profile Header
// =============================================================================

function getUserInitial(user: ReturnType<typeof useUser>["user"]) {
  if (user?.firstName) return user.firstName[0];
  const email = user?.emailAddresses[0]?.emailAddress;
  if (email) return email[0].toUpperCase();
  return "?";
}

function getUsername(user: ReturnType<typeof useUser>["user"]) {
  if (user?.username) return user.username;
  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) return email.split("@")[0];
  return "user";
}

function ProfileHeader() {
  const { user } = useUser();

  return (
    <StyledLeanView className="items-center gap-2 py-2">
      {user?.imageUrl ? (
        <Image
          source={{ uri: user.imageUrl }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
        />
      ) : (
        <StyledLeanView className="h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-violet-9 to-red-9">
          <StyledLeanText
            className="font-satoshi-bold text-white"
            style={{ fontSize: 50 }}
          >
            {getUserInitial(user)}
          </StyledLeanText>
        </StyledLeanView>
      )}
      <StyledLeanText className="font-satoshi-bold text-foreground text-lg">
        @{getUsername(user)}
      </StyledLeanText>
    </StyledLeanView>
  );
}

// =============================================================================
// Account Section
// =============================================================================

function AccountSection() {
  const { user } = useUser();

  const handleManageAccount = async () => {
    await WebBrowser.openBrowserAsync("https://accounts.clerk.dev/user");
  };

  return (
    <StyledLeanView className="gap-3">
      <SectionHeader title="Account" />

      <StyledLeanView className="overflow-hidden rounded-xl bg-mauve-3 dark:bg-card">
        <StaticRow
          icon="envelope"
          label="Email"
          showBorder
          value={user?.primaryEmailAddress?.emailAddress ?? ""}
        />
        <StaticRow
          icon="at"
          label="Username"
          showBorder
          value={getUsername(user)}
        />
        <NavigationRow
          external
          icon="person.crop.circle"
          label="Manage Account"
          onPress={handleManageAccount}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

// =============================================================================
// Appearance Section
// =============================================================================

function _AppearanceSection() {
  const { theme: activeTheme, setTheme } = useTheme();

  return (
    <StyledLeanView className="gap-3">
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

function ThemeButton({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: "sun.max.fill" | "moon.fill" | "iphone";
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <ScalePressable
      className={cn(
        "flex-1 items-center gap-2 rounded-xl border-hairline border-mauve-5 bg-mauve-3 py-4 dark:bg-card",
        isActive && "bg-violet-3"
      )}
      onPress={onPress}
    >
      <StyledIconSymbol
        colorClassName={
          isActive ? "accent-violet-9" : "accent-foreground-muted"
        }
        name={icon}
        size={24}
      />
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [sheetConfig, setSheetConfig] = useState<{
    options: readonly string[];
    title?: string;
    cancelButtonIndex?: number;
    callback: (index: number) => void;
  } | null>(null);

  const showActionSheet = (
    options: {
      options: readonly string[];
      cancelButtonIndex: number;
      title: string;
      message?: string;
    },
    callback: (buttonIndex: number) => void
  ) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        // @ts-expect-error - readonly array mismatch
        options,
        callback
      );
    } else {
      setSheetConfig({
        options: options.options,
        title: options.title,
        cancelButtonIndex: options.cancelButtonIndex,
        callback: (index: number) => {
          bottomSheetRef.current?.dismiss();
          callback(index);
        },
      });
      bottomSheetRef.current?.present();
    }
  };

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
    showActionSheet(
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
    showActionSheet(
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
    showActionSheet(
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
    <StyledLeanView className="gap-3">
      <SectionHeader title="Preferences" />

      <StyledLeanView className="overflow-hidden rounded-xl bg-mauve-3 dark:bg-card">
        <ToggleRow
          icon="sparkles"
          label="AI Insights"
          onValueChange={setAiInsightsEnabled}
          showBorder
          value={aiInsightsEnabled}
        />

        <NavigationRow
          icon="folder"
          label="Default Fund Type"
          onPress={handleFundTypePicker}
          showBorder
          value={fundTypeLabels[defaultFundType]}
        />

        <NavigationRow
          icon="clock"
          label="Default Time Mode"
          onPress={handleTimeModePicker}
          showBorder
          value={timeModeLabels[defaultTimeMode]}
        />

        <NavigationRow
          icon="bell.badge"
          label="Budget Alert"
          onPress={handleAlertThresholdPicker}
          value={`${alertThreshold}%`}
        />
      </StyledLeanView>

      <BottomSheetModal
        enableDynamicSizing
        onDismiss={() => setSheetConfig(null)}
        ref={bottomSheetRef}
      >
        <BottomSheetView
          className="gap-2 px-4 pb-10"
          style={{ paddingBottom: 40 }}
        >
          {sheetConfig?.title && (
            <StyledLeanText className="py-2 text-center font-satoshi-bold text-foreground text-lg">
              {sheetConfig.title}
            </StyledLeanText>
          )}
          {sheetConfig?.options.map((option: string, index: number) => {
            const isCancel = index === sheetConfig.cancelButtonIndex;
            return (
              <ScalePressable
                className={cn(
                  "items-center rounded-xl bg-mauve-4 py-4 dark:bg-mauve-3",
                  isCancel && "mt-2 bg-mauve-3 dark:bg-mauve-2"
                )}
                key={option}
                onPress={() => sheetConfig.callback(index)}
              >
                <StyledLeanText
                  className={cn(
                    "font-satoshi-medium text-lg",
                    isCancel ? "text-red-9" : "text-foreground"
                  )}
                >
                  {option}
                </StyledLeanText>
              </ScalePressable>
            );
          })}
        </BottomSheetView>
      </BottomSheetModal>
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
    <StyledLeanView className="gap-3">
      <SectionHeader title="Data" />

      <StyledLeanView className="overflow-hidden rounded-xl bg-mauve-3 dark:bg-card">
        <NavigationRow
          icon="square.and.arrow.up"
          label="Export Data"
          onPress={handleExportData}
          showBorder
        />

        <DestructiveRow
          icon="trash"
          label="Clear All Data"
          onPress={handleClearData}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

// =============================================================================
// About Section
// =============================================================================

function AboutSection() {
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
    <StyledLeanView className="gap-3">
      <SectionHeader title="About" />

      <StyledLeanView className="overflow-hidden rounded-xl bg-mauve-3 dark:bg-card">
        <NavigationRow
          external
          icon="envelope"
          label="Send Feedback"
          onPress={handleSendFeedback}
          showBorder
        />
        <NavigationRow
          external
          icon="hand.raised"
          label="Privacy Policy"
          onPress={handlePrivacyPolicy}
          showBorder
        />
        <NavigationRow
          external
          icon="doc.text"
          label="Terms of Service"
          onPress={handleTermsOfService}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

// =============================================================================
// Danger Section
// =============================================================================

function DangerSection() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          queryClient.clear();
          await signOut();
        },
      },
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
              queryClient.clear();
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
    <StyledLeanView className="gap-3">
      <SectionHeader title="Danger" />

      <StyledLeanView className="overflow-hidden rounded-xl bg-mauve-3 dark:bg-card">
        <NavigationRow
          icon="rectangle.portrait.and.arrow.right"
          label="Sign Out"
          onPress={handleLogout}
          showBorder
        />
        <DestructiveRow
          external
          icon="trash"
          label="Delete Account"
          onPress={handleDeleteAccount}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

// =============================================================================
// Version Footer
// =============================================================================

function VersionFooter() {
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? "1";

  return (
    <StyledLeanView className="items-center py-4">
      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        v{appVersion} ({buildNumber})
      </StyledLeanText>
    </StyledLeanView>
  );
}

// =============================================================================
// Shared Components
// =============================================================================

function SectionHeader({ title }: { title: string }) {
  return (
    <StyledLeanText className="pl-4 font-satoshi-semibold text-foreground-muted">
      {title}
    </StyledLeanText>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onValueChange,
  showBorder,
}: {
  icon: IconSymbolName;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showBorder?: boolean;
}) {
  return (
    <StyledLeanView
      className={cn(
        "flex-row items-center justify-between px-4 py-3.5",
        showBorder && "border-mauve-4 border-b-hairline"
      )}
    >
      <StyledLeanView className="flex-row items-center gap-3">
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
          name={icon}
          size={20}
        />
        <StyledLeanText className="font-satoshi-medium text-foreground">
          {label}
        </StyledLeanText>
      </StyledLeanView>

      <Switch
        onValueChange={onValueChange}
        thumbColorClassName="accent-background"
        trackColorOffClassName="accent-foreground-muted"
        trackColorOnClassName="accent-violet-9"
        value={value}
      />
    </StyledLeanView>
  );
}

function StaticRow({
  icon,
  label,
  value,
  showBorder,
}: {
  icon: IconSymbolName;
  label: string;
  value: string;
  showBorder?: boolean;
}) {
  return (
    <StyledLeanView
      className={cn(
        "flex-row items-center justify-between gap-3 px-4 py-3.5",
        showBorder && "border-mauve-4 border-b-hairline"
      )}
    >
      <StyledLeanView className="flex-row items-center gap-3">
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
          name={icon}
          size={20}
        />
        <StyledLeanText className="font-satoshi-medium text-foreground">
          {label}
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanText
        className="shrink font-satoshi text-foreground-muted"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {value}
      </StyledLeanText>
    </StyledLeanView>
  );
}

function NavigationRow({
  icon,
  label,
  value,
  onPress,
  showBorder,
  external,
}: {
  icon: IconSymbolName;
  label: string;
  value?: string;
  onPress: () => void;
  showBorder?: boolean;
  external?: boolean;
}) {
  return (
    <ScalePressable
      className={cn(
        "flex-row items-center justify-between px-4 py-3.5",
        showBorder && "border-mauve-4 border-b-hairline"
      )}
      onPress={onPress}
    >
      <StyledLeanView className="flex-row items-center gap-3">
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
          name={icon}
          size={20}
        />
        <StyledLeanText className="font-satoshi-medium text-foreground">
          {label}
        </StyledLeanText>
      </StyledLeanView>

      <StyledLeanView className="flex-row items-center gap-2">
        {value && (
          <StyledLeanText className="font-satoshi text-foreground-muted">
            {value}
          </StyledLeanText>
        )}
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
          name={external ? "arrow.up.right" : "chevron.right"}
          size={16}
        />
      </StyledLeanView>
    </ScalePressable>
  );
}

function DestructiveRow({
  icon,
  label,
  onPress,
  showBorder,
  external,
}: {
  icon: IconSymbolName;
  label: string;
  onPress: () => void;
  showBorder?: boolean;
  external?: boolean;
}) {
  return (
    <ScalePressable
      className={cn(
        "flex-row items-center justify-between px-4 py-3.5",
        showBorder && "border-mauve-4 border-b-hairline"
      )}
      onPress={onPress}
    >
      <StyledLeanView className="flex-row items-center gap-3">
        <StyledIconSymbol colorClassName="accent-red-9" name={icon} size={20} />
        <StyledLeanText className="font-satoshi-medium text-red-9">
          {label}
        </StyledLeanText>
      </StyledLeanView>

      {external && (
        <StyledIconSymbol
          colorClassName="accent-foreground-muted"
          name="arrow.up.right"
          size={16}
        />
      )}
    </ScalePressable>
  );
}
