# Money Manager — Monthly Insights

## What This Is

A Monthly Insights screen for the Money Manager envelope budgeting app. A new bottom tab that gives users a calm, reassuring overview of their monthly finances — with AI-generated plain-English summaries, envelope health snapshots, and gentle suggestions. Designed for beginners who might feel anxious about money.

## Core Value

Users feel reassured and in control, not judged or overwhelmed.

## Requirements

### Validated

- ✓ User authentication via Clerk — existing
- ✓ User can create folders and funds (envelopes) — existing
- ✓ User can record transactions against funds — existing
- ✓ User can view transactions by period — existing
- ✓ Dashboard with fund balances and progress — existing

### Active

- [ ] New Insights tab in bottom navigation
- [ ] Monthly Summary card with AI-generated plain-English text (Gemini Flash)
- [ ] Envelope Health Snapshot showing counts: on track / at risk / overspent
- [ ] Key Highlights showing most overspent and most leftover envelopes
- [ ] Month-to-Month Comparison (hidden if first month)
- [ ] Spending breakdown chart (donut/bar, top 5 + "everything else")
- [ ] Rule-based Gentle Suggestion card

### Out of Scope

- Historical month navigation — MVP shows current month only, defer to v2
- Advanced analytics or charts — keeping it simple and skimmable
- AI-generated suggestions — using rule-based logic for MVP
- Push notifications about insights — focus on pull-based screen first

## Context

**Existing codebase:**
- Expo SDK 54, React Native 0.81, React 19
- tRPC + Hono backend, Drizzle ORM + PostgreSQL
- Clerk authentication, TanStack Query for server state
- Uniwind for styling (Tailwind for RN)
- d3-shape already available for charts
- iOS-focused with glass effects, haptics, SF Symbols

**Visual style:**
- Rounded cards, minimal text
- iOS-style spacing and typography
- Color cues: green (on track), yellow (at risk), red (overspent)
- One insight per card, skimmable in under 5 seconds

**Data model implications:**
- Transactions already have fund associations
- Period-based filtering exists
- May need monthly aggregation queries
- Gemini Flash integration for AI summaries (new)

## Constraints

- **Tech stack**: Must use existing stack (Expo, tRPC, Drizzle, Uniwind)
- **AI service**: Gemini Flash for speed/cost on summary generation
- **Platform**: iOS primary (use *.ios.tsx for platform-specific)
- **Visual style**: Must match existing dashboard aesthetic
- **UX**: Each section skimmable in <5 seconds, no dense tables

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| AI summaries via Gemini Flash | Speed and cost-effective for simple summaries | — Pending |
| Rule-based suggestions | Simpler than AI for MVP, can upgrade later | — Pending |
| Current month only | Reduce scope for MVP, add history in v2 | — Pending |
| New bottom tab (not dashboard card) | Dedicated space for insights, don't clutter dashboard | — Pending |
| Hide sections with no data | Cleaner than showing empty states | — Pending |

---
*Last updated: 2026-01-22 after initialization*
