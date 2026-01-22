# Coding Conventions

**Analysis Date:** 2026-01-22

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` (e.g., `scale-pressable.tsx`, `animate-height.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-toggle.ts`, `use-transactions.ts`)
- Utils: `kebab-case.ts` (e.g., `cn.ts`, `format.ts`, `motion.ts`)
- Icons: `kebab-case.tsx` (e.g., `chevron-right.tsx`, `cross.tsx`)
- Stores: `kebab-case.ts` (e.g., `preferences.ts`, `recent-funds.ts`)
- Platform-specific: `*.ios.tsx` suffix (e.g., `date-selector.ios.tsx`)

**Functions:**
- camelCase for all functions: `useToggle`, `toCurrencyShort`, `hexToTransparent`
- Hooks always prefixed with `use`: `useTransactionList`, `useFundTransactions`
- Event handlers: `handle{Event}` pattern: `handleOnLayout`, `handlePressIn`

**Variables:**
- camelCase: `measuredHeight`, `isExpanded`, `totalSpent`
- Boolean prefixes: `is`, `has`, `should`: `isLoading`, `hasNextPage`, `isFallback`
- Constants: SCREAMING_SNAKE_CASE for module-level: `DEFAULT_SCALE`, `TW_TRANSITION_ALL`

**Types:**
- PascalCase for types/interfaces: `Props`, `ButtonVariant`, `IconProps`
- Suffixes: `Props` for component props, `State` for store state
- Inline `type Props = {}` at component top, not separate files

**Database Tables:**
- Plural snake_case in schema: `users`, `folders`, `funds`, `transactions`
- Columns: camelCase: `userId`, `fundId`, `createdAt`

**tRPC Routers:**
- Plural kebab-case files: `funds.ts`, `transactions.ts`, `folders.ts`
- Router names: `fundsRouter`, `transactionsRouter`
- Procedure names: verb-noun camelCase: `create`, `list`, `retrieve`, `update`, `delete`

## Code Style

**Formatting:**
- Tool: Biome (extends ultracite/core)
- Config: `/biome.json`
- Run: `pnpm lint` (runs `biome check --write`)

**Linting:**
- Tool: Biome with ultracite preset
- Config: `/biome.json` extends `ultracite/core`
- Exclusions: `apps/server/api/*.js` (build output)

**TypeScript:**
- Strict mode enabled
- strictNullChecks enabled
- No explicit `any` - use `unknown` or proper types

## Import Organization

**Order:**
1. External packages (react, react-native, expo-*)
2. Internal packages (db, api via workspace)
3. Absolute imports with `@/` alias
4. Relative imports (rare, prefer `@/`)

**Path Aliases:**
- `@/*` maps to `./src/*` in mobile app
- Workspace packages: `api`, `db` (no alias needed)

**Example:**
```typescript
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import type { AppRouter } from "api";
import { cn } from "@/utils/cn";
import { ScalePressable } from "@/components/scale-pressable";
```

## Error Handling

**Patterns:**
- tRPC procedures: throw `TRPCError` with appropriate code
- Authorization: check `ctx.userId`, throw `UNAUTHORIZED` if missing
- Resource not found: return `null` for queries, throw `Error` for mutations

**Example (API):**
```typescript
if (!fund) {
  throw new Error("Fund not found");
}
```

**Client-side:**
- TanStack Query handles errors via `onError` callbacks
- No explicit try/catch in most components

## Logging

**Framework:** console (development only)

**Patterns:**
- tRPC logger link enabled in development
- No production logging framework configured
- Use `process.env.NODE_ENV === "development"` guards

## Comments

**When to Comment:**
- Complex business logic requiring explanation
- "Why" not "what" - code should be self-documenting
- JSDoc for exported utility functions with complex signatures

**JSDoc/TSDoc:**
- Used sparingly for utility functions
- Include `@param` and `@returns` for non-obvious functions

**Example:**
```typescript
/**
 * Converts a hex color to a transparent version with the given opacity.
 * @param hex - Hex color string (e.g., "#ff0000" or "#f00")
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA string in format "rgba(R, G, B, opacity)"
 */
export function hexToTransparent(hex: string, opacity: number): string {
```

## Function Design

**Size:**
- Target: <50 lines per function
- File limit: <800 lines
- Nesting depth: <4 levels

**Parameters:**
- Destructure props in function signature
- Use default values: `size = "lg"`, `variant = "default"`
- Optional params: use `?` or provide defaults

**Return Values:**
- Hooks return tuples or objects: `[state, handlers]` or `{ data, isLoading }`
- Components return JSX directly, no intermediate variables
- Queries return data shapes matching UI needs

## Module Design

**Exports:**
- Default export for components: `export default function Button`
- Named exports for utilities/hooks: `export function cn`
- Re-exports via barrel files for icon sets

**Barrel Files:**
- Use for icon collections: `@/icons/index.ts`
- Use for feature modules: `@/components/stats/index.ts`
- Keep flat - no nested re-exports

## Component Patterns

**Default Components:**
- Use `StyledLeanView` and `StyledLeanText` from `@/config/interop.ts`
- These are performance-optimized RN primitives wrapped with Uniwind

**Styling:**
- Uniwind (Tailwind for RN) via `className` prop
- Use `cn()` utility to merge classes conditionally
- Prefer Tailwind classes over inline styles

**Props Pattern:**
```typescript
type Props = Omit<ScalePressableProps, "style"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  className,
  size = "lg",
  variant = "default",
  ...props
}: Props) {
```

**Animations:**
- Reanimated 3 for all animations
- Use `useSharedValue`, `useAnimatedStyle`, `useDerivedValue`
- Spring configs in `@/utils/motion.ts`: `transitions.snappy`, `transitions.bounce`

## State Management

**Client State:**
- Zustand with MMKV persistence for preferences
- Pattern: `create<State>()(persist((set) => ({ ... })))`

**Server State:**
- TanStack Query for all API data
- tRPC integration via `@trpc/tanstack-react-query`
- Use `trpc.*.queryOptions()` pattern

## Styling Conventions

**Text:**
- Always pair `numberOfLines` with `ellipsizeMode="tail"`
- Use `font-nunito-bold` for currency/numeric values
- Use `font-satoshi-medium` for labels

**Colors:**
- Radix Colors palette (mauve, violet, lime, red, pink)
- Semantic tokens: `background`, `foreground`, `primary`, `muted`, etc.
- Access via CSS variables in Tailwind: `bg-foreground`, `text-muted-foreground`

**Theming:**
- Light/dark mode via CSS variables in `global.css`
- JS theme objects in `@/utils/colors.ts` for non-Tailwind contexts

---

*Convention analysis: 2026-01-22*
