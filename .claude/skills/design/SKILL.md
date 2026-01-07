---
name: design
description: Generate iOS screens and components for Money Manager following design patterns. Use when building UI components, screens, or features for the mobile app, or when the user mentions design, styling, glass effects, or iOS-specific features.
---

# Design Skill

Generate iOS screens and components following Money Manager design patterns.

## Before You Start

Read these codebase files to understand the design system:
- `apps/mobile/src/global.css` - Color tokens and theme variables
- `apps/mobile/src/config/interop.ts` - Base styled components
- `apps/mobile/src/utils/motion.ts` - Animation utilities

## Reference Files (Read When Needed)

| When you need... | Read this file |
|------------------|----------------|
| Component/Screen templates | `component-patterns.md` |
| iOS features (Glass, Symbols, Haptics, SwiftUI) | `ios-enhancements.md` |
| Animation guidance, depth, avoiding generic AI aesthetics | `anti-patterns.md` |
| Database schema | `packages/db/src/schema.ts` |
| Project conventions | `CLAUDE.md` |

---

## Workflow

### 1. Understand the Request
Identify the type of work:
- **Component**: Reusable UI element → `components/`
- **Screen**: Full route → `app/`
- **Feature**: Multiple components + screens

Ask clarifying questions if ambiguous.

### 2. Research Existing Patterns
- Search for similar components in `apps/mobile/src/components/`
- Read 2-3 similar components to understand patterns
- Identify which base components to reuse (`StyledLeanView`, `StyledLeanText`, `ScalePressable`)

### 3. Load Relevant References
Based on task type, read the appropriate reference file from this skill folder:
- Building a component/screen? → `component-patterns.md`
- Adding iOS features? → `ios-enhancements.md`
- Need animation/depth guidance? → `anti-patterns.md`

### 4. Implement with Critical Conventions (MUST FOLLOW)

| Rule | Example |
|------|---------|
| `numberOfLines` requires `ellipsizeMode` | `<StyledLeanText numberOfLines={1} ellipsizeMode="tail">` |
| Currency uses `font-nunito-bold` | `<StyledLeanText className="font-nunito-bold">{formatter.format(amount)}</StyledLeanText>` |
| Rounded elements need `borderCurve` | `style={{ borderCurve: "continuous" }}` |
| Interactive elements need a11y | `accessibilityLabel`, `accessibilityRole="button"` |

### 5. Validate
```bash
cd apps/mobile && pnpm type-check
cd apps/mobile && pnpm lint
```

**Checklist**:
- Design system applied? (colors, typography, spacing)
- iOS enhancements used? (glass, symbols, haptics)
- Critical conventions followed? (borderCurve, ellipsizeMode, currency font)
- Accessibility included?

---

## Design System Quick Reference

### Colors (Semantic)
| Purpose | Background | Text |
|---------|------------|------|
| Primary | `bg-background` | `text-foreground` |
| Secondary | `bg-card` | `text-foreground-secondary` |
| Muted | `bg-muted` | `text-foreground-muted` |
| Action | `bg-primary` | `text-primary-foreground` |

### Typography
| Use | Class |
|-----|-------|
| UI text | `font-satoshi`, `font-satoshi-medium`, `font-satoshi-bold` |
| Numbers/Currency | `font-nunito-bold` |
| Monospace | `font-azeret-mono-regular` |

### Rounded Corners
| Element | Class |
|---------|-------|
| Cards | `rounded-2xl` (16px) |
| Buttons | `rounded-xl` (12px) |
| Pills | `rounded-full` |

Always add `style={{ borderCurve: "continuous" }}`

---

## Remember

- **Be Distinctive**: Avoid generic "AI slop"—read `anti-patterns.md`
- **Be Proactive**: Apply iOS enhancements—read `ios-enhancements.md`
- **Be Orchestrated**: Focus on high-impact animation moments, not scattered micro-interactions
- **Be Layered**: Create depth through glass effects and z-layering

**The test**: Would a human designer be proud of this, or does it look AI-generated?
