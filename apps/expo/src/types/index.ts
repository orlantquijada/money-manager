import type { Folder, Fund, Store, Transaction } from ".prisma/client";

export * from "./routes";

export type FundWithMeta = Fund & {
  totalSpent: number;
  totalBudgetedAmount: number;
};

export type FolderWithMeta = Folder & {
  amountLeft: number;
  funds: FundWithMeta[];
};

export type TransactionWithMeta = Transaction & {
  fund: Pick<Fund, "name">;
  store: Pick<Store, "name"> | null;
};

export type TransactionSection = {
  title: Date;
  data: TransactionWithMeta[];
};
