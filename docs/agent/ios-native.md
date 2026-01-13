# iOS Native Features

Platform-specific components use the `*.ios.tsx` file extension (e.g., `date-selector.ios.tsx`).

## Available iOS Libraries

| Library | Purpose |
|---------|---------|
| `@expo/ui` | SwiftUI components: `Button` (with `glassProminent`), `DateTimePicker`, `Picker`, `Switch`, `TextField`, `ContextMenu`, `BottomSheet`, layouts (`VStack`, `HStack`), `glassEffect()` |
| `expo-glass-effect` | `GlassView` and `GlassContainer` for liquid glass/frosted glass effects |
| `expo-symbols` | SF Symbols via `SymbolView` component |
| `expo-haptics` | Haptic feedback for tactile interactions |

## Usage Guidelines

- **SwiftUI components**: Use for pickers, date selectors, and context menus—they feel native
- **Glass effects**: Apply to key interactive elements (tab bars, floating buttons), not every surface
- **SF Symbols**: Use for system-style icons; keep custom icons for brand elements
- **Haptics**: Add to meaningful actions (tab changes, confirmations), not every tap
