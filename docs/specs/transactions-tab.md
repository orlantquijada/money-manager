# Transactions Tab Specification

## Overview

The Transactions tab provides a visual spending breakdown and chronological transaction history. It combines statistics visualization with a browsable transaction list to help users understand their spending patterns.

**Primary use cases:**
- Visualize spending distribution across funds
- Browse recent spending history by period
- Identify top spending categories at a glance

---

## Information Architecture

### Tab Location
Bottom tab navigation, alongside Dashboard and Add Expense.

### Data Source
- `transaction.stats` - Aggregated stats for pie chart and totals
- `transaction.list` - Paginated transaction list

---

## Screen Layout

```
+------------------------------------------+
|  Transactions                             |  <- Standard header
+------------------------------------------+
|  [Week] [Month*] [3 mo] [All]            |  <- Period chips
+------------------------------------------+
|                                          |
|  [  Pie Chart  ]  Total Spent            |  <- Stats header
|  [   (60%)     ]  ₱XX,XXX                |     (scrolls away)
|                   ─────────              |
|                   Top Funds              |
|                   1. Food      ₱X,XXX    |
|                   2. Bills     ₱X,XXX    |
|                   3. Transport ₱X,XXX    |
|                                          |
+------------------------------------------+
|  Today                          ₱X,XXX   |  <- Date header
|  ├─ Store Name               ₱XXX.XX    |
|  ├─ Store Name               ₱XXX.XX    |
|  └─ Fund Name                ₱XXX.XX    |
|                                          |
|  Yesterday                      ₱X,XXX   |
|  ├─ ...                                  |
|                                          |
|  [ Load More ]                           |  <- Pagination
+------------------------------------------+
```

---

## Core Features

### 1. Period Filter Chips

**Layout:** Fixed horizontal row (no scroll), 4 chips

| Chip | Query |
|------|-------|
| Week | Last 7 days |
| Month | Current calendar month (default) |
| 3 mo | Last 3 calendar months |
| All | No date filter |

**Behavior:**
- Single selection (radio-style)
- "Month" selected by default on tab open
- Changing period resets list and refetches stats
- Active chip: filled background; inactive: outline only
- No amounts shown on chips (totals shown in stats header)

---

### 2. Stats Header

**Layout:** Side-by-side, 60/40 split (pie chart dominant)
- Left: Pie chart (60% width)
- Right: Total spent + top 3 funds (40% width)

**Scroll behavior:** Stats header scrolls up with content (not sticky)

#### 2.1 Donut Chart

**Technology:** Custom implementation using `d3-shape` + `react-native-svg` + `react-native-reanimated`

**Data:** Spending distribution by fund for selected period

**Slice limits:**
- Show top 5 funds individually
- Group remaining funds into "Other" slice
- If ≤5 funds have spending, show all without "Other"

**Visual Style:**
- Donut chart with `innerRadius: 50%`
- **Heavily rounded corners** on slice ends (pill-shaped/capsule-like, `cornerRadius: 12`)
- Visible **gaps between slices** (~2-3px angular gap via `padAngle: 0.04`)
- Friendly, playful aesthetic (not formal/corporate)

**Color palette:**
- Monochromatic shades derived from app accent color (violet)
- 6 shades: darkest to lightest for slices 1-5 + "Other"
- Colors configurable via `apps/mobile/src/lib/chart-colors.ts`

**Interaction:**
- **Gesture:** Tap only (no swipe/pan)
- Tap slice to focus
- Tap same slice again to unfocus (return to default state)
- Haptic feedback (light impact) on tap
- **Position:** Fixed - no rotation. Slices stay in their data-order positions.

**Focus/Emphasis Effect (Combination):**
1. **Radial pop-out**: Focused slice moves outward from center by ~8-10px
2. **Dim others**: Unfocused slices reduce to 30% opacity
3. **Soft drop shadow**: Subtle shadow underneath focused slice for depth/lift effect

**Center Label:**
- **Default state (no selection):** Top fund name (small, `text-xs`) + amount (large, `text-sm`, `font-nunito-bold`)
- **Focused state:** Percentage (large, `text-2xl`, `font-nunito-bold`) + fund name (small, `text-xs`)
  - Percentage represents that fund's share of total spending for the period
  - Example: "51%" with "Food" below

**Animations:**
- **Engine:** `react-native-reanimated` with spring physics
- **Slice transitions:** Spring animation (`damping: 15`, `stiffness: 150`) for pop-out/pop-in and opacity changes
- **Shadow:** Fade in with slice pop-out
- **Center label:** Crossfade transition (~200ms) - old text fades out while new text fades in

**Technical Implementation:**
```typescript
import { arc, pie } from 'd3-shape';

const pieGenerator = pie<PieSlice>()
  .value(d => d.value)
  .padAngle(0.04)  // Gap between slices
  .sort(null);     // Preserve data order

const arcGenerator = arc<PieArcDatum<PieSlice>>()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)
  .cornerRadius(12);  // Heavily rounded corners
```

**Dependencies:**
- Add: `d3-shape`, `@types/d3-shape`
- Remove: `victory-native`

#### 2.2 Quick Stats Panel

**Total spent:**
- Large formatted currency amount
- Label: "Total Spent" or period-specific (e.g., "Spent this month")

**Top funds list:**
- Show up to 3 funds with highest spending
- Format: `1. Fund Name    ₱X,XXX`
- If <3 funds have spending, show only those that exist
- Tiebreaker for equal amounts: alphabetical by fund name

---

### 3. Transaction List

**Component:** SectionList grouped by date

**Section headers:**
- "Today", "Yesterday", or formatted date (e.g., "Mon, Jan 6")
- Daily total displayed on right side of header

**Transaction row:**
- Left: Store name (fallback: fund name if no store)
- Right: Amount (formatted currency)
- **No tap action in V1** (rows are read-only)

**Pagination:**
- Page size: 50 transactions
- "Load More" button at bottom of list
- Button shows loading state while fetching
- Hide button when no more pages

---

### 4. Empty States

#### No transactions ever (new user)
```
+------------------------------------------+
|                                          |
|       📊                                 |
|                                          |
|    No transactions yet                   |
|                                          |
|    Start tracking your expenses by       |
|    adding your first transaction.        |
|                                          |
|    [Go to Add Expense]                   |
|                                          |
+------------------------------------------+
```
- Hide stats header entirely
- Show educational message with CTA button
- CTA navigates to Add Expense tab

#### No transactions in selected period
```
+------------------------------------------+
|  (Stats header with zeroed chart)        |
|  Total: ₱0                               |
+------------------------------------------+
|                                          |
|    No spending this week                 |
|    Try selecting a different period      |
|                                          |
+------------------------------------------+
```
- Show stats header with empty/zeroed state
- Period-specific message in list area

---

## Loading & Caching

**Strategy:** Optimistic/stale-while-revalidate

- Show cached data immediately on tab focus
- Fetch fresh data in background
- Update UI when new data arrives
- Use TanStack Query's `staleTime` and `gcTime` appropriately

**Initial load:**
- Show skeleton placeholders for stats header
- Show spinner in list area

---

## Visual Design

### Header
- Standard header with "Transactions" title
- No search icon in V1 (search deferred)

### Colors
- Pie chart uses monochromatic accent palette
- Theme colors stored in `apps/mobile/src/lib/chart-colors.ts` (new file)
- Easy to swap base color for theming

### Typography
- Total amount: Large, bold (`font-nunito-bold text-2xl`)
- Top funds amounts: Medium (`font-nunito-bold text-base`)
- Transaction amounts: Standard (`font-nunito-bold`)

---

## API Requirements

### `transaction.stats`

```typescript
input: {
  period: 'week' | 'month' | '3mo' | 'all'
}

output: {
  totalSpent: number
  byFund: Array<{
    fundId: number
    fundName: string
    amount: number
    percentage: number  // 0-100
  }>
}
```

### `transaction.list`

```typescript
input: {
  period: 'week' | 'month' | '3mo' | 'all'
  cursor?: string
  limit?: number  // default 50
}

output: {
  transactions: Array<{
    id: string
    amount: number
    date: Date
    note?: string
    fund: { name: string }
    store?: { name: string }
  }>
  nextCursor?: string
}
```

---

## Files to Create/Modify

### Mobile App
| Action | File | Purpose |
|--------|------|---------|
| Modify | `apps/mobile/src/app/(app)/(tabs)/transactions.tsx` | Main tab screen |
| Create | `apps/mobile/src/components/stats/pie-chart.tsx` | Donut chart (default style, d3 + SVG) |
| Create | `apps/mobile/src/components/stats/pie-chart-segmented.tsx` | Donut chart (interactive, d3 + SVG + reanimated) |
| Modify | `apps/mobile/src/components/stats/stats-header.tsx` | Stats header layout with chart variant support |
| Create | `apps/mobile/src/components/stats/period-chips.tsx` | Period filter chips |
| Create | `apps/mobile/src/lib/chart-colors.ts` | Chart color palette |
| Modify | `apps/mobile/src/components/transactions/transaction-list.tsx` | Add pagination |
| Modify | `apps/mobile/package.json` | Add d3-shape, remove victory-native |

### API
| Action | File | Purpose |
|--------|------|---------|
| Modify | `packages/api/src/router/transactions.ts` | Add stats + list endpoints |

---

## Implementation Order (V1)

1. **API layer** - `transaction.stats` and `transaction.list` endpoints
2. **Period chips** - Filter component with state management
3. **Donut chart** - d3-shape + react-native-svg + reanimated with accent color palette
4. **Stats header** - Layout with donut chart + quick stats
5. **Transaction list** - Pagination with load more button
6. **Tab assembly** - Wire everything together
7. **Empty states** - Handle zero transactions scenarios
8. **Polish** - Loading states, caching, edge cases

---

## V1.1 (Deferred)

| Feature | Notes |
|---------|-------|
| Search | Server-side search by store name with debounce |
| Store grouping toggle | Switch pie chart between "by fund" and "by store" views |
| Transaction detail sheet | Tap row to open bottom sheet with full details |
| Edit/Delete transactions | Inline editing within detail sheet |
| Spending trends | Comparison to previous period (e.g., "+12% vs last month") |
| Privacy toggle | Quick way to hide/blur amounts on screen |

---

## Future Considerations

<!-- Privacy: Consider adding option to blur sensitive amounts when app goes to background, or a quick toggle to hide amounts (show ** instead). This is relevant for users who may have others glancing at their phone. -->

<!-- Fund-specific colors: Could add a 'color' field to funds table so users can customize pie chart colors per fund. -->

<!-- Custom date range: Power users may want to select arbitrary date ranges beyond the preset periods. -->
