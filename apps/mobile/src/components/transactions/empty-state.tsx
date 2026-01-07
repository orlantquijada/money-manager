import { StyledLeanText, StyledLeanView } from "@/config/interop";

export function TransactionsEmptyState() {
  return (
    <StyledLeanView className="flex-1 items-center justify-center py-16">
      <StyledLeanText className="font-satoshi text-base text-foreground-muted">
        No transactions this month
      </StyledLeanText>
    </StyledLeanView>
  );
}
