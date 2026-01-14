# Spending & Activity Redesign Spec

> **Status:** Draft
> **Created:** 2026-01-14
> **Consolidates:** ai-insights.md, spending-dashboard-redesign.md, transactions-tab.json

---

## Overview

Two surface redesign + Budget Score + AI foundations.

| Surface | Rename | Purpose |
|---------|--------|---------|
| Bottom nav tab | Transactions → **Spending** | "Where is my money going?" |
| Dashboard tab | Transactions → **Activity** | "What happened recently?" |

---

## Part 1: Spending Tab

### 1.1 Comparative Context

Below "Total Spent", show comparison to previous period:

```
Total Spent
₱22,179
↑ ₱12,000 vs last month
```

| Period | Compare To | Note |
|--------|------------|------|
| Week | Last week | |
| Month | Last month | |
| 3mo | Previous 3mo | |
| All | Hidden | No comparison |

**Display variants:**
- `↑ ₱X vs last [period]` — spent more (warning color)
- `↓ ₱X vs last [period]` — spent less (success color)
- `Similar to last [period]` — within ±5% (muted)
- Hidden if no previous data

### 1.2 Pie Chart Budget Integration

When slice tapped, center label shows budget context:

```
Default:        After tap (budgeted):    After tap (no budget):
54%             54%                      54%
Rent            Rent                     Misc
                ₱12,000 / ₱12,000        ₱2,500 spent
```

---

## Part 2: Activity Tab (Dashboard)

### 2.1 Layout

```
┌─────────────────────────────────────┐
│  ₱22,178.5         🟢 78     [+]    │  ← Budget Score
│  Total spent this month             │
├─────────────────────────────────────┤
│  Budgets     [Activity]             │
├─────────────────────────────────────┤
│  ⚠️  Misc is ₱602 over budget       │  ← Alerts (rule-based)
│      Shopping has ₱1,110 left       │
│  ✨ Great week! 4/5 funds on track  │  ← Whisper (AI, opt-in)
├─────────────────────────────────────┤
│  Today · ₱380                       │
│  Jollibee              ₱189         │
│  Grab                   ₱85         │
│                                     │
│  Yesterday · ₱13,461                │
│  7-Eleven               ₱85         │
│  ...                                │
├─────────────────────────────────────┤
│        See all spending →           │  ← Navigates to Spending tab
└─────────────────────────────────────┘
```

### 2.2 Budget Alerts

Max 3 items. Priority order:
1. Over budget (⚠️)
2. Almost over >90% (🔶)
3. AI whispers (✨) — only if AI enabled

**Tap action:** Navigate to fund detail view.

### 2.3 Recent Transactions

- Show last 7 days
- No artificial cap
- Grouped by date with daily totals
- "See all spending →" navigates to Spending tab (preserves period)

---

## Part 3: Budget Score

Replaces percentage change in dashboard header. Always visible (not behind AI toggle).

### 3.1 Calculation

```
Base Score = 100

Deductions:
- Each fund >100% budget: -20 points
- Each fund >90% budget: -5 points

Bonuses:
- Under budget in >80% of funds: +10 points

Final = clamp(0, 100, Base + Bonuses - Deductions)
```

### 3.2 Display

```
🟢 70-100  On Track
🟡 40-69   Needs Attention
🔴 0-39    Over Budget
```

### 3.3 Expandable Breakdown

Tap score to see factors:
```
Budget Score: 78 🟢

-20  Misc is over budget
-5   Shopping at 95%
+10  4/5 funds under budget
─────
78   On Track
```

---

## Part 4: AI Features

### 4.1 Settings Toggle

```
AI Features
├── Enable AI Insights ............ [OFF]
│
├── (When enabled)
│   └── Contextual Whispers ....... [ON]
```

Toggle controls whispers only. Budget Score always visible.

### 4.2 Store → Fund Auto-fill

Store picker shows `lastUsedFund` inline on each row:

```
Recent Stores
├─ Jollibee (Dining Out)
├─ Grab (Transportation)
├─ 7-Eleven (Groceries)
└─ Amazon
```

**Behavior:**
- Selecting store auto-fills fund field (if fund not yet set)
- Stores without `lastUsedFund` show name only
- No suggestion card, no AI — leverages existing data model

### 4.3 Contextual Whispers (when AI enabled)

Non-intrusive insights in Activity tab alerts section:

| Type | Example |
|------|---------|
| Positive | "Great week! 4/5 funds on track" |
| Warning | "Coffee spending up this week" |
| Prediction | "At this pace, ₱120 left in Groceries" |

**Behavior:**
- Max 1 whisper visible at a time
- Dismissible
- Don't repeat same whisper within 7 days

---

## Part 5: API Changes

### Stats Endpoint Enhancement

```typescript
transaction.stats({ period }) => {
  totalSpent: number;
  byFund: Array<{
    fundId: number;
    fundName: string;
    amount: number;
    percentage: number;
    budgetedAmount?: number;      // NEW
    budgetUtilization?: number;   // NEW (0-100+)
  }>;
  comparison?: {                  // NEW
    previousTotal: number;
    difference: number;
    percentageChange: number;
  };
}
```

### Budget Alerts Endpoint

```typescript
budget.alerts() => {
  alerts: Array<{
    type: 'over_budget' | 'almost_over';
    fundId: number;
    fundName: string;
    message: string;
    severity: 'warning' | 'info';
  }>;
}
```

### Budget Score Endpoint

```typescript
budget.score() => {
  score: number;
  status: 'on_track' | 'needs_attention' | 'over_budget';
  factors: Array<{
    description: string;
    points: number;
  }>;
}
```

---

## Implementation Phases

### Phase 1: Spending Tab Enhancements
- Comparative context
- Pie chart budget integration

### Phase 2: Activity Tab
- Tab rename
- Budget alerts section
- 7-day transactions
- "See all spending" link

### Phase 3: Budget Score
- Calculation logic
- Dashboard header integration
- Expandable breakdown

### Phase 4: AI Foundations
- Settings toggle
- Store suggestion UI
- Whisper infrastructure (content deferred)

---

## Deferred Features

| Feature | Reason |
|---------|--------|
| Natural Language Entry | High effort, defer to later phase |
| Spending Pattern Detection | Needs more data infrastructure |
| Proactive Push Alerts | Needs notification service |
| Recurring Expense Detection | Phase 3.2+ |
| Clear AI Data button | No cache to clear in MVP |

---

## Open Questions

None — all resolved during spec consolidation interview.
