import {
  BottomSheet,
  Button,
  ContextMenu,
  DateTimePicker,
  Host,
  HStack,
  Image,
  Text,
} from "@expo/ui/swift-ui";
import { frame, padding } from "@expo/ui/swift-ui/modifiers";
import { isToday, isYesterday, subDays } from "date-fns";
import { useState } from "react";
import type { ViewStyle } from "react-native";
import { useThemeColor } from "./theme-provider";

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

const BTN_CLIP_PADDING = 16;

export function DateSelector({ date, onDateChange, style }: DateSelectorProps) {
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
    <Host matchContents style={style}>
      <BottomSheet isOpened={isOpened} onIsOpenedChange={handleIsOpenedChange}>
        <DateTimePicker
          color={foregroundColor}
          initialDate={date.toISOString()}
          onDateSelected={handleDateSelect}
          variant="graphical"
        />
      </BottomSheet>

      <ContextMenu>
        <ContextMenu.Items>
          <Button
            onPress={() => onDateChange(today)}
            systemImage={dateType === "today" ? "checkmark" : undefined}
          >
            Today
          </Button>
          <Button
            onPress={() => onDateChange(yesterday)}
            systemImage={dateType === "yesterday" ? "checkmark" : undefined}
          >
            Yesterday
          </Button>
          <Button
            onPress={() => setIsOpened(true)}
            systemImage={dateType === "custom" ? "checkmark" : undefined}
          >
            {dateType === "custom" ? dateLabel : "Pick a date"}
          </Button>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button
            color={mutedColor}
            controlSize="large"
            modifiers={[
              padding({ all: BTN_CLIP_PADDING }),
              frame({ width: 250, alignment: "trailing" }),
            ]}
            variant="glassProminent"
          >
            <HStack alignment="center" spacing={8}>
              <Text color={foregroundColor} design="rounded" weight="medium">
                {dateLabel}
              </Text>
              <Image
                // color={PlatformColor("secondaryLabel") as unknown as string}
                // color={mauveDarkRgb.mauveDark11}
                color={foregroundSecondary}
                size={14}
                systemName="chevron.up.chevron.down"
              />
            </HStack>
          </Button>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
