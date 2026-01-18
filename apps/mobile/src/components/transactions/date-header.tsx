import { isToday, isYesterday } from "date-fns";

import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { toDayDate } from "@/utils/format";

type Props = {
  date: Date;
  total: number;
};

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return toDayDate(date); // e.g., "Mon, Jan 6"
}

export function TransactionDateHeader({ date, total }: Props) {
  return (
    <StyledLeanView className="flex-row items-center justify-between pt-6 pb-3">
      <StyledLeanText className="font-satoshi text-foreground-muted text-sm">
        {formatDateLabel(date)}
      </StyledLeanText>

      <StyledLeanText className="font-nunito-bold text-foreground-muted text-sm">
        ₱{total.toLocaleString()}
      </StyledLeanText>
    </StyledLeanView>
  );
}
