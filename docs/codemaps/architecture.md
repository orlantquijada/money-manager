<!-- Generated: 2026-01-19 -->

# Architecture Codemap

## Monorepo Layout

```
money-manager-2.0/
├── apps/
│   ├── mobile/          # Expo/React Native app (iOS focus)
│   └── server/          # Hono + tRPC API server
├── packages/
│   ├── api/             # tRPC router definitions
│   └── db/              # Drizzle ORM schema + client
├── docs/                # Documentation
├── tooling/             # Build tooling configs
└── skills/              # Claude Code skills
```

## Workspace Configuration

**pnpm-workspace.yaml**:
- `apps/*` - Mobile and server apps
- `packages/api` - Shared API router
- `packages/db` - Database package
- `packages/config/*` - Shared configs

## Key Dependencies (catalog)

| Package | Version | Purpose |
|---------|---------|---------|
| drizzle-orm | 0.44.7 | Database ORM |
| @trpc/server | 11.7.1 | API framework |
| @tanstack/react-query | 5.90.11 | Data fetching |
| zod | 4.1.13 | Schema validation |
| superjson | 2.2.6 | tRPC transformer |

## Entry Points

| App | Entry | Purpose |
|-----|-------|---------|
| mobile | `apps/mobile/src/app/_layout.tsx` | Root layout with providers |
| server | `apps/server/src/index.ts` | Hono server with tRPC |
| api | `packages/api/index.ts` | Router exports |
| db | `packages/db/src/client.ts` | Drizzle client |

## Build Commands

```bash
pnpm dev          # Start all apps (turbo parallel)
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm type-check   # Type check all packages
pnpm studio       # Open Drizzle Studio
```

## Turbo Tasks

| Task | Dependencies | Outputs |
|------|--------------|---------|
| dev | ^dev | (no cache) |
| build | ^build | .expo/**, dist/**, api/** |
| lint | ^topo, ^build | - |
| type-check | ^topo, ^build | .cache/tsbuildinfo.json |
