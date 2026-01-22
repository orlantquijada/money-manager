# External Integrations

**Analysis Date:** 2025-01-22

## APIs & External Services

**Authentication (Clerk):**
- Provider: Clerk
- Purpose: User authentication via OAuth (Apple, Google)
- Mobile SDK: `@clerk/clerk-expo` ^2.19.14
- Server SDK: `@clerk/backend` ^2.29.0
- Auth methods: Apple OAuth, Google OAuth
- Token handling: JWT verification on server, SecureStore on mobile

**Files:**
- `apps/mobile/src/app/_layout.tsx` - ClerkProvider setup
- `apps/mobile/src/app/sign-in.tsx` - SSO flow implementation
- `apps/mobile/src/lib/token-cache.ts` - SecureStore token persistence
- `packages/api/src/context.ts` - Server-side token verification

## Data Storage

**Databases:**
- PostgreSQL 17
- ORM: Drizzle ORM 0.44.7
- Client: `pg` 8.16.3
- Connection: `DATABASE_URL` env var
- Migrations: Drizzle Kit (`drizzle-kit`)

**Files:**
- `packages/db/src/client.ts` - Database connection
- `packages/db/src/schema.ts` - Schema definitions
- `packages/db/drizzle.config.ts` - Migration config

**Local Development:**
- Docker Compose available for local PostgreSQL
- `docker-compose.yaml` - PostgreSQL 17 service

**Mobile Storage:**
- `react-native-mmkv` - Fast key-value storage for preferences
- `expo-secure-store` - Encrypted storage for auth tokens

**Files:**
- `apps/mobile/src/stores/preferences.ts` - MMKV-backed Zustand store
- `apps/mobile/src/lib/token-cache.ts` - SecureStore implementation

**File Storage:**
- None configured (no cloud storage integration)

**Caching:**
- TanStack Query in-memory cache (5 min stale time, 30 min gc time)
- No external cache service

## Authentication & Identity

**Auth Provider:**
- Clerk (managed auth service)
- Implementation: OAuth 2.0 with PKCE
- Supported providers: Apple (iOS), Google (all platforms)

**Auth Flow:**
1. Mobile: `@clerk/clerk-expo` handles OAuth redirect
2. Token stored in `expo-secure-store` via `tokenCache`
3. Token synced to tRPC client via `authTokenStore`
4. Server: `@clerk/backend.verifyToken()` validates JWT
5. User ID extracted from `sub` claim

**Files:**
- `apps/mobile/src/hooks/use-auth-token-sync.ts` - Sync Clerk token to tRPC
- `apps/mobile/src/hooks/use-user-provisioning.ts` - Create user in DB on first sign-in

## API Communication

**tRPC:**
- Version: 11.7.x
- Transport: HTTP batch link with superjson transformer
- Base URL: `EXPO_PUBLIC_API_URL` env var
- Auth: Bearer token in Authorization header

**Files:**
- `apps/mobile/src/utils/api.tsx` - tRPC client setup
- `packages/api/index.ts` - Router exports
- `apps/server/src/index.ts` - Hono + tRPC server

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- `hono/logger` middleware on server
- `@trpc/client` logger link in development
- Console.log/error in application code

**Analytics:**
- None configured

## CI/CD & Deployment

**Mobile:**
- Platform: EAS Build (Expo Application Services)
- Config: `eas.json`
- Build profiles: development, preview, production
- Distribution: Internal (development/preview), App Store (production)

**Server:**
- Platform: Vercel
- Config: `apps/server/vercel.json`
- Build: `tsup` bundles to `api/index.js`
- Routing: All requests rewritten to `/api/index.js`

**CI Pipeline:**
- GitHub repository (`.github/` directory exists)
- No CI config detected in codebase

## Environment Configuration

**Required env vars:**
```
# Database
DATABASE_URL=postgresql://...

# Clerk (server)
CLERK_SECRET_KEY=sk_...

# Clerk (mobile)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# API
EXPO_PUBLIC_API_URL=https://...
CORS_ORIGIN=* (dev) or specific origins (prod)
```

**Secrets location:**
- Local: `.env` file (gitignored)
- Mobile: Environment variables embedded at build time
- Server: Vercel environment variables

## Webhooks & Callbacks

**Incoming:**
- None configured

**Outgoing:**
- None configured

## Third-Party SDKs

**Expo:**
- Project ID: `26201099-9a02-4cb0-9447-3856ed73f2aa`
- Owner: `orlantquijada`
- Bundle ID: `com.orlan.spaceduck.mobile`

**Native Modules Used:**
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `react-native-mmkv` - Storage
- `react-native-screens` - Native navigation
- `react-native-safe-area-context` - Safe area
- `react-native-svg` - Vector graphics
- `react-native-keyboard-controller` - Keyboard handling

## Future Integration Points

**Mentioned in codebase but not implemented:**
- AI Insights (`aiInsightsEnabled` preference exists but no AI service)

---

*Integration audit: 2025-01-22*
