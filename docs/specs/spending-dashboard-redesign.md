# Spending & Dashboard Redesign Spec

> **Status:** Draft  
> **Created:** 2026-01-10  
> **Last Updated:** 2026-01-10

---

## Overview

This spec proposes restructuring the money manager's two main surfaces (Dashboard and the Transactions tab) to maximize user value through clear separation of concerns.

### The Problem

1. The "Transactions" tab is misnamed—it's really a spending analytics page with a pie chart
2. Dashboard's Transactions tab is redundant with the dedicated Transactions page
3. Spending data lacks comparative context ("Is this normal?")
4. Pie chart doesn't connect to the budget system

### The Vision

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   QUICK GLANCE (Dashboard)    │   DEEP ANALYSIS (Spending)  │
│   "Am I on track today?"      │   "Where is my money going?"│
│   Time: 5-10 seconds          │   Time: 30+ seconds         │
│                               │                             │
│   ├─ Budgets Tab              │   ├─ Period Analytics       │
│   └─ Activity Tab (NEW)       │   ├─ Category Breakdown     │
│                               │   └─ Transaction History    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 1: Spending Tab (Currently "Transactions")

### 1.1 Rename

**Current:** "Transactions" (3rd tab)  
**Proposed:** "Spending"

**Rationale:** The page answers "Where is my money going?" not "What are my transactions?" The pie chart and analytics are the value prop.

### 1.2 Layout

```
┌─────────────────────────────────────┐
│  Week   [Month]   3mo    All        │  ← Period chips (unchanged)
├─────────────────────────────────────┤
│                                     │
│    ┌──────────┐    Total Spent      │
│    │   54%    │    ₱22,179          │
│    │   Rent   │    ↑ ₱12,000 vs last│  ← NEW: Comparative context
│    └──────────┘                     │
│                    Top Funds        │
│                    ● Rent   ₱12,000 │
│                    ● Internet ₱1,699│
│                    ● Electric ₱1,450│
│                                     │
├─────────────────────────────────────┤
│  Today                       ₱380   │
│  ─────────────────────────────────  │
│  Jollibee                    ₱189   │
│  Grab                         ₱85   │
│  ...                                │
└─────────────────────────────────────┘
```

### 1.3 New Features

#### Comparative Context (Priority: High)

Add comparison line below "Total Spent":

| Period | Comparison To |
|--------|---------------|
| Week | Last week |
| Month | Last month |
| 3mo | Previous 3 months |
| All | No comparison |

**Display variants:**

```
↑ ₱12,000 vs last month     (spent more - warning color)
↓ ₱3,000 vs last month      (spent less - success color)
Similar to last month        (±5% - muted)
[hidden]                     (no previous data)
```

#### Budget Connection in Pie Chart (Priority: High)

When tapping a pie slice, show budget context in center label:

**Default state:**
```
54%
Rent
```

**After tapping slice:**
```
54%
Rent
₱12,000 / ₱12,000 budget
```

**If fund has no budget:**
```
54%
Rent
₱12,000 spent
```

#### Top Funds Budget Bars (Priority: Medium)

Add mini progress bars showing budget utilization:

```
Top Funds
● Rent      ₱12,000  ━━━━━━━━━━ 100%
● Internet  ₱1,699   ━━━━━━━━━━ 85%
● Electric  ₱1,450   ━━━━━━━░░░ 72%
```

Only show progress bar for funds that have budgets.

---

## Part 2: Dashboard

### 2.1 Rename Tab

**Current:** "Transactions"  
**Proposed:** "Activity"

**Rationale:** "Activity" implies a curated feed of what matters, not a raw data dump.

### 2.2 Activity Tab Layout

```
┌─────────────────────────────────────┐
│  ₱22,178.5          ↑761%    [+]    │
│  Total spent this month             │
├─────────────────────────────────────┤
│  Budgets     [Activity]             │
├─────────────────────────────────────┤
│                                     │
│  ⚠️  Misc is ₱602 over budget       │  ← Alerts section (NEW)
│      Shopping has ₱1,110 left       │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Today · ₱380                       │  ← Recent (last 7 days)
│  Jollibee              ₱189         │
│  Grab                   ₱85         │
│  Transportation        ₱106         │
│                                     │
│  Yesterday · ₱13,461                │
│  7-Eleven               ₱85         │
│  Anytime Fitness     ₱1,000         │
│  ...                                │
│                                     │
│  ────────────────────────────────── │
│        See all spending →           │  ← Link to Spending tab
│                                     │
└─────────────────────────────────────┘
```

### 2.3 New Features

#### Budget Alerts (Priority: High)

Show 2-3 actionable alerts at top of Activity tab:

| Alert Type | Icon | Example |
|------------|------|---------|
| Over budget | ⚠️ | "Misc is ₱602 over budget" |
| Almost over (>90%) | 🔶 | "Shopping is almost at budget (95%)" |
| Large recent expense | 💸 | "Monthly rent · ₱12,000 yesterday" |

**Priority order:** Over budget > Almost over > Large expenses

**Interaction:** Tapping alert navigates to relevant budget or transaction.

#### Compressed Recent Transactions

- Show only **last 7 days**
- Limit to ~10 transactions visible before scroll
- Group by day (same as current)
- No pagination—this is a quick glance surface
- End with "See all spending →" link

---

## Part 3: Data Requirements

### API Changes

#### Stats Endpoint Enhancement

```typescript
// Current
transaction.stats({ period }) => {
  totalSpent: number;
  byFund: FundData[];
}

// Proposed
transaction.stats({ period }) => {
  totalSpent: number;
  byFund: FundData[];
  comparison?: {
    previousTotal: number;
    difference: number;        // positive = spent more
    percentageChange: number;
  };
}
```

#### Fund Data Enhancement

```typescript
// Current
type FundData = {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
}

// Proposed
type FundData = {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
  budgetedAmount?: number;     // NEW
  budgetUtilization?: number;  // NEW (0-100+)
}
```

#### New Budget Alerts Endpoint

```typescript
budget.alerts() => {
  alerts: Array<{
    type: 'over_budget' | 'almost_over' | 'large_expense';
    fundId: number;
    fundName: string;
    message: string;
    severity: 'warning' | 'info';
  }>;
}
```

---

## Part 4: Implementation Phases

### Phase 1: Comparative Context (Recommended First)

**Effort:** Medium  
**Impact:** High

| File | Change |
|------|--------|
| `apps/mobile/src/app/(app)/(tabs)/transactions.tsx` | Consume comparison data, pass to StatsHeader |
| `apps/mobile/src/components/stats/stats-header.tsx` | Add comparison display below Total Spent |
| Backend: `transaction.stats` | Calculate and return comparison data |

### Phase 2: Dashboard Activity Tab

**Effort:** Medium  
**Impact:** High

| File | Change |
|------|--------|
| `apps/mobile/src/app/(app)/(tabs)/(dashboard)/transactions.tsx` | Replace with Activity component |
| `apps/mobile/src/app/(app)/(tabs)/(dashboard)/_layout.tsx` | Rename tab label |
| `apps/mobile/src/components/dashboard/budget-alerts.tsx` | **[NEW]** Alerts component |
| `apps/mobile/src/hooks/use-budget-alerts.ts` | **[NEW]** Alert logic |
| Backend: `budget.alerts` | **[NEW]** Alerts endpoint |

### Phase 3: Pie Chart Budget Integration

**Effort:** Low-Medium  
**Impact:** Medium

| File | Change |
|------|--------|
| `apps/mobile/src/components/stats/pie-chart-segmented.tsx` | Show budget info in center label when slice selected |
| `apps/mobile/src/components/stats/stats-header.tsx` | Add budget bars to Top Funds list |
| Backend: `transaction.stats` | Include budget data in byFund response |

---

## Part 5: AI Integration Points (Phase 3)

> These features are **opt-in** and documented fully in [AI Insights Spec](./ai-insights.md).

### Activity Tab Enhancements

The alerts section in the Activity tab (Part 2.2) reserves space for AI-powered insights:

```
│  ⚠️  Misc is ₱602 over budget       │  ← Rule-based alerts (Phase 1)
│      Shopping has ₱1,110 left       │
│                                     │
│  ✨ "You're on a 5-day logging      │  ← AI whisper (Phase 3, opt-in)
│      streak—keep it up!"            │
```

### Dashboard Header

The percentage change indicator (↑765%) can be replaced with a **Budget Health Score**:

```
Current:   ₱22,278.5  ↑765%
Phase 3:   ₱22,278.5  🟢 78    ← Health score (0-100)
```

### Stats Insights Section

Below the pie chart in the Spending tab, an optional AI insights panel:

```
│  📊 AI Insights                      │
│  ─────────────────────────────────── │
│  💡 Dining out up 32% vs last month  │
│  🔁 3 expenses look recurring        │
│  🎉 You stayed under budget in 4/5   │
```

### Add Expense Flow

Smart store → fund suggestions based on past behavior:

```
│  Store:  Jollibee                    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 💡 Suggested: Dining Out        │  │
│  │    You always put Jollibee here │  │
│  └────────────────────────────────┘  │
```

---

## Open Questions

- [ ] Should "See all spending" navigate to Spending tab or just expand the list?
- [ ] What threshold defines a "large expense" worth alerting on? (Fixed amount? Percentage of budget?)
- [ ] Should comparison show absolute difference, percentage, or both?
- [ ] Should the Activity tab's alert section reserve space for AI-powered insights (Phase 3)?

---

## Appendix: User Journey Map

```
User opens app
    │
    ├─→ Wants to add expense → Add Expense tab
    │
    ├─→ Quick check → Dashboard
    │       │
    │       ├─→ "Am I on budget?" → Budgets tab
    │       │
    │       └─→ "What happened recently?" → Activity tab
    │               │
    │               └─→ Sees alert, wants more detail → Spending tab
    │
    └─→ Wants to analyze spending → Spending tab
            │
            ├─→ Changes period filter
            ├─→ Taps pie slice to drill into category
            └─→ Scrolls through all transactions
```
