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
