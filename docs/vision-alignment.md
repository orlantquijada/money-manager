# Vision Alignment Assessment

**Vision:** Create the best, prettiest, most user/beginner-friendly budgeting app in the world. Focus on budgeting + expense tracking + understanding finances.

**Assessment Date:** January 2026

---

## Current Alignment: ~60%

| Pillar | Status | Notes |
|--------|--------|-------|
| Best budgeting | ✓ | Solid envelope system with folders, funds, time modes |
| Prettiest | ✓ | iOS-native components, glass effects, haptics, animations |
| Beginner-friendly | ⚠️ | Core flows exist, onboarding/guidance thin |
| Understanding finances | ⚠️ | Basic stats only, no insights/trends |

---

## What's Working

### 1. Solid Envelope Budgeting Core
- Data model: Folders → Funds → Transactions
- Fund types: SPENDING vs NON_NEGOTIABLE
- Time modes: WEEKLY, MONTHLY, BIMONTHLY, EVENTUALLY
- Budget Score gamification (0-100)

### 2. iOS-Native Polish
- Liquid glass effects (`expo-glass-effect`)
- SF Symbols via `expo-symbols`
- Haptic feedback throughout
- SwiftUI components via `@expo/ui`
- Spring-based animations

### 3. Quick Expense Entry
- Custom numpad for fast input
- Store → Fund auto-fill
- Recent funds in picker
- Native date selector

---

## Gaps

### 1. "Understanding Your Finances" Underdeveloped

**Current:**
- Pie chart (spending by fund)
- Period comparison

**Missing:**
- Trends over time (am I improving?)
- Spending patterns (when do I overspend?)
- Plain-language insights ("You spent 40% more on Food this month")
- Weekly/monthly summaries

### 2. Onboarding & Setup Friction

Envelope budgeting has a learning curve. Missing:
- First-time user experience
- Templates for common funds (Groceries, Transport, Entertainment)
- Guidance on how much to budget
- Explanation of fund types and time modes

### 3. Beginner-Friendly Features

Things typical beginner budgeters need:
- **Income tracking** - know what's available to budget
- **Recurring transactions** - auto-log bills
- **"To Be Budgeted" pool** - YNAB-style unallocated money
- **Rollover handling** - what happens to unused money?

### 4. Platform Strategy

Currently iOS-only for iteration speed. Open questions:
- iOS-only forever or cross-platform later?
- Does "best in the world" require Android?

---

## Open Questions

1. **Simplicity vs power-user features** - Where's the line?
2. **Onboarding priority** - Should this be the next major focus?
3. **Insights depth** - How much analytics before it's overwhelming?
4. **Income/rollover** - Full YNAB-style budgeting or keep it simpler?

---

## Next Steps

_To be determined based on answers to open questions._
