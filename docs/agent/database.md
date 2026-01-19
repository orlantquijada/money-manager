# Database

PostgreSQL with Drizzle ORM.

## Key Files

- Schema: `packages/db/src/schema.ts`
- Migrations: `packages/db/drizzle/`

## Commands (run from `packages/db`)

```bash
pnpm generate    # Generate migrations from schema changes
pnpm push        # Push schema to database (dev)
pnpm migrate     # Run migrations (prod)
pnpm studio      # Open Drizzle Studio (database GUI)
```

## Workflow

**Development**: `pnpm generate` → `pnpm push`

**Production**: `pnpm generate` → `pnpm migrate`
