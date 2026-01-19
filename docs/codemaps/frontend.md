<!-- Generated: 2026-01-19 -->

# Frontend Codemap

## App Structure (Expo Router)

```
apps/mobile/src/app/
├── _layout.tsx              # Root: Clerk, QueryClient, providers
├── sign-in.tsx              # Auth screen
├── modal.tsx                # Modal route
└── (app)/                   # Protected routes
    ├── _layout.tsx          # Auth guard, app shell
    ├── settings.tsx         # Settings screen
    ├── alerts.tsx           # Budget alerts
    ├── create-fund.tsx      # Fund creation flow
    ├── create-folder.tsx    # Folder creation
    ├── transaction/
    │   └── [id].tsx         # Transaction detail
    ├── fund/
    │   └── [id]/
    │       ├── _layout.tsx  # Fund stack layout
    │       ├── index.tsx    # Fund overview
    │       └── transactions.tsx  # Fund transactions
    └── (tabs)/              # Tab navigation
        ├── _layout.tsx      # Tab bar
        ├── add-expense.tsx  # Add expense screen
        └── (main)/          # Main content tabs
            ├── _layout.tsx  # Material top tabs
            ├── spending.tsx # Spending overview
            ├── transactions/
            │   ├── _layout.tsx
            │   └── index.tsx
            └── (dashboard)/
                ├── _layout.tsx
                ├── index.tsx    # Dashboard home
                └── activity.tsx # Activity feed
```

## Components Organization

```
apps/mobile/src/components/
├── add-expense/             # Add expense flow
│   ├── amount.tsx           # Amount input display
│   ├── numpad.tsx           # Custom numpad
│   ├── fund-picker-sheet.tsx
│   ├── store-picker-sheet.tsx
│   ├── metadata-row.tsx     # Date, store, note row
│   └── save-button.tsx
├── budgets/                 # Budget display
│   ├── budget.tsx           # Budget card
│   ├── category.tsx         # Category item
│   ├── category-progress-bars.tsx
│   ├── category-utils.ts
│   ├── progress-bar.tsx
│   └── quick-stat.tsx
├── create-fund/             # Fund creation
│   ├── fund-info.tsx
│   ├── spending-info.tsx
│   ├── non-negotiable-info.tsx
│   ├── choose-folder.tsx
│   ├── choice.tsx
│   ├── footer.tsx
│   └── footer.android.tsx
├── dashboard/               # Dashboard widgets
│   ├── budget-alerts.tsx
│   └── total-spent.tsx
├── stats/                   # Statistics
│   ├── index.ts
│   ├── stats-header.tsx
│   ├── stats-header-skeleton.tsx
│   ├── pie-chart-segmented.tsx
│   ├── pie-chart-skeleton.tsx
│   ├── top-funds.tsx
│   ├── budget-alerts.tsx
│   ├── budget-alert-card.tsx
│   └── period-chips.tsx
├── transactions/            # Transaction list
│   ├── index.ts
│   ├── transaction-list.tsx
│   ├── transaction-row.tsx
│   ├── activity-transaction-list.tsx
│   ├── date-header.tsx
│   ├── history-header.tsx
│   └── empty-state.tsx
├── bottom-sheet/
│   └── create-bottom-sheet.tsx
├── ui/                      # Core UI
│   ├── button-tokens.ts
│   ├── icon-symbol.tsx
│   ├── icon-symbol.ios.tsx
│   └── animated-svg.tsx
├── button.tsx               # Main button component
├── glass-button.tsx         # Glass effect button
├── scale-pressable.tsx      # Pressable with scale
├── animated-pressable.ts
├── text-input.tsx
├── bottom-sheet.tsx
├── skeleton.tsx
├── theme-provider.tsx
├── date-selector.ios.tsx
├── fab-overlay.tsx
├── animate-height.tsx
├── animated-tab-screen.tsx
├── animated-text.tsx
├── animated-blur-overlay.tsx
├── presence.tsx
├── lean-text.tsx
└── lean-view.tsx
```

## Hooks

```
apps/mobile/src/hooks/
├── use-auth-token-sync.ts    # Sync Clerk token to tRPC
├── use-create-transaction.ts # Transaction creation logic
├── use-debounce.ts           # Debounce utility
├── use-fab-height.ts         # FAB height calculation
├── use-folders-with-funds.ts # Folders query wrapper
├── use-fonts.ts              # Font loading
├── use-previous.ts           # Previous value tracking
├── use-scroll-reached-edge.ts # Scroll position detection
├── use-sync-tab-position.ts  # Tab position sync
├── use-tab-change-haptics.ts # Tab haptic feedback
├── use-toggle.ts             # Boolean toggle
├── use-transactions.ts       # Transaction queries
└── use-user-provisioning.ts  # User creation on auth
```

## Stores (Zustand)

```
apps/mobile/src/stores/
├── preferences.ts            # User preferences
└── recent-funds.ts           # Recent fund selection
```

## Contexts

```
apps/mobile/src/contexts/
└── tab-position-context.tsx  # Shared tab position state
```

## Lib (Feature Logic)

```
apps/mobile/src/lib/
├── add-expense.ts            # Add expense state machine
├── auth-token.ts             # Auth token store
├── chart-colors.ts           # Chart color utilities
├── create-fund.tsx           # Fund creation context
├── fund.ts                   # Fund utilities
└── token-cache.ts            # Clerk token cache
```

## Utils

```
apps/mobile/src/utils/
├── api.tsx                   # tRPC client setup
├── base-url.tsx              # API URL resolution
├── cn.ts                     # Class merging
├── colors.ts                 # Color utilities
├── create-scoped-store.tsx   # Scoped Zustand store
├── fn.ts                     # Function utilities
├── format.ts                 # Formatting helpers
├── math.ts                   # Math utilities
├── motion.ts                 # Animation constants
├── random.ts                 # Random utilities
└── types.ts                  # Shared types
```

## Key Exports

### `utils/api.tsx`
```typescript
export const queryClient: QueryClient
export const trpc: TRPCOptionsProxy<AppRouter>
export type { RouterInputs, RouterOutputs }
```

### `components/theme-provider.tsx`
```typescript
export function ThemeProvider({ children })
export function useTheme(): { isDark, colors, ... }
```

### `hooks/use-transactions.ts`
```typescript
export function useTransactions(options)
export function useTransactionsByFund(fundId)
```

## Provider Hierarchy (Root Layout)

```
ClerkProvider
└── ClerkLoaded
    └── SafeAreaListener
        └── QueryClientProvider
            └── KeyboardProvider
                └── GestureHandlerRootView
                    └── ThemeProvider
                        └── BottomSheetModalProvider
                            └── AppContent
```

## Navigation Structure

| Route | Screen | Description |
|-------|--------|-------------|
| `/sign-in` | SignIn | Authentication |
| `/(app)/(tabs)/(main)/(dashboard)` | Dashboard | Home screen |
| `/(app)/(tabs)/(main)/(dashboard)/activity` | Activity | Recent activity |
| `/(app)/(tabs)/(main)/spending` | Spending | Budget overview |
| `/(app)/(tabs)/(main)/transactions` | Transactions | All transactions |
| `/(app)/(tabs)/add-expense` | AddExpense | Expense entry |
| `/(app)/fund/[id]` | FundDetail | Fund overview |
| `/(app)/fund/[id]/transactions` | FundTransactions | Fund transactions |
| `/(app)/transaction/[id]` | Transaction | Transaction detail |
| `/(app)/create-fund` | CreateFund | Fund creation |
| `/(app)/create-folder` | CreateFolder | Folder creation |
| `/(app)/settings` | Settings | User settings |
| `/(app)/alerts` | Alerts | Budget alerts |
