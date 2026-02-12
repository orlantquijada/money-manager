import { BottomSheet, DateTimePicker, Host } from "@expo/ui/swift-ui";
import { useState } from "react";
import { useThemeColor } from "./theme-provider";

export type DateSelectorSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  date: Date;
  onDateChange: (date: Date) => void;
};

export function DateSelectorSheet({
  isOpen,
  onOpenChange,
  date,
  onDateChange,
}: DateSelectorSheetProps) {
  const foregroundColor = useThemeColor("foreground");
  const [shouldDismissOnSelect, setShouldDismissOnSelect] = useState(false);

  const handleIsOpenedChange = (isOpened: boolean) => {
    onOpenChange(isOpened);

    if (!isOpened) {
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
    <Host matchContents>
      <BottomSheet isOpened={isOpen} onIsOpenedChange={handleIsOpenedChange}>
        <DateTimePicker
          color={foregroundColor}
          initialDate={date.toISOString()}
          onDateSelected={handleDateSelect}
          variant="graphical"
        />
      </BottomSheet>
    </Host>
  );
}
