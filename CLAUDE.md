# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Money Manager is an envelope budgeting application built as a monorepo with a React Native mobile app (Expo) and a tRPC server backend. The app helps users track expenses, manage budgets through "funds" organized in folders, and follows the envelope budgeting system.

## Development Focus

**Current focus: iOS**. Development prioritizes iOS to streamline iteration without managing two platforms. Cross-platform code is maintained but new features target iOS first.

When building UI, prefer native iOS components and patterns:
- Use `@expo/ui` SwiftUI components where they provide a better native experience
- Apply liquid glass effects (`expo-glass-effect`) tastefully—not on every component
- Use SF Symbols (`expo-symbols`) for icons where appropriate
- Add haptic feedback (`expo-haptics`) for meaningful interactions

## Tech Stack

- **Monorepo Management**: Turborepo with pnpm workspaces
- **Mobile App** (`apps/mobile`): Expo SDK 54, React Native 0.81, React 19, Expo Router (file-based routing)
- **Backend** (`apps/server`): Hono server with tRPC endpoints, deployed to Vercel
- **API Layer** (`packages/api`): tRPC v11 router definitions
- **Database** (`packages/db`): PostgreSQL with Drizzle ORM
- **Styling**: Uniwind (Tailwind CSS for React Native, recently migrated from Nativewind)
- **State Management**: Zustand for client state, TanStack Query for server state
- **Data Fetching**: tRPC with TanStack React Query

## Common Commands

### Development
```bash
# Install dependencies (required: pnpm)
pnpm install

# Start all workspaces in development mode (parallel)
pnpm dev

# Start only mobile app
cd apps/mobile && pnpm dev

# Start only server
cd apps/server && pnpm dev

# Open Drizzle Studio (database GUI)
pnpm studio
```

### Building
```bash
# Build all workspaces
pnpm build

# Build only server (for deployment)
pnpm build:server

# Clean mobile prebuild artifacts
cd apps/mobile && pnpm prebuild:clean
```

### Database
```bash
# Generate migration files from schema changes
cd packages/db && pnpm generate

# Push schema changes to database (development)
cd packages/db && pnpm push

# Run migrations
cd packages/db && pnpm migrate

# Seed database
cd packages/db && pnpm seed

# Open Drizzle Studio
cd packages/db && pnpm studio
# Or from root: pnpm studio
```

### Linting & Type Checking
```bash
# Lint all workspaces (uses Biome with ultracite config)
pnpm lint

# Check workspace dependencies
pnpm lint:ws

# Type check all workspaces
pnpm type-check
```

### Cleaning
```bash
# Clean root node_modules
pnpm clean

# Clean all workspaces (removes node_modules, .turbo, dist, etc.)
pnpm clean:ws
```

## Architecture

### Monorepo Structure

```
apps/
  mobile/          - Expo React Native app
    src/
      app/         - Expo Router file-based routes
        (app)/     - Authenticated routes group
          (tabs)/  - Bottom tab navigation
      components/  - React components organized by feature
      utils/       - Utility functions including tRPC client setup
      hooks/       - Custom React hooks
      stores/      - Zustand stores
      icons/       - SVG icon components
      lib/         - Business logic and helpers
  server/          - Hono + tRPC API server
    src/
      index.ts     - Server entry point with Hono setup

packages/
  api/             - Shared tRPC API definitions
    src/
      router/      - tRPC routers by domain (folders, funds, transactions, stores, users)
      context.ts   - tRPC context creation
      trpc.ts      - tRPC instance configuration
  db/              - Database layer
    src/
      schema.ts    - Drizzle schema definitions
      client.ts    - Database client
```

### Data Model

The app follows an envelope budgeting system:
- **Users**: Top-level entity
- **Folders**: Organizational containers for funds (e.g., "Monthly Bills", "Entertainment")
- **Funds**: Individual budget envelopes with budgeted amounts
  - Types: `SPENDING` or `NON_NEGOTIABLE`
  - Time modes: `WEEKLY`, `MONTHLY`, `BIMONTHLY`, `EVENTUALLY`
  - Each fund has a budgeted amount and tracks spent amount via transactions
- **Transactions**: Expense records linked to a fund and optionally a store
- **Stores**: Merchant/vendor names with last-used fund for quick selection

Relations are defined in `packages/db/src/schema.ts` using Drizzle's relational query system.

### tRPC Setup

The tRPC API is organized by domain:
- `transaction.*` - Create, list, update, delete transactions
- `folder.*` - Manage folders and their funds
- `fund.*` - CRUD operations for budget funds
- `store.*` - Store/merchant management
- `user.*` - User operations

**Client setup** (`apps/mobile/src/utils/api.tsx`):
- Uses `createTRPCOptionsProxy` for type-safe queries and mutations
- Configured with `superjson` transformer for Date/Map/Set support
- HTTP batch link for request batching
- Headers include `x-trpc-source: expo-react`

**Server setup** (`apps/server/src/index.ts`):
- Hono server with `@hono/trpc-server` adapter
- CORS enabled (configured via `CORS_ORIGIN` env var)
- Dev mode runs on port 3000, production deploys to Vercel

### Mobile App Navigation

Uses Expo Router (file-based routing):
- `app/_layout.tsx` - Root layout with theme provider and tRPC provider
- `app/(app)/` - Authenticated routes group
  - `app/(app)/(tabs)/` - Bottom tab navigation
    - `(dashboard)/` - Budget dashboard and fund management
    - `add-expense.tsx` - Quick expense entry
    - `transactions.tsx` - Transaction history
    - `hello.tsx` - Settings/profile tab
- Modal routes handled via `app/modal.tsx`

### Styling

Recently migrated from Nativewind to **Uniwind** (Tailwind CSS v4 for React Native):
- Global styles in `apps/mobile/src/global.css`
- Dark mode and light mode supported via theme system
- Type definitions in `apps/mobile/uniwind-types.d.ts`
- Uses `class-variance-authority` for component variants

**Uniwind Component Conventions:**
- Use `StyledLeanView` and `StyledLeanText` from `apps/mobile/src/components/interop.ts` as the default view and text components
- When using `StyledLeanText` with `numberOfLines`, you **must** also add an `ellipsizeMode` prop (e.g., `ellipsizeMode="tail"`)
- Use `font-nunito-bold` for numeric/currency values (e.g., amounts, totals)

### Environment Variables

Environment variables are loaded from `.env` in the repository root:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `CORS_ORIGIN` - CORS origin for server (production)
- Commands use `dotenv-cli` to load: `pnpm with-env <command>`

### Deployment

Server deploys to Vercel:
- Build artifact: `apps/server/api/index.js` (ESM bundle)
- Uses `tsup` to bundle server + API + db packages into single file
- Vercel config in `.vercel/` directory

## Development Notes

### Package Manager
This repository uses **pnpm** exclusively. A preinstall script enforces this.

### Catalog Dependencies
Common dependencies are centralized in `pnpm-workspace.yaml` under the `catalog:` section. Reference them in package.json with `"package": "catalog:"`.

### Turborepo Tasks
Tasks are defined in `turbo.json`:
- Most tasks depend on `^topo` (topological build order)
- `dev` and `clean` tasks don't use cache
- Global env vars like `DATABASE_URL` are declared for cache invalidation

### Mobile App Features
- **React Compiler**: Enabled in `app.json` experiments
- **New Architecture**: React Native new architecture enabled
- **Typed Routes**: Expo Router typed routes enabled
- **Edge-to-edge**: Android edge-to-edge display enabled
- Key libraries: `@gorhom/bottom-sheet`, `@shopify/flash-list`, `react-native-reanimated`, `react-native-gesture-handler`

### iOS Native Features
Platform-specific components use the `*.ios.tsx` file extension (e.g., `date-selector.ios.tsx`).

**Available iOS libraries:**
- **`@expo/ui`**: SwiftUI components—`Button` (with `glassProminent` variant), `DateTimePicker`, `Picker`, `Switch`, `TextField`, `ContextMenu`, `BottomSheet`, layout components (`VStack`, `HStack`), and modifiers like `glassEffect()`
- **`expo-glass-effect`**: `GlassView` and `GlassContainer` for liquid glass/frosted glass effects
- **`expo-symbols`**: SF Symbols via `SymbolView` component
- **`expo-haptics`**: Haptic feedback for tactile interactions

**Usage guidelines:**
- Use SwiftUI components for pickers, date selectors, and context menus—they feel native
- Apply glass effects to key interactive elements (tab bars, floating buttons), not every surface
- Use SF Symbols for system-style icons; keep custom icons for brand elements
- Add haptics to meaningful actions (tab changes, confirmations), not every tap

### Database Schema Changes
When modifying `packages/db/src/schema.ts`:
1. Run `pnpm generate` to create migration files
2. Run `pnpm push` to apply changes (dev) or `pnpm migrate` (production)
3. The schema uses `snake_case` for database column names (configured in drizzle.config.ts)

### Currency & Number Formatting
Use the `Intl.NumberFormat` API to render currency amounts in the UI. This provides:
- Locale-aware formatting
- Proper currency symbols
- Correct decimal places and grouping
- Native support across all platforms

Example:
```typescript
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

formatter.format(amount); // "$1,234.56"
```

If appropriate, you may create or refactor a shared currency formatter utility to encapsulate this logic and provide a consistent API across the application.
