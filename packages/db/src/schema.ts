import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const fundTypeEnum = pgEnum("FundType", ["SPENDING", "NON_NEGOTIABLE"]);

export const timeModeEnum = pgEnum("TimeMode", [
  "WEEKLY",
  "MONTHLY",
  "BIMONTHLY",
  "EVENTUALLY",
]);

const timestampFields = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text(),
});

export const userRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  stores: many(stores),
  transactions: many(transactions),
}));

export const folders = pgTable("folders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestampFields,
});

export const folderRelations = relations(folders, ({ one, many }) => ({
  user: one(users, {
    fields: [folders.userId],
    references: [users.id],
  }),
  funds: many(funds),
}));

export const funds = pgTable("funds", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  budgetedAmount: decimal({ precision: 12, scale: 2 }).notNull().default("0"),
  fundType: fundTypeEnum().default("SPENDING").notNull(),
  enabled: boolean().default(true).notNull(),
  timeMode: timeModeEnum().notNull(),
  dueDay: integer(), // Day of month (1-31), only for NON_NEGOTIABLE funds
  paidAt: timestamp(), // When NON_NEGOTIABLE fund was marked as paid (current period)
  folderId: integer()
    .notNull()
    .references(() => folders.id, { onDelete: "cascade" }),
  ...timestampFields,
});

export const fundRelations = relations(funds, ({ one, many }) => ({
  folder: one(folders, {
    fields: [funds.folderId],
    references: [folders.id],
  }),
  transactions: many(transactions),
  stores: many(stores),
}));

export const stores = pgTable(
  "stores",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lastSelectedFundId: integer().references(() => funds.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [unique().on(t.userId, t.name)]
);

export const storeRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  lastSelectedFund: one(funds, {
    fields: [stores.lastSelectedFundId],
    references: [funds.id],
  }),
  transactions: many(transactions),
}));

export const transactions = pgTable(
  "transactions",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    amount: decimal({ precision: 12, scale: 2 }).default("0"),
    date: timestamp().defaultNow(),
    note: text(),
    fundId: integer().references(() => funds.id, { onDelete: "set null" }),
    storeId: integer().references(() => stores.id, {
      onDelete: "set null",
    }),
    userId: text().references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [index("idx_transactions_fund_date").on(t.fundId, t.date)]
);

export const transactionRelations = relations(transactions, ({ one }) => ({
  fund: one(funds, {
    fields: [transactions.fundId],
    references: [funds.id],
  }),
  store: one(stores, {
    fields: [transactions.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));
