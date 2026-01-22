# Architecture

**Analysis Date:** 2026-01-22

## Pattern Overview

**Overall:** Monorepo with Layered Client-Server Architecture

**Key Characteristics:**
- Turborepo monorepo with pnpm workspaces
- Type-safe API layer via tRPC connecting mobile client to Hono server
- Shared packages for API types (`packages/api`) and database schema (`packages/db`)
- Domain-driven router organization on the backend
- Feature-based component organization on the frontend

## Layers

**Mobile App (`apps/mobile`):**
- Purpose: React Native/Expo iOS application
- Location: `apps/mobile/src/`
- Contains: Screens (Expo Router), components, hooks, stores, utilities
- Depends on: `packages/api` (types only), Clerk auth, tRPC client
- Used by: End users via iOS app

**Server (`apps/server`):**
- Purpose: API server handling tRPC requests
- Location: `apps/server/src/`
- Contains: Hono app setup, tRPC router mounting, auth middleware
- Depends on: `packages/api`, Hono, Clerk backend
- Used by: Mobile app via HTTP

**API Package (`packages/api`):**
- Purpose: Shared tRPC router definitions and type exports
- Location: `packages/api/src/`
- Contains: tRPC routers, context creation, procedure definitions
- Depends on: `packages/db`, Clerk, Zod
- Used by: `apps/server` (runtime), `apps/mobile` (types)

**Database Package (`packages/db`):**
- Purpose: PostgreSQL schema and Drizzle ORM client
- Location: `packages/db/src/`
- Contains: Schema definitions, relations, DB client, seed scripts
- Depends on: Drizzle ORM, pg driver
- Used by: `packages/api`

## Data Flow

**User Request Flow:**

1. User action in mobile app triggers tRPC query/mutation
2. `apps/mobile/src/utils/api.tsx` tRPC client sends HTTP request with auth token
3. `apps/server/src/index.ts` Hono server receives request
4. Auth token extracted and verified via Clerk in `packages/api/src/context.ts`
5. tRPC router in `packages/api/src/router/` handles business logic
6. Drizzle ORM queries PostgreSQL via `packages/db/src/client.ts`
7. Response flows back through tRPC to mobile app
8. TanStack Query caches response in `queryClient`

**Authentication Flow:**

1. User signs in via Clerk in `apps/mobile/src/app/sign-in.tsx`
2. `useAuthTokenSync` hook syncs Clerk token to `authTokenStore` (`apps/mobile/src/lib/auth-token.ts`)
3. `useUserProvisioning` hook ensures user exists in DB (`apps/mobile/src/hooks/use-user-provisioning.ts`)
4. Protected routes gated by `isAuthenticated` in `apps/mobile/src/app/_layout.tsx`
5. tRPC client attaches token to all requests via headers

**State Management:**
- Server state: TanStack Query with tRPC integration
- Client state: Zustand stores with MMKV persistence (`apps/mobile/src/stores/`)
- Auth state: Clerk provider + local token store

## Key Abstractions

**tRPC Routers:**
- Purpose: Domain-specific API endpoints
- Examples: `packages/api/src/router/transactions.ts`, `packages/api/src/router/funds.ts`
- Pattern: `protectedProcedure` for auth-required endpoints, `publicProcedure` for open endpoints

**Database Schema:**
- Purpose: PostgreSQL tables with Drizzle ORM
- Examples: `packages/db/src/schema.ts` defines users, folders, funds, stores, transactions
- Pattern: Relations defined separately, auto-generated IDs via cuid2 or identity columns

**React Hooks:**
- Purpose: Encapsulate data fetching and business logic
- Examples: `apps/mobile/src/hooks/use-folders-with-funds.ts`, `apps/mobile/src/hooks/use-transactions.ts`
- Pattern: Wrap tRPC queries with `useQuery`, add data transformations via `select`

**Styled Components:**
- Purpose: Uniwind-enhanced components for consistent styling
- Examples: `apps/mobile/src/config/interop.ts` exports `StyledLeanView`, `StyledLeanText`
- Pattern: `withUniwind()` wrapper enables Tailwind-like className props

## Entry Points

**Mobile App:**
- Location: `apps/mobile/src/app/_layout.tsx`
- Triggers: App launch
- Responsibilities: Provider setup (Clerk, QueryClient, Gesture, Keyboard), auth routing

**Server:**
- Location: `apps/server/src/index.ts`
- Triggers: HTTP requests to `/trpc/*`
- Responsibilities: CORS, logging, tRPC router mounting, auth context creation

**Database:**
- Location: `packages/db/src/client.ts`
- Triggers: Import from `db/client`
- Responsibilities: Initialize Drizzle ORM with schema and connection

## Error Handling

**Strategy:** tRPC error codes with Zod validation

**Patterns:**
- Zod schemas validate all tRPC inputs; errors formatted in `packages/api/src/trpc.ts`
- `TRPCError` with `UNAUTHORIZED` code for auth failures
- Database errors propagate through tRPC error response

## Cross-Cutting Concerns

**Logging:** Hono `logger()` middleware on server; tRPC `loggerLink` on client (dev only)

**Validation:** Zod schemas on all tRPC procedure inputs

**Authentication:** Clerk tokens verified in tRPC context; `protectedProcedure` middleware enforces auth

**Date Handling:** `date-fns` for period calculations (month boundaries, comparisons)

---

*Architecture analysis: 2026-01-22*
