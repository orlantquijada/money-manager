# Testing Patterns

**Analysis Date:** 2026-01-22

## Test Framework

**Runner:**
- Not configured - no test framework installed in project

**Status:**
- No test files exist in the codebase
- No Jest, Vitest, or other test runner configured
- No testing dependencies in any package.json

## Test File Organization

**Location:**
- Not applicable - no tests exist

**Naming:**
- Not established

**Recommended Structure (if tests are added):**
```
apps/mobile/src/
├── components/
│   └── button.tsx
│   └── __tests__/
│       └── button.test.tsx
├── hooks/
│   └── use-toggle.ts
│   └── __tests__/
│       └── use-toggle.test.ts
├── utils/
│   └── format.ts
│   └── __tests__/
│       └── format.test.ts
```

## Current Quality Assurance

**Type Checking:**
```bash
pnpm type-check         # Run tsc --noEmit across all packages
```
- TypeScript strict mode enabled
- strictNullChecks enabled

**Linting:**
```bash
pnpm lint               # Run biome check --write across all packages
```
- Biome with ultracite preset
- Runs formatting and linting in one pass

**Build Verification:**
```bash
pnpm build              # Build all packages
pnpm dev                # Start dev server for manual testing
```

## Test Types (Recommended)

**Unit Tests:**
- Utilities like `@/utils/format.ts`, `@/utils/cn.ts`
- Pure functions ideal for unit testing
- Hooks like `use-toggle.ts`

**Integration Tests:**
- tRPC router procedures in `packages/api/src/router/`
- Database operations via test database

**E2E Tests:**
- Not configured
- Consider Detox or Maestro for React Native E2E

## Mocking (Recommended Patterns)

**tRPC Mocks:**
```typescript
// Mock the tRPC client for component tests
jest.mock("@/utils/api", () => ({
  trpc: {
    transaction: {
      list: {
        queryOptions: jest.fn(),
      },
    },
  },
}));
```

**React Native Mocks:**
```typescript
// Mock Reanimated for Jest
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// Mock MMKV storage
jest.mock("react-native-mmkv", () => ({
  createMMKV: () => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  }),
}));
```

## Coverage

**Requirements:**
- None enforced - no coverage tooling configured

**Recommended:**
- Add when testing is implemented
- Focus on critical paths: transaction creation, fund calculations

## Manual Testing Workflow

**Current Approach:**
1. Run `pnpm dev` to start Expo dev server
2. Test on iOS simulator via Expo Go or dev build
3. Manual verification of features

**Dev Commands:**
```bash
pnpm dev                # Start all (mobile + server in parallel)
pnpm --filter mobile dev  # Start mobile only
pnpm --filter server dev  # Start server only
```

## Testing Gaps

**High Priority (Untested Areas):**
- `packages/api/src/router/transactions.ts` - complex business logic
- `packages/api/src/router/funds.ts` - budget calculations
- `apps/mobile/src/utils/format.ts` - currency formatting

**Medium Priority:**
- Hooks with complex state: `use-transactions.ts`, `use-folders-with-funds.ts`
- Animation utilities: `@/utils/motion.ts`

**Low Priority:**
- Simple presentational components
- Icons (SVG wrappers)

## Adding Tests (Future)

**Recommended Setup:**

1. Install Vitest for packages/api and packages/db:
```json
{
  "devDependencies": {
    "vitest": "^2.0.0"
  }
}
```

2. Install Jest + React Native Testing Library for mobile:
```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.0.0",
    "jest": "^29.0.0",
    "jest-expo": "~51.0.0"
  }
}
```

3. Add test scripts to turbo.json:
```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

---

*Testing analysis: 2026-01-22*
