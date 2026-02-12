import type {
  folders,
  funds,
  fundTypeEnum,
  stores,
  timeModeEnum,
  transactions,
  users,
} from "db/schema";
import type { InferEnum, InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Folder = InferSelectModel<typeof folders>;
export type Fund = InferSelectModel<typeof funds>;
export type Transaction = InferSelectModel<typeof transactions>;
export type Store = InferSelectModel<typeof stores>;

export type FundType = InferEnum<typeof fundTypeEnum>;
export type TimeMode = InferEnum<typeof timeModeEnum>;

/**
 * Lightweight store type for add-expense flow.
 * Matches the shape returned by store.list endpoint.
 */
export interface StorePick {
  id: number;
  name: string;
  lastSelectedFundId: number | null;
  lastSelectedFundName: string | null;
}

/**
 * Fund with folder context, used in fund picker components.
 */
export interface FundWithFolder {
  id: number;
  name: string;
  folderId: number;
  folderName: string;
}

/**
 * Extended fund with folder context including budget visualization data.
 */
export type FundWithFolderAndBudget = FundWithFolder & {
  amountLeft: number;
  progress: number;
  fundType: FundType;
  monthlyBudget: number;
  // NON_NEGOTIABLE funds only
  amountSaved?: number;
  isFunded?: boolean;
};
