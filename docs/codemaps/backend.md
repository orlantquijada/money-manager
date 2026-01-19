<!-- Generated: 2026-01-19 -->

# Backend Codemap

## Package Structure

```
packages/api/
├── index.ts                 # Main exports
└── src/
    ├── context.ts           # tRPC context (auth, db)
    ├── trpc.ts              # Router/procedure setup
    ├── router/
    │   ├── index.ts         # AppRouter composition
    │   ├── budget.ts        # Budget alerts
    │   ├── folders.ts       # Folder CRUD
    │   ├── funds.ts         # Fund CRUD + spending
    │   ├── stores.ts        # Store listing
    │   ├── transactions.ts  # Transaction CRUD + stats
    │   └── users.ts         # User provisioning
    └── utils/
        ├── types.ts         # Shared types
        └── enums.ts         # Zod enum schemas
```

```
apps/server/
├── src/
│   └── index.ts             # Hono app + tRPC middleware
├── env.ts                   # Environment validation
└── tsup.config.ts           # Build config
```

## API Exports (`packages/api/index.ts`)

```typescript
export { appRouter } from "./src/router";
export * from "./src/utils/types";
export type { RouterInputs, RouterOutputs, AppRouter };
export { createTRPCContext } from "./src/context";
```

## Server Setup (`apps/server/src/index.ts`)

- Hono server with CORS, logging middleware
- tRPC server at `/trpc/*`
- Health check at `/ping`
- Clerk JWT verification in context

## tRPC Context

```typescript
// Creates context with auth and database
createTRPCContext({ authToken }) => { db, userId }
```

## Procedure Types

| Type | Auth | Use Case |
|------|------|----------|
| `publicProcedure` | None | Public endpoints |
| `protectedProcedure` | Required | User-scoped data |

## Router: `transaction`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `all` | query | - | All user transactions |
| `recentByFund` | query | `number` (fundId) | Last 10 transactions for fund |
| `listByFund` | query | `{fundId, cursor?, limit?}` | Paginated fund transactions |
| `allThisMonth` | query | `{fundId?}` | Current month transactions |
| `allLast7Days` | query | - | Last 7 days transactions |
| `retrieve` | query | `string` (id) | Single transaction |
| `create` | mutation | `{fundId, amount, date?, note?, store?}` | Create transaction + store |
| `delete` | mutation | `string` (id) | Delete transaction |
| `markAsPaid` | mutation | `{fundId}` | Mark fund as paid (creates txn) |
| `totalThisMonth` | query | - | Sum of current month |
| `totalLastMonth` | query | - | Sum of previous month |
| `byFund` | query | `number?` (limit) | Spending grouped by fund |
| `countByFund` | query | - | Transaction count per fund |
| `stats` | query | `{period}` | Stats with comparison |
| `list` | query | `{period, cursor?, limit?}` | Paginated by period |

## Router: `fund`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `hello` | query | - | Health check |
| `create` | mutation | `{name, budgetedAmount, fundType, folderId, timeMode}` | Create fund |
| `list` | query | - | All funds with monthly spent |
| `retrieve` | query | `number` (id) | Fund with current spending |
| `update` | mutation | `{id, name?, enabled?}` | Update fund |
| `delete` | mutation | `number` (id) | Delete fund |

## Router: `folder`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `create` | mutation | `{name}` | Create folder |
| `remove` | mutation | `number` (id) | Delete folder |
| `listWithFunds` | query | `{startDate?, endDate?}` | Folders with funds + spending |
| `list` | query | - | All folders |

## Router: `store`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `list` | query | - | All stores with last fund |

## Router: `user`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `ensureUser` | mutation | `{name?}` | Upsert user on sign-in |
| `create` | mutation | `{id, name?}` | Create user (public) |
| `remove` | mutation | - | Delete current user |

## Router: `budget`

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `alerts` | query | - | Budget alerts (>90% or >100%) |

## Key Types

```typescript
type Period = "week" | "month" | "3mo" | "all";
type FundType = "SPENDING" | "NON_NEGOTIABLE";
type TimeMode = "WEEKLY" | "MONTHLY" | "BIMONTHLY" | "EVENTUALLY";
type AlertType = "over_budget" | "almost_over";
```
