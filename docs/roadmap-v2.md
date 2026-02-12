# Roadmap v2

This document outlines the features and improvements planned for the next major version (v2) of Money Manager. It consolidates deferred items from v1 specifications and gaps identified in the vision alignment.

## 1. Budget Score (Expanded)
*Deferred from v1. Ref: `docs/specs/budget-score-modal.json`*

The API is ready (`budget.scoreDetails`), but the rich UI implementation is deferred.

- **Score Header Component:** Large score number with status indicator (green/amber/red) and collapsible "How is this calculated?" explanation.
- **Grouped Fund List:** Funds grouped by status (Over Budget, At Risk, On Track) with utilization progress bars.
- **Insight Card:** Actionable tips (e.g., "Bring Electric back on track to gain +20 points").
- **Modal Route Polish:** Full sheet-style modal composing the above components.
- **History & Trends:** Sparkline charts for score history.

## 2. Understanding Your Finances (Insights)
*Ref: `docs/vision-alignment.md`*

- **Trends over Time:** Visualizing spending improvements or regression.
- **Spending Patterns:** Identifying when overspending occurs (e.g., weekends vs. weekdays).
- **Plain-language Insights:** "You spent 40% more on Food this month."
- **Summaries:** Weekly/monthly digests.

## 3. Onboarding & Setup
*Ref: `docs/vision-alignment.md`*

- **First-time User Experience (FTUE):** Guided setup flow for new users.
- **Templates:** Pre-filled fund sets (Groceries, Transport, Entertainment).
- **Budgeting Guidance:** Helpers for deciding *how much* to budget.
- **Education:** Explainers for "Spending" vs "Non-Negotiable" funds and time modes.

## 4. Beginner-Friendly Features
*Ref: `docs/vision-alignment.md`*

- **Income Tracking:** Explicit tracking of income to know what is available to budget.
- **Recurring Transactions:** Auto-logging for fixed bills/subscriptions.
- **"To Be Budgeted" Pool:** Unallocated money bucket (YNAB style).
- **Rollover Handling:** UI for managing unused funds (currently implicit).

## 5. Fund Detail Enhancements
*Ref: `docs/specs/fund-detail-view.json`*

- **Inline Budget Editing:** Edit budget amount directly from the fund detail header.
- **Spending Trends Chart:** Visual history of spending for the specific fund.
- **Period Comparison:** Explicit "vs last month" stats.
- **Fund Transfers:** UI to move money from one fund to another.

## 6. Platform Strategy
*Ref: `docs/vision-alignment.md`*

- **Android Support:** Verify and polish for Android devices.
- **Web Dashboard:** Desktop view for power users.
