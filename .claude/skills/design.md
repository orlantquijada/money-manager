---
allowed-tools: Read(*), Glob(apps/mobile/src/**), Write(apps/mobile/src/**), Edit(apps/mobile/src/**), Bash(pnpm:*)
description: Generate iOS screens and components following Money Manager design patterns
model: claude-opus-4-5-20251101
---

## Context (Always Loaded)

- Color tokens: !`cat apps/mobile/src/global.css`
- Base components: !`cat apps/mobile/src/config/interop.ts`
- Motion utilities: !`cat apps/mobile/src/utils/motion.ts`

## Reference Files (Load When Needed)

| Need | File |
|------|------|
| Component/Screen templates | `.claude/skills/design/component-patterns.md` |
| iOS features (Glass, Symbols, Haptics, SwiftUI) | `.claude/skills/design/ios-enhancements.md` |
| Animations, depth, anti-patterns | `.claude/skills/design/anti-patterns.md` |
| Database schema | `packages/db/src/schema.ts` |
| Project conventions | `CLAUDE.md` |

---

## Your Task

The user wants you to design and implement: **{{USER_INPUT}}**

---

## Workflow

### 1. Understand the Request
Identify the type of work:
- **Component**: Reusable UI element → `components/`
- **Screen**: Full route → `app/`
- **Feature**: Multiple components + screens

Ask clarifying questions if ambiguous.

### 2. Research Existing Patterns
- Use Glob to find similar components in `apps/mobile/src/components/`
- Read 2-3 similar components to understand patterns
- Identify which base components to reuse (`StyledLeanView`, `StyledLeanText`, `ScalePressable`)

### 3. Load Relevant References
Based on task type, read the appropriate reference file:
- Building a component/screen? → `design/component-patterns.md`
- Adding iOS features? → `design/ios-enhancements.md`
- Need animation/depth guidance? → `design/anti-patterns.md`

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

- **Be Distinctive**: Avoid generic "AI slop"—read `design/anti-patterns.md`
- **Be Proactive**: Apply iOS enhancements—read `design/ios-enhancements.md`
- **Be Orchestrated**: Focus on high-impact animation moments, not scattered micro-interactions
- **Be Layered**: Create depth through glass effects and z-layering

**The test**: Would a human designer be proud of this, or does it look AI-generated?
