import { BottomSheet, DateTimePicker, Host } from "@expo/ui/swift-ui";
import { isToday, isYesterday, subDays } from "date-fns";
import type { SFSymbol } from "expo-symbols";
import { useState } from "react";
import type { ViewStyle } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import GlassButton from "./glass-button";
import { useThemeColor } from "./theme-provider";
import { IconSymbol } from "./ui/icon-symbol";

const monthDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

type DateType = "today" | "yesterday" | "custom";

function getDateType(date: Date): DateType {
  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  return "custom";
}

function getDateLabel(date: Date, dateType: DateType): string {
  switch (dateType) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "custom":
      return monthDateFormat.format(date);
    default: {
      const _exhaustive: never = dateType;
      return _exhaustive;
    }
  }
}

type DateSelectorProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  style?: ViewStyle;
};

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  const [isOpened, setIsOpened] = useState(false);
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const foregroundSecondary = useThemeColor("foreground-secondary");

  // Skip the first `onDateSelected` callback - it's triggered on mount, not by user interaction
  const [shouldDismissOnSelect, setShouldDismissOnSelect] = useState(false);

  const today = new Date();
  const yesterday = subDays(today, 1);

  const dateType = getDateType(date);
  const dateLabel = getDateLabel(date, dateType);

  const handleIsOpenedChange = (_isOpened: boolean) => {
    setIsOpened(_isOpened);

    if (!_isOpened) {
      setShouldDismissOnSelect(false);
    }
  };

  const handleDateSelect = (newDate: Date) => {
    onDateChange(newDate);

    if (shouldDismissOnSelect) {
      handleIsOpenedChange(false);
    } else {
      setShouldDismissOnSelect(true);
    }
  };

  return (
    <>
      <Host matchContents>
        <BottomSheet
          isOpened={isOpened}
          onIsOpenedChange={handleIsOpenedChange}
        >
          <DateTimePicker
            color={foregroundColor}
            initialDate={date.toISOString()}
            onDateSelected={handleDateSelect}
            variant="graphical"
          />
        </BottomSheet>
      </Host>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <StyledLeanView className="p-8 pr-4">
            <GlassButton size="xl" tintColor={mutedColor} variant="default">
              <StyledLeanText className="mr-2 font-satoshi-medium text-base text-foreground">
                {dateLabel}
              </StyledLeanText>
              <IconSymbol
                color={foregroundSecondary}
                name="chevron.up.chevron.down"
                size={14}
              />
            </GlassButton>
          </StyledLeanView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item key="today" onSelect={() => onDateChange(today)}>
            {dateType === "today" && (
              <DropdownMenu.ItemIcon ios={{ name: "checkmark" as SFSymbol }} />
            )}

            <DropdownMenu.ItemTitle>Today</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="yesterday"
            onSelect={() => onDateChange(yesterday)}
          >
            {dateType === "yesterday" && (
              <DropdownMenu.ItemIcon ios={{ name: "checkmark" as SFSymbol }} />
            )}
            <DropdownMenu.ItemTitle>Yesterday</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="custom" onSelect={() => setIsOpened(true)}>
            {dateType === "custom" && (
              <DropdownMenu.ItemIcon ios={{ name: "checkmark" as SFSymbol }} />
            )}
            <DropdownMenu.ItemTitle>
              {dateType === "custom" ? dateLabel : "Pick a date"}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
