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

## State Management (Progress Tracking)

Progress is tracked using two files:

1. **`.claude/status.json`** - Structured task status
   - Machine-readable JSON with task statuses ("todo", "in_progress", "done")
   - Update task status when completing features
   - Keep `currentFocus` accurate
   - Update `lastUpdated` timestamp

2. **`PROGRESS.md`** - Freeform progress notes
   - Add dated entries for significant progress
   - Document blockers and decisions
   - Keep "Current Session" section updated

3. **Git commits** - Use commits as checkpoints
   - Commit after completing meaningful chunks of work
   - Commit messages should reference what was completed

**When finishing a task:**
1. Update `.claude/status.json` (change task status to "done")
2. Add a note to `PROGRESS.md`
3. Prompt the user to commit the checkpoint

**Reference docs:**
- `PRD.md` - Product requirements (stable reference, rarely changes)
- `.claude/status.json` - Current task status (changes frequently)
- `PROGRESS.md` - Progress notes and context (changes frequently)

## Feature Specs (Ralph Loop)

For complex features, create detailed specs in `docs/specs/` optimized for [Ralph Loop](https://ghuntley.com/ralph/) iteration.

**When to create a spec:**
- Complexity: Multiple screens, >3 files, or multi-day work
- Uncertainty: Design/UX decisions need documenting before coding

**File structure per feature:**

1. **`{feature}.json`** - PRD with spec and acceptance criteria
   ```json
   {
     "feature": "Feature Name",
     "goal": "One sentence success criteria",
     "spec": {
       "overview": "What and why",
       "design": "Layouts, interactions (markdown)",
       "api": "Endpoints, contracts",
       "files": [{ "action": "create|modify", "path": "...", "purpose": "..." }]
     },
     "items": [{
       "id": "FEAT-001",
       "category": "API | UI Component | Integration",
       "description": "What this accomplishes",
       "steps_to_verify": ["Testable criterion 1"],
       "passes": false
     }]
   }
   ```

2. **`{feature}-progress.txt`** - Context and notes
   - Quick reference links to key files
   - Dated progress entries with `[FEAT-001]` IDs
   - Blockers and key decisions

**Ralph workflow:**
1. Read JSON, find items with `passes: false`
2. Implement highest priority incomplete item
3. Set `passes: true`, add entry to progress.txt
4. Commit (must pass types/tests)
5. Repeat until all items pass

**Lifecycle:** Delete spec files after feature merges (git preserves history).

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

```bash
pnpm dev                    # Start all workspaces (mobile + server)
pnpm studio                 # Open Drizzle Studio (database GUI)
pnpm lint && pnpm type-check # Lint and type-check all workspaces

# Database (run from packages/db)
pnpm generate               # Generate migrations from schema changes
pnpm push                   # Push schema to database (dev)
pnpm migrate                # Run migrations (production)
```

## Architecture

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

API routers by domain: `transaction.*`, `folder.*`, `fund.*`, `store.*`, `user.*`
- Client: `apps/mobile/src/utils/api.tsx` (uses `superjson` transformer)
- Server: `apps/server/src/index.ts` (Hono + tRPC, port 3000 dev)

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

**Uniwind** (Tailwind CSS v4 for React Native):
- Global styles: `apps/mobile/src/global.css`
- Uses `class-variance-authority` for component variants

**Conventions:**
- Use `StyledLeanView` and `StyledLeanText` from `apps/mobile/src/config/interop.ts` as the default view and text components
- When using `StyledLeanText` with `numberOfLines`, you **must** also add an `ellipsizeMode` prop (e.g., `ellipsizeMode="tail"`)
- Use `font-nunito-bold` for numeric/currency values (e.g., amounts, totals)

### Environment Variables

Loaded from `.env` in repository root: `DATABASE_URL` (required), `CORS_ORIGIN` (production)

### Deployment

Server deploys to Vercel (`apps/server/api/index.js` ESM bundle via `tsup`)

### Code Organization

**Feature folders** in `apps/mobile/src/components/`:
- `add-expense/` - Expense entry flow
- `transactions/` - Transaction list and details
- `budgets/` - Budget/fund management
- `ui/` - Shared UI primitives

**Utils vs Lib**:
- `src/utils/` - Low-level helpers (api client, colors, formatting)
- `src/lib/` - Business logic (auth, fund calculations, expense creation)

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
