# iOS App Store Submission Checklist

> Money Manager — Envelope Budgeting App

Use this checklist to ensure your app is ready for App Store review.

---

## App Store Connect Setup

- [ ] **App name**: Unique, appropriate, ≤30 characters
- [ ] **Subtitle**: Compelling, ≤30 characters (e.g., "Simple Envelope Budgeting")
- [ ] **Description**: Accurately describes envelope budgeting, folders, funds, and expense tracking
- [ ] **Keywords**: Relevant (budget, expense tracker, envelope budgeting, money manager, etc.)
- [ ] **Privacy Policy URL**: Provided and accessible
- [ ] **Support URL**: Valid and working
- [ ] **Category**: Finance (primary)
- [ ] **Age rating questionnaire**: Complete and accurate

---

## Screenshots & Media

- [ ] iPhone 6.7" screenshots (iPhone 15 Pro Max)
- [ ] iPhone 6.5" screenshots (iPhone 11 Pro Max)
- [ ] iPhone 5.5" screenshots (iPhone 8 Plus)
- [ ] iPad screenshots (if supporting tablets — `supportsTablet: true` is set)
- [ ] Screenshots show actual app functionality (dashboard, add expense, transactions)
- [ ] No placeholder or test data in screenshots
- [ ] Optional: App preview video (≤30 seconds)

---

## Privacy & Data Collection

> **Your app's advantage**: Manual entry, no bank linking = less data to declare.

### App Privacy "Nutrition Labels"
- [ ] **Contact info**: Email (via Clerk authentication)
- [ ] **Identifiers**: User ID, device ID (if applicable)
- [ ] **Financial data**: Expense amounts, budget data (stored on your server)
- [ ] Accurately declare all data collection types

### In-App Disclosures
- [ ] **Purpose strings** for any permissions requested
- [ ] No unnecessary permission requests (camera, location, etc. — verify if used)

---

## Authentication & Accounts

### Sign in with Apple
- [ ] **Sign in with Apple** is offered (required since you have Google Sign-In via Clerk)
- [ ] Both Apple and Google sign-in work correctly

### Account Deletion
- [ ] **Account deletion** is available in-app (required by Apple)
- [ ] Deletion actually removes user data from your database
- [ ] Clear messaging about what deletion means

### App Review
- [ ] **Demo account credentials** provided in App Review Notes (if needed)
- [ ] Test both authentication methods before submission

---

## Technical Requirements

### Build & SDK
- [ ] Built with latest stable Xcode
- [ ] Targets latest iOS SDK
- [ ] No crashes on launch
- [ ] No crashes during normal usage (dashboard, add expense, transactions)

### Network
- [ ] App works on IPv6 networks
- [ ] Graceful offline handling (appropriate error states when tRPC server unreachable)
- [ ] Uses HTTPS for all API calls (Vercel handles this)

### Code Compliance
- [ ] No private API usage
- [ ] No references to other platforms (Android, etc.)
- [ ] No placeholder content (Lorem ipsum, test data)

---

## App Content & Functionality

### Core Features (Phase 1)
- [ ] Dashboard with folders/funds loads correctly
- [ ] Create folder flow works end-to-end
- [ ] Create fund flow works end-to-end
- [ ] Add expense flow works end-to-end
- [ ] Transaction list displays correctly
- [ ] View/edit transaction works
- [ ] Authentication works (Apple + Google)
- [ ] User provisioning on first sign-in

### UI/UX
- [ ] No broken links or empty states without explanations
- [ ] All buttons/actions do what they claim
- [ ] Glass effects render correctly (`expo-glass-effect`)
- [ ] Animations are smooth (Reanimated)
- [ ] Haptic feedback works appropriately

### Data
- [ ] Amounts display correctly with proper currency formatting (`Intl.NumberFormat`)
- [ ] Budget calculations are accurate
- [ ] Fund types (SPENDING, NON_NEGOTIABLE) work correctly
- [ ] Time modes (WEEKLY, MONTHLY, BIMONTHLY, EVENTUALLY) work correctly

---

## Common Rejection Reasons to Avoid

- [ ] ❌ **Guideline 4.2**: App has minimum functionality (your app is NOT a simple wrapper)
- [ ] ❌ **Incomplete features**: All advertised features work
- [ ] ❌ **Beta/demo version**: App is production-ready
- [ ] ❌ **Misleading metadata**: Screenshots/description match actual app
- [ ] ❌ **Poor quality**: UI meets Apple's quality bar (you're using native iOS components ✓)
- [ ] ❌ **Missing Sign in with Apple**: Offered alongside Google Sign-In ✓
- [ ] ❌ **No account deletion**: Available in-app ✓

---

## Before Final Submission

### Testing
- [ ] Test on **physical iPhone devices** (not just simulator)
- [ ] Test on minimum supported iOS version
- [ ] Test both light and dark modes (`userInterfaceStyle: automatic`)
- [ ] Test portrait orientation only (`orientation: portrait`)
- [ ] Test on different screen sizes

### App Store Connect
- [ ] App version number is correct
- [ ] Build number is incremented
- [ ] All required metadata is filled
- [ ] **App Review Notes**: Include any special instructions
- [ ] Demo credentials if login required
- [ ] Export compliance declarations complete

### Final Checks
- [ ] Run `pnpm lint && pnpm type-check` — passes without errors
- [ ] Production API endpoint configured correctly
- [ ] Clerk production keys configured
- [ ] All environment variables set for production

---

## Post-Submission

- [ ] Monitor App Store Connect for status updates
- [ ] Be available to respond to App Review questions
- [ ] Have fixes ready if rejection occurs

---

> [!TIP]
> **Top rejection reasons**: crashes, incomplete functionality, missing Sign in with Apple, missing account deletion, and guideline 4.2 (minimum functionality). Your app should pass all of these with proper testing.
