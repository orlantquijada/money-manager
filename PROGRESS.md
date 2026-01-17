# Progress Notes

## Current Session
Working on: Insights & History Tab Split (spec: insights-history-tabs.json)
Last completed: TAB-001, TAB-002 - Navigation foundation with new tab labels/icons

## Recent Progress
- 2026-01-17: Insights & History tab split - Navigation foundation
  - Created ChartColumnDuoDark icon for Insights tab
  - Updated tab bar labels: spending→"Insights", transactions→"History"
  - Added index mapping comment to _layout.tsx (per pre-mortem mitigation)
  - Verified AnimatedTabScreen indexes match screen order
- 2026-01-08: Redesigned add expense flow for cleaner UX
  - Simplified header (close button + date picker only)
  - Removed "unlock notes" - notes now immediately accessible
  - Added bottom sheet for fund selection (grouped by folder)
  - Added bottom sheet for store selection
  - Smart defaults: selecting store pre-fills fund via lastSelectedFundId
  - Two stacked selection buttons (store/fund) with submit arrow
- 2026-01-08: Initial add expense flow
  - Lifted state to parent component for unified form control
  - Added transaction mutation with success haptics
  - Created fund selector with folder/fund cycling
  - Updated header with refresh button and context menu
  - Added "Unlock notes" feature with Alert.prompt for note editing
- 2026-01-08: Reorganized project docs (PRD, status.json, PROGRESS.md)
- Completed: Authentication with Clerk (Apple + Google sign-in)
- Completed: Dashboard with folders/funds display
- Completed: Create fund modal (multi-step with animations)
- Completed: Create folder modal
- Completed: Fund detail screen (shows recent transactions)
- Completed: Theme system (dark/light mode)
- Completed: Bottom sheet components
- Completed: Numpad + amount input UI

## What's Built
- Dashboard with folders/funds display
- Create fund modal (multi-step with animations)
- Create folder modal
- Fund detail screen (shows recent transactions)
- Theme system (dark/light mode)
- Bottom sheet components
- Numpad + amount input UI
- Authentication (Clerk with Apple + Google)
- Add expense flow (fund selection, notes, submission)

## What's Missing for MVP
- User provisioning on first sign-in
- Transactions tab
- Onboarding experience

## Blockers / Notes
- Store creation in transaction mutation is currently commented out (needs fix)
- Development is iOS-first to streamline iteration
