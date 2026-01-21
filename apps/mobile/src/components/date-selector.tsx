import { View, type ViewStyle } from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useThemeColor } from "./theme-provider";

type DateSelectorProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  style?: ViewStyle;
};

const monthDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

/**
 * Android fallback for DateSelector.
 * Simplified version that just displays the date since native iOS DateTimePicker is not available.
 * In a real app, this would use a cross-platform date picker like @react-native-community/datetimepicker.
 */
export function DateSelector({ date, style }: DateSelectorProps) {
  const dateLabel = monthDateFormat.format(date);

  return (
    <StyledLeanView className="p-8 pr-4" style={style}>
      <View
        className="flex-row items-center justify-center rounded-2xl px-4 py-3"
        style={{ backgroundColor: useThemeColor("muted") }}
      >
        <StyledLeanText className="font-satoshi-medium text-base text-foreground">
          {dateLabel}
        </StyledLeanText>
      </View>
      <StyledLeanText className="mt-2 text-center text-foreground-secondary text-xs">
        Date selection is limited on Android
      </StyledLeanText>
    </StyledLeanView>
  );
}
