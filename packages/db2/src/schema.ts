import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const fundTypeEnum = pgEnum("FundType", [
  "SPENDING",
  "NON_NEGOTIABLE",
  "TARGET",
]);

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

export const User = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text(),
});

export const userRelations = relations(User, ({ many }) => ({
  folders: many(Folder),
  stores: many(Store),
  transactions: many(Transaction),
}));

export const Folder = pgTable("folders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  userId: text()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  ...timestampFields,
});

export const folderRelations = relations(Folder, ({ one, many }) => ({
  user: one(User, {
    fields: [Folder.userId],
    references: [User.id],
  }),
  funds: many(Fund),
}));

export const Fund = pgTable("funds", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  budgetedAmount: decimal({ precision: 12, scale: 2 }).notNull().default("0"),
  fundType: fundTypeEnum().default("SPENDING").notNull(),
  enabled: boolean().default(true).notNull(),
  timeMode: timeModeEnum().notNull(),
  folderId: integer()
    .notNull()
    .references(() => Folder.id, { onDelete: "cascade" }),
  ...timestampFields,
});

export const fundRelations = relations(Fund, ({ one, many }) => ({
  folder: one(Folder, {
    fields: [Fund.folderId],
    references: [Folder.id],
  }),
  transactions: many(Transaction),
  stores: many(Store),
}));

export const Store = pgTable(
  "stores",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    userId: text()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    lastSelectedFundId: integer().references(() => Fund.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [unique().on(t.userId, t.name)]
);

export const storeRelations = relations(Store, ({ one, many }) => ({
  user: one(User, {
    fields: [Store.userId],
    references: [User.id],
  }),
  lastSelectedFund: one(Fund, {
    fields: [Store.lastSelectedFundId],
    references: [Fund.id],
  }),
  transactions: many(Transaction),
}));

export const Transaction = pgTable("transactions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  amount: decimal({ precision: 12, scale: 2 }).default("0"),
  date: timestamp().defaultNow(),
  note: text(),
  fundId: integer()
    .notNull()
    .references(() => Fund.id, { onDelete: "cascade" }),
  storeId: integer().references(() => Store.id, {
    onDelete: "cascade",
  }),
  userId: text().references(() => User.id, { onDelete: "cascade" }),
});

export const transactionRelations = relations(Transaction, ({ one }) => ({
  fund: one(Fund, {
    fields: [Transaction.fundId],
    references: [Fund.id],
  }),
  store: one(Store, {
    fields: [Transaction.storeId],
    references: [Store.id],
  }),
  user: one(User, {
    fields: [Transaction.userId],
    references: [User.id],
  }),
}));
