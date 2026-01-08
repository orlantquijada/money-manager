# iOS-Specific Enhancements

These features separate a premium native experience from generic cross-platform apps. Use them to create depth, delight, and distinctive character.

## 1. Glass Effects (expo-glass-effect)

Use for: Tab bars, floating buttons, cards with visual depth, interactive surfaces.

```tsx
import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { useThemeColor } from "@/components/theme-provider";

const tintColor = useThemeColor("background");

<GlassView
  glassEffectStyle="regular"
  isInteractive
  style={{
    borderRadius: 20,
    borderCurve: "continuous",
  }}
  tintColor={tintColor}
>
  {children}
</GlassView>
```

**When to use**:
- Floating buttons (submit, quick actions)
- Card surfaces that need depth
- Tab bars and navigation elements
- Overlay surfaces

## 2. SF Symbols (expo-symbols)

Use for: System-style icons that should feel native.

```tsx
import { SymbolView } from "expo-symbols";
import { useThemeColor } from "@/components/theme-provider";

const iconColor = useThemeColor("foreground");

<SymbolView
  name="chevron.right"
  size={20}
  tintColor={iconColor}
/>
```

**Common symbols**: `chevron.right`, `checkmark`, `plus`, `trash`, `clock`, `calendar`, `location`, `gear`

**When to use**:
- Navigation indicators (chevrons, arrows)
- Common actions (plus, minus, trash, checkmark)
- System icons (clock, calendar, location, settings)
- Instead of custom SVG for standard iOS icons

## 3. Haptic Feedback (expo-haptics)

Use for: Meaningful interactions to give tactile response.

```tsx
import * as Haptics from "expo-haptics";

// Light haptic for navigation/selection
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium haptic for important selections
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy haptic for destructive actions
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success/error/warning notifications
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

**When to use**:
- Button presses (Light)
- Tab switches or selections (Light)
- Confirmation dialogs (Medium)
- Deletions or destructive actions (Heavy)
- Save/submit success (Notification.Success)
- Error states (Notification.Error)

## 4. SwiftUI Components (@expo/ui/swift-ui)

Use for: Native pickers, date selectors, context menus, native controls.

### Native Glass Button

```tsx
import { Button } from "@expo/ui/swift-ui";
import { padding, frame } from "@expo/ui/swift-ui/modifiers";

<Button
  variant="glassProminent"
  color={mutedColor}
  controlSize="large"
  modifiers={[padding({ all: 16 }), frame({ width: 250 })]}
  onPress={handleAction}
>
  Button Text
</Button>
```

### Context Menu (Native iOS Menu)

```tsx
import { ContextMenu, Button } from "@expo/ui/swift-ui";

<ContextMenu>
  <ContextMenu.Items>
    <Button onPress={handleEdit} systemImage="pencil">
      Edit
    </Button>
    <Button onPress={handleDelete} systemImage="trash">
      Delete
    </Button>
  </ContextMenu.Items>
  <ContextMenu.Trigger>
    {/* Element that triggers menu on long press */}
  </ContextMenu.Trigger>
</ContextMenu>
```

### Native Date Picker

```tsx
import { DateTimePicker } from "@expo/ui/swift-ui";

<DateTimePicker
  color={foregroundColor}
  initialDate={new Date().toISOString()}
  onDateSelected={handleDateChange}
  variant="graphical"
/>
```

### Native Picker

```tsx
import { Picker } from "@expo/ui/swift-ui";

<Picker
  selectedValue={selected}
  onValueChange={setSelected}
>
  <Picker.Item label="Option 1" value="option1" />
  <Picker.Item label="Option 2" value="option2" />
</Picker>
```

### Native Switch

```tsx
import { Switch } from "@expo/ui/swift-ui";

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
/>
```

**When to use**:
- Date/time selection → Use `DateTimePicker` with `BottomSheet`
- Options menu → Use `ContextMenu` for long-press actions
- Select from list → Use native `Picker`
- Toggle states → Use native `Switch`
- Important buttons → Use `Button` with `glassProminent` variant

### ⚠️ IMPORTANT: SwiftUI Component Limitations

**SwiftUI components with `glassEffect` modifier (`Host`, `HStack`, `VStack`, `Image`) should ONLY be used inside `ContextMenu.Trigger`, NOT for general UI.**

These components can cause rendering issues when used outside of ContextMenu:

```tsx
// ❌ DON'T: Using SwiftUI components for regular glass buttons
<Host matchContents>
  <HStack modifiers={[frame({ height: 40 }), glassEffect({ ... })]}>
    <Image systemName="plus" />
  </HStack>
</Host>

// ✅ DO: Use GlassButton from @/components/glass-button-icon
import GlassButton, { GlassIconButton } from "@/components/glass-button-icon";
import { IconSymbol } from "@/components/ui/icon-symbol";

// For icon-only buttons with SF Symbols
<GlassIconButton icon="arrow.clockwise" onPress={handleRefresh} />

// For buttons with text/mixed content
<GlassButton variant="default" tintColor={tintColor} onPress={handlePress}>
  <IconSymbol name="folder" color={iconColor} size={16} />
  <StyledLeanText>Label</StyledLeanText>
</GlassButton>

// For icon-only circular buttons
<GlassButton variant="icon" onPress={handlePress}>
  <IconSymbol name="arrow.right" color={iconColor} size={20} />
</GlassButton>
```

**Glass Button API**:
- `variant="icon"`: Circular button for icons (uses `size` for diameter: "sm", "md", "lg")
- `variant="default"`: Pill-shaped button that auto-sizes to content
- `tintColor`: Glass tint color (use `useThemeColor("muted")`)
- Use `IconSymbol` from `@/components/ui/icon-symbol` for SF Symbols
