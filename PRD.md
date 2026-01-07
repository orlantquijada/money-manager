# Money Manager - Product Requirements Document

## Vision

A **simple, beautiful, habit-building** budgeting app that respects user privacy.

**Core Principles:**
- **Simplicity first** - Only the essentials for envelope budgeting
- **Design-forward** - Premium feel with thoughtful animations
- **Behavioral focus** - Help users build habits, not just track numbers
- **Privacy-conscious** - Manual entry, no bank linking

---

## Target User

People who are intimidated by budgeting but want to take control of their finances. They value:
- Clean, beautiful interfaces
- Low friction to get started
- Encouragement over guilt
- Privacy (no bank account linking)

---

## MVP Scope

### Phase 1: Core Tracking
*Goal: Basic budgeting works end-to-end*

| Feature | Status | Priority |
|---------|--------|----------|
| Authentication (Clerk) | ✅ Done | P0 |
| User provisioning | ✅ Done | P0 |
| Dashboard with folders/funds | ✅ Done | P0 |
| Create folder | ✅ Done | P0 |
| Create fund | ✅ Done | P0 |
| **Add expense flow** | 🚧 In Progress | P0 |
| Transactions list | ⬜ Todo | P0 |
| View/edit transaction | ⬜ Todo | P1 |

### Phase 2: Onboarding
*Goal: New users set up in < 3 minutes*

| Feature | Status | Priority |
|---------|--------|----------|
| Welcome screen | ⬜ Todo | P0 |
| Guided setup wizard | ⬜ Todo | P0 |
| Budget templates | ⬜ Todo | P1 |
| Educational tooltips | ⬜ Todo | P2 |

### Phase 3: Insights
*Goal: Users understand spending patterns through subtle, encouraging guidance*

| Feature | Status | Priority |
|---------|--------|----------|
| AI opt-in toggle + Settings | ⬜ Todo | P1 |
| Contextual whispers | ⬜ Todo | P1 |
| Spending trends | ⬜ Todo | P1 |
| Category breakdown | ⬜ Todo | P1 |
| Budget health indicators | ⬜ Todo | P1 |
| Streaks & habits | ⬜ Todo | P2 |

### Phase 4: Polish
*Goal: Every interaction feels intentional*

| Feature | Status | Priority |
|---------|--------|----------|
| Screen transitions | ⬜ Todo | P1 |
| Micro-interactions | ⬜ Todo | P1 |
| Gesture-driven UX | ⬜ Todo | P2 |
| Haptic feedback | ⬜ Todo | P2 |

---

## Data Model

```
User
  └── Folders (e.g., "Monthly Bills", "Fun Money")
        └── Funds (e.g., "Rent", "Groceries")
              └── Transactions (expenses)

Stores (merchants, linked to last-used fund)
```

**Fund Types:**
- `SPENDING` - Regular expenses (groceries, entertainment)
- `NON_NEGOTIABLE` - Fixed bills (rent, utilities)

**Time Modes:**
- `WEEKLY` - Budget resets weekly
- `MONTHLY` - Budget resets monthly
- `BIMONTHLY` - Budget resets every 2 months
- `EVENTUALLY` - No reset, accumulates

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo SDK 54, React Native 0.81, React 19 |
| Routing | Expo Router (file-based) |
| Styling | Uniwind (Tailwind CSS v4 for RN) |
| State | Zustand (client), TanStack Query (server) |
| API | tRPC v11 with superjson |
| Database | PostgreSQL with Drizzle ORM |
| Auth | Clerk |
| Backend | Hono server on Vercel |

---

## Privacy & AI

- **Opt-in only** — AI features off by default
- **No training** — User data never trains AI models
- **Reversible** — Disabling AI clears cached insights

---

## Design System

### Components

**GlassButton** - Frosted glass button with variants:
- `variant="icon"` - Circular, fixed size (sm/md/lg)
- `variant="default"` - Pill-shaped, auto-sizes to content

**CreateFooter** - Modal footer with:
- `variant="text"` - Pill button with label ("Save Folder")
- `variant="icon-only"` - Circular with icon (chevron/checkmark)
- `isFinalAction` - Shows checkmark instead of chevron

### Theme Colors
- `background` / `foreground`
- `muted` / `muted-foreground`
- `border`

### Typography
- Font: Satoshi
- Weights: Regular, Medium, Bold

---

## Current Focus

### Add Expense Flow
The next priority is completing the expense entry flow:
1. Wire up numpad to form state
2. Fund selection (bottom sheet)
3. Store selection/creation
4. Optional note input
5. Success feedback with haptics

### Footer Button Polish
Updated `GlassButton` with shadcn-like API for proper text button sizing.

---

## Future Considerations

- Recurring transactions
- Multiple accounts
- Export data (CSV/PDF)
- Home screen widgets
- Apple Watch app
- Shared budgets
- Optional bank sync
- **Wrapped** - Annual spending summary (like Spotify Wrapped)

---

## Commands

```bash
# Development
pnpm dev              # Start all workspaces
pnpm studio           # Open Drizzle Studio

# Database
cd packages/db
pnpm generate         # Generate migrations
pnpm push             # Push schema changes
pnpm migrate          # Run migrations

# Type checking
pnpm type-check       # Check all workspaces
```
