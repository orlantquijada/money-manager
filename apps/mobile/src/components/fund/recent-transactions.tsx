import { Link, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScalePressable } from "@/components/scale-pressable";
import { TransactionDateHeader } from "@/components/transactions/date-header";
import {
  type TransactionItem,
  TransactionRow,
} from "@/components/transactions/transaction-row";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { groupTransactionsByDate } from "@/utils/transaction";

type Props = {
  fundId: number;
  transactions: TransactionItem[];
};

export function RecentTransactions({ fundId, transactions }: Props) {
  const router = useRouter();

  const sections = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const handleTransactionPress = useCallback(
    (transactionId: string) => {
      router.push(`/transaction/${transactionId}`);
    },
    [router]
  );

  return (
    <StyledLeanView>
      <StyledLeanView className="flex-row items-center justify-between">
        <StyledLeanText className="font-satoshi-semibold text-base text-foreground-muted">
          Recent Transactions
        </StyledLeanText>
        {sections.length > 0 && (
          <Link asChild href={`/funds/${fundId}/transactions`}>
            <ScalePressable hitSlop={10} opacityValue={0.75}>
              <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
                See all
              </StyledLeanText>
            </ScalePressable>
          </Link>
        )}
      </StyledLeanView>

      {sections.length === 0 && (
        <StyledLeanText className="py-4 text-center text-foreground-muted">
          No transactions yet
        </StyledLeanText>
      )}

      {sections.map((section) => (
        <StyledLeanView key={section.date.toISOString()}>
          <TransactionDateHeader date={section.date} total={section.total} />
          {section.data.map((transaction) => (
            <TransactionRow
              hideFundContext
              key={transaction.id}
              onPress={() => handleTransactionPress(transaction.id)}
              transaction={transaction}
            />
          ))}
        </StyledLeanView>
      ))}
    </StyledLeanView>
  );
}
