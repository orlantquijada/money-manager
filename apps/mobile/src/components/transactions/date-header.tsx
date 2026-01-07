import { format, isToday, isYesterday } from "date-fns";

import { StyledLeanText, StyledLeanView } from "@/config/interop";

type Props = {
  date: Date;
  total: number;
};

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d");
}

export function TransactionDateHeader({ date, total }: Props) {
  return (
    <StyledLeanView className="flex-row items-center justify-between pt-4 pb-2">
      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        {formatDateLabel(date)}
      </StyledLeanText>

      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        ₱{total.toLocaleString()}
      </StyledLeanText>
    </StyledLeanView>
  );
}
