import { isToday, isYesterday, subDays } from "date-fns";
import type { SFSymbol } from "expo-symbols";
import { useState } from "react";
import type { ViewStyle } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { StyledLeanText } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { DateSelectorSheet } from "./date-selector-sheet";

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

/**
 * DateSelector with Zeego dropdown menu.
 * Custom date picker sheet is handled by DateSelectorSheet (iOS only).
 */
export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const today = new Date();
  const yesterday = subDays(today, 1);

  const dateType = getDateType(date);
  const dateLabel = getDateLabel(date, dateType);

  return (
    <>
      <DateSelectorSheet
        date={date}
        isOpen={isSheetOpen}
        onDateChange={onDateChange}
        onOpenChange={setIsSheetOpen}
      />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <StyledGlassButton
            className="flex-row"
            size="xl"
            tintColorClassName="accent-muted"
          >
            <StyledLeanText className="mr-2 font-satoshi-medium text-base text-foreground">
              {dateLabel}
            </StyledLeanText>
            <StyledIconSymbol
              colorClassName="accent-foreground-secondary"
              name="chevron.up.chevron.down"
              size={14}
            />
          </StyledGlassButton>
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
          <DropdownMenu.Item key="custom" onSelect={() => setIsSheetOpen(true)}>
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
