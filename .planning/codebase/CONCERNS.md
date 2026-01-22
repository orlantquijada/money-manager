# Codebase Concerns

**Analysis Date:** 2026-01-22

## Tech Debt

**TARGET FundType Disabled:**
- Issue: FundType `TARGET` is commented out awaiting restoration
- Files: `packages/api/src/utils/enums.ts` (line 6-7)
- Impact: Goal-based savings funds not available to users
- Fix approach: Uncomment in schema enum and API enums, add UI support in create-fund flow

**Transaction Edit Not Implemented:**
- Issue: Edit functionality shows "coming soon" alert instead of working
- Files: `apps/mobile/src/app/(app)/transaction/[id].tsx` (line 36-37)
- Impact: Users cannot edit transaction details after creation
- Fix approach: Create edit transaction screen/modal, add update mutation to transactions router

**Design Toggle in Production Code:**
- Issue: `EMPHASIZE_AMOUNT` toggle left in transaction detail screen
- Files: `apps/mobile/src/app/(app)/transaction/[id].tsx` (line 13)
- Impact: Dead code path; unclear which design is final
- Fix approach: Make design decision and remove unused branch

**Broad Query Invalidation:**
- Issue: Multiple places call `queryClient.invalidateQueries()` without keys, invalidating entire cache
- Files:
  - `apps/mobile/src/app/(app)/fund/[id]/index.tsx` (lines 321, 347, 357)
  - `apps/mobile/src/app/(app)/transaction/[id].tsx` (line 28)
- Impact: Unnecessary refetches, potential performance degradation, poor offline experience
- Fix approach: Use targeted invalidation with specific query keys (e.g., `trpc.fund.pathFilter()`)

**iOS-Only ActionSheetIOS Usage:**
- Issue: ActionSheetIOS used directly without cross-platform fallback
- Files:
  - `apps/mobile/src/app/(app)/settings.tsx`
  - `apps/mobile/src/app/(app)/fund/[id]/index.tsx`
- Impact: App is iOS-focused, but code would crash on Android
- Fix approach: Either enforce iOS-only via CLAUDE.md guidance or wrap with Platform checks / use cross-platform alternative

## Known Bugs

**None identified in this analysis.**

## Security Considerations

**Auth Token in Module-Level Variable:**
- Risk: Auth token stored in plain module variable, could be accessed by any code
- Files: `apps/mobile/src/lib/auth-token.ts`
- Current mitigation: Token is transient (memory only), cleared on app restart
- Recommendations: Consider if this is necessary vs. reading from SecureStore each time; ensure token is cleared on logout

**CLERK_SECRET_KEY Missing Warning:**
- Risk: Server proceeds with null userId if CLERK_SECRET_KEY not set, logging warning only
- Files: `packages/api/src/context.ts` (lines 19-21)
- Current mitigation: Protected procedures throw UNAUTHORIZED error when userId is null
- Recommendations: Consider failing fast in non-dev environments if CLERK_SECRET_KEY missing

**User Data Export:**
- Risk: Export data endpoint returns all user data as JSON; large datasets could timeout
- Files: `apps/mobile/src/app/(app)/settings.tsx` (handleExportData)
- Current mitigation: None
- Recommendations: Add pagination or streaming for large exports; consider background job

## Performance Bottlenecks

**Large Files (Code Complexity):**
- Problem: Several files exceed recommended size limits
- Files:
  - `packages/db/src/seed.ts`: 969 lines (seed data, acceptable)
  - `apps/mobile/src/app/(app)/settings.tsx`: 717 lines
  - `apps/mobile/src/app/(app)/fund/[id]/index.tsx`: 598 lines
  - `packages/api/src/router/transactions.ts`: 577 lines
- Cause: Settings screen has many sections that could be split; fund detail has multiple stat components inline
- Improvement path: Extract settings sections to separate files; move stat components (`SpendingStats`, `NonNegotiableStats`, `EventuallyStats`) to components folder

**Monthly Spent Calculation on Fund List:**
- Problem: Fund list calculates total spent for ALL funds every call
- Files: `packages/api/src/router/funds.ts` (lines 62-78)
- Cause: Aggregate query runs on every fund list fetch
- Improvement path: Consider caching monthly totals or computing in background; acceptable for now with small datasets

**Transaction List Period Filtering Client-Side:**
- Problem: Search filtering happens client-side after fetching full period
- Files: `apps/mobile/src/app/(app)/(tabs)/(main)/transactions/index.tsx` (line 63-66)
- Cause: Local search on already-fetched data (acceptable pattern)
- Improvement path: Current approach is fine; server-side search only needed for very large datasets

## Fragile Areas

**Time Mode Budget Calculations:**
- Files:
  - `apps/mobile/src/app/(app)/fund/[id]/index.tsx` (getDaysUntilReset, getPeriodStart, isPaidInCurrentPeriod)
  - `packages/api/src/router/transactions.ts` (timeModeMultipliers in markAsPaid)
  - `apps/mobile/src/lib/fund.tsx` (getTimeModeMultiplier)
- Why fragile: Time mode calculation logic duplicated between frontend and backend; adding new time modes requires changes in multiple places
- Safe modification: Update all locations simultaneously; add integration tests
- Test coverage: No tests exist for time mode calculations

**Cursor-Based Pagination:**
- Files:
  - `packages/api/src/router/transactions.ts` (listByFund, list)
- Why fragile: Base64-encoded JSON cursors with date+id; malformed cursor could crash
- Safe modification: Add try/catch around cursor parsing
- Test coverage: No pagination edge case tests

## Scaling Limits

**Transaction Volume:**
- Current capacity: Queries optimized for hundreds of transactions per fund/period
- Limit: Database index exists on `(fundId, date)` which helps
- Scaling path: Add indexes on userId+date; consider materialized views for stats

**Fund/Folder Count:**
- Current capacity: Nested loop in fund picker iterates all folders/funds
- Limit: Performance degrades with 50+ folders or 500+ funds
- Scaling path: Add search/filter to fund picker; consider virtualized list for large datasets

## Dependencies at Risk

**None identified** - Dependencies appear well-maintained and commonly used.

## Missing Critical Features

**No Test Coverage:**
- Problem: Zero test files in apps/ or packages/ directories
- Blocks: Confidence in refactoring; regression detection; CI quality gates
- Files: No `*.test.*` or `*.spec.*` files found outside node_modules

**No Error Boundaries:**
- Problem: No React error boundaries found in mobile app
- Blocks: Graceful error recovery; user-friendly crash handling
- Files: Should add to `apps/mobile/src/app/_layout.tsx`

**No Offline Support:**
- Problem: App relies on network for all data; no optimistic updates or offline queue
- Blocks: Poor UX in unreliable network conditions
- Files: TanStack Query configured but no offline mutation handling

## Test Coverage Gaps

**All Business Logic Untested:**
- What's not tested: Transaction creation, fund CRUD, budget calculations, time mode logic, stats aggregation
- Files:
  - `packages/api/src/router/transactions.ts`
  - `packages/api/src/router/funds.ts`
  - `apps/mobile/src/lib/fund.tsx`
- Risk: Regressions in budget calculations could go unnoticed; time mode edge cases (month boundaries, DST) unknown
- Priority: High - critical financial calculations

**Auth Flow Untested:**
- What's not tested: Token verification, protected procedure guards, sign-in flows
- Files:
  - `packages/api/src/context.ts`
  - `packages/api/src/trpc.ts`
  - `apps/mobile/src/app/sign-in.tsx`
- Risk: Auth bypass or token handling bugs could expose user data
- Priority: High - security critical

**Component Rendering Untested:**
- What's not tested: All React components, especially complex ones like pie chart
- Files:
  - `apps/mobile/src/components/stats/pie-chart-segmented.tsx`
  - `apps/mobile/src/components/add-expense/fund-picker-sheet.tsx`
- Risk: UI regressions; animation bugs
- Priority: Medium - visual issues are noticeable to users

---

*Concerns audit: 2026-01-22*
