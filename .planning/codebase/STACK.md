# Technology Stack

**Analysis Date:** 2025-01-22

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code across mobile, server, and packages

**Secondary:**
- JavaScript - Build configs (`babel.config.js`, `metro.config.js`)

## Runtime

**Environment:**
- Node.js 24 (via mise)
- React Native 0.81.5 (New Architecture enabled)

**Package Manager:**
- pnpm 10.26.0 (enforced via `preinstall` script)
- Lockfile: `pnpm-lock.yaml` present
- Workspace catalogs for shared dependency versions

## Frameworks

**Core:**
- Expo SDK 54 (`expo@~54.0.31`) - React Native tooling and native modules
- React 19.1.0 - UI library
- React Native 0.81.5 - Mobile framework
- Hono 4.10.7 - Lightweight HTTP server

**Routing:**
- Expo Router 6.0.21 - File-based routing for mobile (`apps/mobile/src/app/`)
- React Navigation 7.x - Navigation primitives

**Data:**
- tRPC 11.7.x - Type-safe API layer
- TanStack Query 5.90.x - Server state management
- Drizzle ORM 0.44.7 - Database ORM
- Zustand 5.0.9 - Client state management

**Styling:**
- Uniwind 1.2.2 - Tailwind CSS for React Native
- TailwindCSS 4.1.18 - Utility classes
- `tailwind-merge` + `clsx` + `class-variance-authority` - Class utilities

**Build/Dev:**
- Turborepo 2.7.4 - Monorepo task runner
- tsup 8.5.1 - TypeScript bundler (server)
- tsx 4.21.0 - TypeScript execution
- Biome 2.3.11 - Linting and formatting (via ultracite preset)

## Key Dependencies

**Critical:**
- `@clerk/clerk-expo` ^2.19.14 - Mobile authentication
- `@clerk/backend` ^2.29.0 - Server-side auth verification
- `drizzle-orm` 0.44.7 - PostgreSQL ORM
- `pg` 8.16.3 - PostgreSQL client
- `superjson` 2.2.6 - JSON serialization for tRPC

**UI/UX:**
- `@gorhom/bottom-sheet` ^5.2.8 - Bottom sheet modals
- `@shopify/flash-list` 2.0.2 - High-performance lists
- `react-native-reanimated` ~4.1.1 - Animations
- `react-native-gesture-handler` ~2.28.0 - Gesture handling
- `react-native-mmkv` ^4.1.0 - Fast key-value storage
- `expo-haptics` ~15.0.8 - Haptic feedback
- `expo-blur` / `expo-glass-effect` - iOS visual effects
- `d3-shape` ^3.2.0 - Chart/graph rendering

**Expo Modules:**
- `expo-secure-store` - Secure token storage
- `expo-router` - File-based routing
- `expo-image` - Optimized images
- `expo-linear-gradient` / `expo-mesh-gradient` - Gradient effects
- `expo-symbols` - SF Symbols support

## Monorepo Structure

**Workspaces:**
```
apps/
  mobile/     # Expo React Native app
  server/     # Hono + tRPC API server
packages/
  api/        # Shared tRPC router and types
  db/         # Drizzle schema and client
```

**Dependency Graph:**
- `mobile` depends on `api` (types only)
- `server` depends on `api` (router + context)
- `api` depends on `db` (schema + client)

## Configuration

**Environment:**
- Root `.env` file (gitignored)
- `@t3-oss/env-core` for typed env validation
- Required vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CORS_ORIGIN`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_API_URL`

**Build:**
- `turbo.json` - Task orchestration
- `biome.json` - Linting config (extends `ultracite/core`)
- `pnpm-workspace.yaml` - Workspace + catalog definitions

**Mobile-specific:**
- `app.json` - Expo config
- `metro.config.js` - Metro bundler with Uniwind
- `babel.config.js` - Babel preset expo
- `eas.json` - EAS Build configuration

## Platform Requirements

**Development:**
- macOS (iOS development)
- Node.js 24
- pnpm
- Docker (optional, for local PostgreSQL)

**Production:**
- Mobile: iOS (primary focus, `*.ios.tsx` for platform-specific)
- Server: Vercel (serverless functions)
- Database: PostgreSQL (any provider)

## Experimental Features

**React Native:**
- New Architecture enabled (`newArchEnabled: true`)
- React Compiler enabled (`experiments.reactCompiler: true`)
- Typed routes (`experiments.typedRoutes: true`)
- Display P3 color space (`expo-color-space-plugin`)

---

*Stack analysis: 2025-01-22*
