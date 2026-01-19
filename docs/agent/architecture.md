# Architecture

## Data Model

Envelope budgeting system: **Users** → **Folders** → **Funds** → **Transactions**

- **Fund types**: `SPENDING` or `NON_NEGOTIABLE`
- **Time modes**: `WEEKLY`, `MONTHLY`, `BIMONTHLY`, `EVENTUALLY`
- **Stores**: Merchants with last-used fund for quick selection

Relations: `packages/db/src/schema.ts`

## tRPC Setup

Routers by domain: `transaction.*`, `folder.*`, `fund.*`, `store.*`, `user.*`

| Location | Path |
|----------|------|
| Client | `apps/mobile/src/utils/api.tsx` |
| Server | `apps/server/src/index.ts` (port 3000 dev) |

## Navigation

Expo Router (file-based):

- `app/(app)/(tabs)/` - Bottom tabs: dashboard, add-expense, transactions, settings
- Modal routes via `app/modal.tsx`

## Code Organization

Feature folders in `apps/mobile/src/components/`:
- `add-expense/`
- `transactions/`
- `budgets/`
- `ui/`

| Directory | Purpose |
|-----------|---------|
| `src/utils/` | Low-level helpers (api, colors, formatting) |
| `src/lib/` | Business logic (auth, fund calculations) |
