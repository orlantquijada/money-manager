# Codebase Structure

**Analysis Date:** 2026-01-22

## Directory Layout

```
money-manager-2.0/
├── apps/
│   ├── mobile/              # Expo/React Native iOS app
│   └── server/              # Hono API server
├── packages/
│   ├── api/                 # tRPC routers and types
│   └── db/                  # Drizzle ORM schema and client
├── docs/                    # Agent documentation
├── tooling/                 # Shared tooling configs
├── .planning/               # GSD planning documents
├── turbo.json               # Turborepo task config
├── pnpm-workspace.yaml      # Workspace packages and catalog
└── package.json             # Root scripts
```

## Directory Purposes

**`apps/mobile/`:**
- Purpose: Expo SDK 54 React Native application for iOS
- Contains: Screens, components, hooks, stores, utilities
- Key files: `app.json`, `apps/mobile/src/app/_layout.tsx`

**`apps/mobile/src/app/`:**
- Purpose: Expo Router file-based navigation
- Contains: Layouts, screens organized by route groups
- Key files: `_layout.tsx` (root), `(app)/_layout.tsx` (authenticated), `sign-in.tsx`

**`apps/mobile/src/components/`:**
- Purpose: Reusable React Native components
- Contains: Feature components (by folder), shared UI components
- Key files: `theme-provider.tsx`, `glass-button.tsx`, feature folders

**`apps/mobile/src/hooks/`:**
- Purpose: Custom React hooks for data fetching and logic
- Contains: tRPC query wrappers, UI helpers, auth hooks
- Key files: `use-folders-with-funds.ts`, `use-auth-token-sync.ts`, `use-user-provisioning.ts`

**`apps/mobile/src/stores/`:**
- Purpose: Zustand stores for client-side state
- Contains: Persisted stores using MMKV
- Key files: `preferences.ts`, `recent-funds.ts`

**`apps/mobile/src/utils/`:**
- Purpose: Low-level utilities and helpers
- Contains: API client, colors, formatting, motion configs
- Key files: `api.tsx` (tRPC client), `colors.ts`, `format.ts`

**`apps/mobile/src/lib/`:**
- Purpose: Business logic and domain helpers
- Contains: Auth token store, fund calculations, add-expense logic
- Key files: `auth-token.ts`, `fund.ts`, `add-expense.ts`

**`apps/mobile/src/config/`:**
- Purpose: App-wide configuration
- Contains: Uniwind component interop setup
- Key files: `interop.ts`

**`apps/mobile/src/icons/`:**
- Purpose: Custom SVG icon components
- Contains: TSX icon components and source SVGs
- Key files: `index.ts` (barrel export), individual icon files

**`apps/server/`:**
- Purpose: Hono-based API server deployed to Vercel
- Contains: Server entry, environment config
- Key files: `src/index.ts`, `env.ts`, `vercel.json`

**`packages/api/`:**
- Purpose: Shared tRPC API layer
- Contains: Router definitions, context, type exports
- Key files: `index.ts`, `src/router/index.ts`, `src/trpc.ts`, `src/context.ts`

**`packages/api/src/router/`:**
- Purpose: Domain-specific tRPC routers
- Contains: One router per domain entity
- Key files: `transactions.ts`, `funds.ts`, `folders.ts`, `budget.ts`, `stores.ts`, `users.ts`

**`packages/db/`:**
- Purpose: Database schema and client
- Contains: Drizzle schema, migrations, seed data
- Key files: `src/schema.ts`, `src/client.ts`, `src/seed.ts`, `drizzle.config.ts`

## Key File Locations

**Entry Points:**
- `apps/mobile/src/app/_layout.tsx`: Mobile app root layout with providers
- `apps/server/src/index.ts`: Server entry point
- `packages/api/index.ts`: API package exports

**Configuration:**
- `apps/mobile/app.json`: Expo app config
- `apps/server/vercel.json`: Vercel deployment config
- `packages/db/drizzle.config.ts`: Drizzle Kit config
- `turbo.json`: Turborepo task definitions
- `pnpm-workspace.yaml`: Workspace packages and version catalog

**Core Logic:**
- `packages/api/src/router/transactions.ts`: Transaction CRUD and statistics
- `packages/api/src/router/funds.ts`: Fund management
- `packages/api/src/router/budget.ts`: Budget alerts
- `packages/db/src/schema.ts`: Database schema definitions

**Testing:**
- No test files detected in current codebase

## Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `glass-button.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-folders-with-funds.ts`)
- Stores: `kebab-case.ts` (e.g., `preferences.ts`)
- Routes: `kebab-case.tsx` or `[param].tsx` for dynamic routes

**Directories:**
- Route groups: `(group-name)` (e.g., `(app)`, `(tabs)`, `(main)`)
- Feature folders: `kebab-case` (e.g., `add-expense`, `create-fund`)

**Platform-Specific:**
- iOS-specific: `*.ios.tsx` (e.g., `glass-button.ios.tsx`, `date-selector.ios.tsx`)
- Default/fallback: `*.tsx` (same name without platform suffix)

## Where to Add New Code

**New Screen:**
- Authenticated screen: `apps/mobile/src/app/(app)/[screen-name].tsx`
- Tab screen: `apps/mobile/src/app/(app)/(tabs)/(main)/[screen-name].tsx`
- Modal: Add `<Stack.Screen>` in `apps/mobile/src/app/(app)/_layout.tsx`

**New Component:**
- Feature-specific: `apps/mobile/src/components/[feature]/[component].tsx`
- Shared UI: `apps/mobile/src/components/ui/[component].tsx`
- With iOS variant: Create both `[component].tsx` and `[component].ios.tsx`

**New Hook:**
- Data fetching: `apps/mobile/src/hooks/use-[entity].ts`
- UI behavior: `apps/mobile/src/hooks/use-[behavior].ts`

**New API Endpoint:**
- Add procedure to existing router: `packages/api/src/router/[domain].ts`
- New domain router: Create `packages/api/src/router/[domain].ts`, add to `packages/api/src/router/index.ts`

**New Database Table:**
- Define table in `packages/db/src/schema.ts`
- Add relations in same file
- Run `pnpm --filter db generate` then `pnpm --filter db push`

**New Store:**
- Zustand store: `apps/mobile/src/stores/[store-name].ts`
- Use MMKV for persistence (see `preferences.ts` pattern)

**New Utility:**
- Low-level helper: `apps/mobile/src/utils/[name].ts`
- Business logic: `apps/mobile/src/lib/[name].ts`

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and codebase documentation
- Generated: By GSD commands
- Committed: Yes

**`.expo/`:**
- Purpose: Expo development cache
- Generated: Yes
- Committed: No (gitignored)

**`.turbo/`:**
- Purpose: Turborepo cache
- Generated: Yes
- Committed: No (gitignored)

**`packages/db/drizzle/`:**
- Purpose: Drizzle migrations
- Generated: By `pnpm --filter db generate`
- Committed: Yes

**`apps/mobile/ios/` and `apps/mobile/android/`:**
- Purpose: Native project files
- Generated: By `expo prebuild`
- Committed: Yes (for native module configuration)

---

*Structure analysis: 2026-01-22*
