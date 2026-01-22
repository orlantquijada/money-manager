import DateTimePicker from "@react-native-community/datetimepicker";

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
  if (isOpen) {
    return (
      <DateTimePicker
        display="default"
        mode="date"
        onChange={(_, selectedDate) => {
          onOpenChange(false);
          if (selectedDate) {
            onDateChange(selectedDate);
          }
        }}
        value={date}
      />
    );
  }

  return null;
}
