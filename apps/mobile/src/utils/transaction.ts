import { startOfDay } from "date-fns";
import type { TransactionItem } from "@/components/transactions/transaction-row";
import { toIsoDate } from "@/utils/format";
import { sum } from "@/utils/math";

export type TransactionSection = {
  date: Date;
  total: number;
  data: TransactionItem[];
};

export function groupTransactionsByDate(
  transactions: TransactionItem[]
): TransactionSection[] {
  const grouped = new Map<
    string,
    { date: Date; transactions: TransactionItem[] }
  >();

  for (const transaction of transactions) {
    if (!transaction.date) continue;

    const dateDayStart = startOfDay(transaction.date);
    const dayKey = toIsoDate(dateDayStart);

    const existing = grouped.get(dayKey);
    if (existing) {
      existing.transactions.push(transaction);
    } else {
      grouped.set(dayKey, {
        date: dateDayStart,
        transactions: [transaction],
      });
    }
  }

  return Array.from(grouped.values())
    .map((group) => ({
      date: group.date,
      total: sum(group.transactions.map(({ amount }) => Number(amount))),
      data: group.transactions,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
