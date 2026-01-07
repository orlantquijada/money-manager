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

- Authentication (Clerk with Apple + Google)
- User provisioning on first sign-in
- Dashboard with folders/funds
- Create folder and fund
- Add expense flow
- Transactions list
- View/edit transaction

### Phase 2: Onboarding
*Goal: New users set up in < 3 minutes*

- Welcome screen
- Guided setup wizard
- Budget templates
- Educational tooltips

### Phase 3: Insights
*Goal: Users understand spending patterns through subtle, encouraging guidance*

- AI opt-in toggle + Settings
- Contextual whispers
- Spending trends
- Category breakdown
- Budget health indicators
- Streaks & habits

### Phase 4: Polish
*Goal: Every interaction feels intentional*

- Screen transitions
- Micro-interactions
- Gesture-driven UX
- Haptic feedback

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

- **Opt-in only** - AI features off by default
- **No training** - User data never trains AI models
- **Reversible** - Disabling AI clears cached insights

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

## Design Principles

1. **Progressive disclosure** - Don't overwhelm. Show complexity only when needed.
2. **Celebrate progress** - Use animation to reward good behavior.
3. **Forgiving** - Make it easy to undo, edit, recover from mistakes.
4. **Fast** - Every interaction should feel instant.
5. **Personal** - This is your money, your way.

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
