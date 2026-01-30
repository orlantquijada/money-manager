# Money Manager

Envelope budgeting app: The app helps users track expenses, manage budgets through "funds" organized in folders.

The vision is to create the best, prettiest, most user/beginner-friendly budgeting app in the world. Focus on budgeting + expense tracking + understanding finances.

## Essentials

- **Package manager:** pnpm only
- **Platform focus:** iOS (use `*.ios.tsx` for platform-specific)
- **Commands:** `pnpm dev` (start all), `pnpm lint && pnpm type-check`

## Tech Stack

**Monorepo**: Turborepo + pnpm workspaces
**Mobile** (`apps/mobile`): Expo SDK 54, React Native 0.81, React 19, Expo Router
**Backend** (`apps/server`): Hono + tRPC, Vercel
**Database** (`packages/db`): PostgreSQL + Drizzle ORM
**Styling**: Uniwind (Tailwind for RN)
**State**: Zustand (client), TanStack Query (server)

## Docs (read when relevant)

- [Architecture](docs/agents/architecture.md) - Data model, tRPC, navigation
- [iOS Native](docs/agents/ios-native.md) - SwiftUI, glass effects, haptics
- [Styling](docs/agents/styling.md) - Components, fonts, conventions
- [Database](docs/agents/database.md) - Schema changes, Drizzle workflow
- [Code Quality](docs/agents/code-quality.md) - Line limits, file size
- [Progress Tracking](docs/agents/progress-tracking.md) - Status files, commits
- [Feature Specs](docs/agents/feature-specs.md) - Ralph Loop workflow

## Plan Mode

- Make plans extremely concise. Sacrifice grammar for brevity.
- End each plan with unresolved questions, if any.
