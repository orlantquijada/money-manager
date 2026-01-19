<!-- Generated: 2026-01-19 -->

# Data Codemap

## Package Structure

```
packages/db/
├── src/
│   ├── schema.ts            # Drizzle table definitions
│   ├── client.ts            # Database client
│   ├── index.ts             # Re-exports
│   └── seed.ts              # Seed script
├── env.ts                   # Environment validation
└── drizzle.config.ts        # Drizzle Kit config
```

## Database Client (`src/client.ts`)

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case",
  schema,
});
```

## Schema Overview

### Enums

```typescript
// Fund type classification
export const fundTypeEnum = pgEnum("FundType", [
  "SPENDING",        // Regular spending category
  "NON_NEGOTIABLE"   // Fixed bills/expenses
]);

// Budget recurrence
export const timeModeEnum = pgEnum("TimeMode", [
  "WEEKLY",          // Weekly budget
  "MONTHLY",         // Monthly budget
  "BIMONTHLY",       // Twice monthly
  "EVENTUALLY"       // Savings goal, no recurrence
]);
```

### Tables

#### `users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PK, cuid2 default |
| name | text | nullable |

Relations: `folders`, `stores`, `transactions`

#### `folders`

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PK, auto-increment |
| name | text | NOT NULL |
| userId | text | FK users.id, CASCADE |
| createdAt | timestamp | default now |
| updatedAt | timestamp | default now, $onUpdate |

Relations: `user`, `funds`

#### `funds`

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PK, auto-increment |
| name | text | NOT NULL |
| budgetedAmount | decimal(12,2) | default "0" |
| fundType | FundType enum | default "SPENDING" |
| enabled | boolean | default true |
| timeMode | TimeMode enum | NOT NULL |
| dueDay | integer | nullable (1-31, for NON_NEGOTIABLE) |
| paidAt | timestamp | nullable (current period paid) |
| folderId | integer | FK folders.id, CASCADE |
| createdAt | timestamp | default now |
| updatedAt | timestamp | default now, $onUpdate |

Relations: `folder`, `transactions`, `stores`

#### `stores`

| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PK, auto-increment |
| name | text | NOT NULL |
| userId | text | FK users.id, CASCADE |
| lastSelectedFundId | integer | FK funds.id, CASCADE, nullable |

Constraints: `unique(userId, name)`

Relations: `user`, `lastSelectedFund`, `transactions`

#### `transactions`

| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PK, cuid2 default |
| amount | decimal(12,2) | default "0" |
| date | timestamp | default now |
| note | text | nullable |
| fundId | integer | FK funds.id, CASCADE |
| storeId | integer | FK stores.id, CASCADE, nullable |
| userId | text | FK users.id, CASCADE, nullable |

Indexes: `idx_transactions_fund_date(fundId, date)`

Relations: `fund`, `store`, `user`

## Entity Relationships

```
users
├── folders (1:many)
│   └── funds (1:many)
│       └── transactions (1:many)
├── stores (1:many)
│   └── transactions (1:many)
└── transactions (1:many)
```

## Common Query Patterns

### Get folders with funds and spending

```typescript
db.query.folders.findMany({
  where: eq(folders.userId, ctx.userId),
  with: {
    funds: { orderBy: asc(funds.createdAt) },
  },
});
```

### Get monthly spending by fund

```typescript
db.select({
  fundId: transactions.fundId,
  amount: sum(transactions.amount).mapWith(Number),
})
.from(transactions)
.where(and(
  inArray(transactions.fundId, fundIds),
  gte(transactions.date, startOfMonth(now)),
  lt(transactions.date, endOfMonth(now))
))
.groupBy(transactions.fundId);
```

### Paginated transactions (cursor-based)

```typescript
db.query.transactions.findMany({
  where: and(
    eq(txns.userId, ctx.userId),
    cursorCondition
  ),
  orderBy: [desc(txns.date), desc(txns.id)],
  limit: limit + 1,
  with: { fund: { columns: { name: true } } },
});
```

## Exports

### From `packages/db`

```typescript
// Re-exports from drizzle-orm/sql
export * from "drizzle-orm/sql";
```

### From `packages/db/schema`

```typescript
// Enums
export { fundTypeEnum, timeModeEnum };

// Tables
export { users, folders, funds, stores, transactions };

// Relations
export { userRelations, folderRelations, fundRelations,
         storeRelations, transactionRelations };
```

### From `packages/db/client`

```typescript
export { db };
```

## Type Inference

```typescript
// From drizzle table
type Fund = typeof funds.$inferSelect;
type NewFund = typeof funds.$inferInsert;

// From API router
import type { RouterOutputs } from "api";
type FundWithSpent = RouterOutputs["fund"]["list"][number];
```

## Migration Commands

```bash
# Generate migration
pnpm --filter db drizzle-kit generate

# Push schema (dev)
pnpm --filter db drizzle-kit push

# Open studio
pnpm studio
```
