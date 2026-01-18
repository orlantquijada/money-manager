# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Money Manager is an envelope budgeting application built as a monorepo with a React Native mobile app (Expo) and a tRPC server backend. The app helps users track expenses, manage budgets through "funds" organized in folders.

## Development Focus

**Current focus: iOS**. Development prioritizes iOS to streamline iteration without managing two platforms.

When building UI, prefer native iOS components and patterns:

- Use `@expo/ui` SwiftUI components where they provide a better native experience
- Apply liquid glass effects (`expo-glass-effect`) tastefully—not on every component
- See `docs/agent/ios-native.md` for detailed library reference

## Agent Docs

Task-specific workflows (read when relevant):

- `docs/agent/progress-tracking.md` - Status files, progress notes, and commit workflow
- `docs/agent/feature-specs.md` - Ralph Loop workflow for complex features
- `docs/specs/_template.json` - Feature spec JSON structure

## Tech Stack

- **Monorepo**: Turborepo with pnpm workspaces
- **Mobile App** (`apps/mobile`): Expo SDK 54, React Native 0.81, React 19, Expo Router
- **Backend** (`apps/server`): Hono + tRPC, deployed to Vercel
- **Database** (`packages/db`): PostgreSQL with Drizzle ORM
- **Styling**: Uniwind (Tailwind CSS for React Native)
- **State**: Zustand (client), TanStack Query (server), tRPC for data fetching

## Common Commands

```bash
pnpm dev                    # Start all workspaces (mobile + server)
pnpm studio                 # Open Drizzle Studio (database GUI)
pnpm lint && pnpm type-check # Lint and type-check all workspaces

# Database (run from packages/db)
pnpm generate               # Generate migrations from schema changes
pnpm push                   # Push schema to database (dev)
```

## Architecture

### Data Model

Envelope budgeting system: **Users** → **Folders** → **Funds** → **Transactions**

- Fund types: `SPENDING` or `NON_NEGOTIABLE`
- Time modes: `WEEKLY`, `MONTHLY`, `BIMONTHLY`, `EVENTUALLY`
- **Stores**: Merchants with last-used fund for quick selection

Relations defined in `packages/db/src/schema.ts`.

### tRPC Setup

Routers by domain: `transaction.*`, `folder.*`, `fund.*`, `store.*`, `user.*`

- Client: `apps/mobile/src/utils/api.tsx`
- Server: `apps/server/src/index.ts` (port 3000 dev)

### Mobile Navigation

Expo Router (file-based):

- `app/(app)/(tabs)/` - Bottom tabs: dashboard, add-expense, transactions, settings
- Modal routes via `app/modal.tsx`

### Styling Conventions

- Use `StyledLeanView` and `StyledLeanText` from `apps/mobile/src/config/interop.ts` as defaults
- With `numberOfLines`, always add `ellipsizeMode="tail"`
- Use `font-nunito-bold` for numeric/currency values

### Code Organization

**Feature folders** in `apps/mobile/src/components/`: `add-expense/`, `transactions/`, `budgets/`, `ui/`

- `src/utils/` - Low-level helpers (api, colors, formatting)
- `src/lib/` - Business logic (auth, fund calculations)

## Development Notes

- **Package manager**: pnpm only (enforced via preinstall script)
- **Catalog deps**: Common dependencies in `pnpm-workspace.yaml` `catalog:` section
- **React Compiler & New Architecture**: Enabled
- **Platform-specific**: Use `*.ios.tsx` extension
- **Schema changes**: Run `pnpm generate` then `pnpm push` (dev) or `pnpm migrate` (prod)
- **Currency formatting**: Use `Intl.NumberFormat` API

## Code Quality

### Checklist
Before marking work complete:
- Code readable, well-named
- Functions <50 lines
- Files <800 lines
- No deep nesting (>4 levels)
- No hardcoded values
- Many small files > few large files

### Principles
- Readability first—code is read more than written
- Self-documenting code over comments
- Extract common logic into functions
- Create reusable components
- Share utilities across modules

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
