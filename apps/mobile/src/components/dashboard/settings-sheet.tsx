import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import type { Ref } from "react";
import { Switch } from "react-native";
import {
  StyledBottomSheetView,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { usePreferencesStore } from "@/stores/preferences";
import { mauveA } from "@/utils/colors";
import { useThemeColor } from "../theme-provider";

type SettingsSheetProps = {
  ref: Ref<BottomSheetModal>;
};

export default function SettingsSheet({ ref }: SettingsSheetProps) {
  const handleIndicatorColor = useThemeColor("foreground-muted");
  const handleBackgroundColor = useThemeColor("background");

  return (
    <BottomSheetModal
      backdropComponent={SettingsBackdrop}
      backgroundStyle={{
        backgroundColor: "transparent",
      }}
      detached
      enableDynamicSizing
      handleIndicatorStyle={{
        backgroundColor: handleIndicatorColor,
      }}
      handleStyle={{
        backgroundColor: handleBackgroundColor,
      }}
      index={0}
      name="settings"
      ref={ref}
      style={{
        borderCurve: "continuous",
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <Content />
    </BottomSheetModal>
  );
}
SettingsSheet.displayName = "SettingsSheet";

function SettingsBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[{ backgroundColor: mauveA.mauveA12 }, props.style]}
    />
  );
}

function Content() {
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
    <StyledBottomSheetView className="flex-1 bg-background px-6 pb-6">
      <StyledLeanText className="mb-4 font-satoshi-bold text-foreground text-xl">
        Settings
      </StyledLeanText>

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
    </StyledBottomSheetView>
  );
}
