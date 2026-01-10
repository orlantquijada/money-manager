# AI Insights & Intelligence Spec

> **Status:** Draft  
> **Created:** 2026-01-10  
> **Phase:** 3 (per PRD)  
> **Depends on:** [Spending & Dashboard Redesign](./spending-dashboard-redesign.md)

---

## Overview

This spec defines AI-powered features that help users understand their spending patterns, build better habits, and reduce friction in daily budgeting tasks.

### Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Opt-in only** | AI features disabled by default, toggle in Settings |
| **No training** | User data never used to train AI models |
| **Reversible** | Disabling AI clears all cached insights |
| **Encouraging** | Focus on positive patterns, not guilt |
| **Subtle** | Blend into existing UI, never interrupt |

---

## Feature 1: Contextual Whispers

Gentle, non-intrusive insights that appear at relevant moments.

### Types

| Type | Example | Trigger |
|------|---------|---------|
| Pattern observation | "You usually spend less on groceries mid-month" | Weekly on Mondays |
| Positive reinforcement | "Nice! 3 days without dining out 🎉" | On streak milestone |
| Gentle warning | "Coffee shop visits are up this week" | When category spikes >30% |
| Budget prediction | "At this pace, you'll have ₱120 left in Groceries" | Mid-period |

### UI Placement

**Dashboard Header (Primary)**
```
┌─────────────────────────────────────────┐
│  ₱22,278.5  🟢 On Track            [+]  │
│  Total spent this month                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ✨ "You're on a 5-day logging   │    │  ← Whisper card
│  │     streak—keep it up!"         │    │     (dismissible)
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Activity Tab (Secondary)**
```
│  ✨ AI Insights                         │
│  ─────────────────────────────────────  │
│  📊 Rent takes 54% of your budget       │
│  📈 Electric bill up 12% vs last month  │
│  🎯 You've logged expenses 7 days in a row! │
```

### Behavior

- Maximum 1 whisper visible at a time
- Dismissible with swipe or tap ✕
- Don't repeat the same whisper within 7 days
- Persist dismissal state locally

---

## Feature 2: Smart Store → Fund Suggestions

Auto-suggest the most likely fund when adding an expense.

### Logic

```
Priority order:
1. Exact store match → last used fund for that store
2. Similar store name → most common fund for similar stores
3. No match → show recent funds
```

### UI

**Add Expense Flow**
```
┌─────────────────────────────────────────┐
│  Amount: ₱189                           │
│  Store:  Jollibee                       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 💡 Suggested: Dining Out         │    │
│  │    You always put Jollibee here  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Or choose: [Groceries] [Transport] ... │
└─────────────────────────────────────────┘
```

### Data Model

Already exists via `Store.lastUsedFund` — this feature just surfaces it more prominently.

---

## Feature 3: Natural Language Entry

Allow users to type or speak transactions naturally.

### Parse Examples

| Input | Parsed As |
|-------|-----------|
| "Spent 45 at Target for groceries" | Amount: ₱45, Store: Target, Fund: Groceries |
| "Lunch with Sarah, 280" | Amount: ₱280, Store: (empty), Fund: Dining |
| "Grab 85" | Amount: ₱85, Store: Grab, Fund: Transportation |

### UI

**Quick Entry Bar (Dashboard)**
```
┌─────────────────────────────────────────┐
│  ✨ "Coffee at Starbucks 150"           │  ← Natural language input
│                                         │
│  Preview:                               │
│  ₱150 · Starbucks · ☕ Coffee           │
│                                    [Add]│
└─────────────────────────────────────────┘
```

### Implementation Notes

- Use on-device parsing for speed (regex + local ML)
- Fall back to server-side LLM for ambiguous cases
- Always show preview before confirming

---

## Feature 4: Budget Health Score

A simple 0-100 score summarizing overall budget health.

### Calculation

```
Base Score = 100

Deductions:
- Each fund >100% budget: -20 points
- Each fund >90% budget: -5 points
- No logging in 3+ days: -10 points

Bonuses:
- Logging streak (7+ days): +5 points
- Under budget in >80% of funds: +10 points

Final Score = clamp(0, 100, Base + Bonuses - Deductions)
```

### Display

**Dashboard Header**
```
Current:   ₱22,278.5  ↑765%
Proposed:  ₱22,278.5  🟢 78
                      └── Health score with emoji indicator

🟢 70-100  On Track
🟡 40-69   Needs Attention  
🔴 0-39    Over Budget
```

---

## Feature 5: Spending Pattern Detection

Identify notable patterns and surface them as insights.

### Patterns to Detect

| Pattern | Detection Logic | User Value |
|---------|-----------------|------------|
| Recurring expense | Same store, similar amount, regular interval | "Make recurring?" |
| Unusual spending | Day/week total >2x average | "Yesterday was your highest spending day" |
| Category spike | Category up >30% vs previous period | "Dining out is up this month" |
| New merchant | First time at this store | Track new habits |

### UI

**Transaction List Badge**
```
│  Monthly rent              ₱12,000  🔁  │  ← Recurring detected
│  Tap to make recurring                  │
```

**Stats Insights Section**
```
│  📊 Insights                            │
│  ─────────────────────────────────────  │
│  💡 Dining out up 32% vs last month     │
│  🔁 3 expenses look recurring           │
│  🎉 You stayed under budget in 4/5 funds│
```

---

## Feature 6: Proactive Alerts

Push notifications (opt-in) for time-sensitive budget information.

### Alert Types

| Alert | Timing | Message |
|-------|--------|---------|
| Budget warning | When fund hits 90% | "Groceries is almost at budget (₱180 left)" |
| Budget exceeded | When fund hits 100% | "Misc is ₱602 over budget" |
| Weekly summary | Sundays 6pm | "Good week! You stayed in budget" |
| Logging reminder | After 3 days of inactivity | "Don't break your streak! Log an expense" |

### Settings

```
Notifications
├── Weekly Summary ................ [ON]
├── Budget Warnings ............... [ON]
├── Logging Reminders ............. [OFF]
└── Quiet Hours .......... 10pm - 8am
```

---

## Privacy & Settings

### Settings Screen

```
AI Features
├── Enable AI Insights ............ [OFF] ← Master toggle
│
├── (When enabled)
│   ├── Smart Suggestions ......... [ON]
│   ├── Spending Patterns ......... [ON]
│   ├── Budget Health Score ....... [ON]
│   └── Natural Language Entry .... [ON]
│
└── Clear AI Data ............... [Button]
    "This will delete all cached insights and patterns"
```

### Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Store → Fund mappings | Server (encrypted) | Until user deletes |
| Whisper history | Device only | 30 days |
| Health score cache | Device only | Recalculated daily |
| Pattern analysis | Server (session only) | Not persisted |

---

## Implementation Phases

### Phase 3.1: Foundation

| Feature | Effort | Files |
|---------|--------|-------|
| AI opt-in toggle | Low | Settings screen, user preferences |
| Budget Health Score | Low | Dashboard header component |
| Smart Store suggestions | Low | Add expense form, uses existing Store.lastUsedFund |

### Phase 3.2: Insights

| Feature | Effort | Files |
|---------|--------|-------|
| Contextual Whispers | Medium | New whisper component, whisper content system |
| Spending pattern detection | Medium | Backend analytics, insights endpoint |

### Phase 3.3: Advanced

| Feature | Effort | Files |
|---------|--------|-------|
| Natural Language Entry | High | NLP parsing, preview UI |
| Proactive Alerts | Medium | Push notification service, alert preferences |

---

## Integration Points

This spec integrates with the [Dashboard Redesign](./spending-dashboard-redesign.md):

| Dashboard Feature | AI Enhancement |
|-------------------|----------------|
| Activity Tab alerts | AI whispers appear in same section |
| Budget progress bars | Health score badge |
| Stats comparison | AI-generated insights about trends |

---

## Open Questions

- [ ] Should whispers be shown in a dedicated "Insights" tab or inline?
- [ ] What's the right frequency for proactive alerts to avoid notification fatigue?
- [ ] Should we support voice input for natural language entry?
- [ ] How do we explain AI features during onboarding without overwhelming new users?
