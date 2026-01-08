# Component & Screen Patterns

Reference for building components and screens in Money Manager.

## Component Template (Reusable UI Element)

```tsx
import { useState } from "react";
import type { ViewStyle } from "react-native";
import { StyledLeanView, StyledLeanText } from "@/config/interop";
import { useThemeColor } from "@/components/theme-provider";
import * as Haptics from "expo-haptics";
import { cn } from "@/utils/cn";

// 1. Define Props type first
type MyComponentProps = {
  // Required props first
  title: string;
  onAction: (id: string) => void;
  // Optional props
  description?: string;
  className?: string;
  style?: ViewStyle;
};

// 2. Component implementation
export default function MyComponent({
  title,
  onAction,
  description,
  className,
  style,
}: MyComponentProps) {
  // State management
  const [isActive, setIsActive] = useState(false);

  // Theme colors
  const foreground = useThemeColor("foreground");
  const cardBackground = useThemeColor("card");
  const primary = useThemeColor("primary");

  // Event handlers
  const handlePress = () => {
    // Add light haptic feedback for navigation/selection
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActive(!isActive);
    onAction("action-id");
  };

  // Render
  return (
    <StyledLeanView
      className={cn("rounded-2xl bg-card p-4", className)}
      style={[{ borderCurve: "continuous" }, style]}
    >
      <StyledLeanText className="font-satoshi-bold text-foreground">
        {title}
      </StyledLeanText>
      {description && (
        <StyledLeanText
          className="mt-2 text-foreground-secondary"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </StyledLeanText>
      )}
    </StyledLeanView>
  );
}
```

## Screen Template (Full Route)

```tsx
import { Stack } from "expo-router";
import { StyledSafeAreaView } from "@/config/interop";
import { useState } from "react";

export default function ScreenName() {
  const [state, setState] = useState("");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Screen Title",
          presentation: "card", // or "modal"
        }}
      />
      <StyledSafeAreaView className="flex-1 bg-background">
        {/* Screen content */}
      </StyledSafeAreaView>
    </>
  );
}
```

## File Organization

### Component Location
- Reusable: `apps/mobile/src/components/{feature}/{component-name}.tsx`
- Screen: `apps/mobile/src/app/(app)/route/structure`
- iOS-only: Use `.ios.tsx` extension

### Naming Conventions
- Files: kebab-case (`glass-button-icon.tsx`)
- Components: PascalCase (`GlassButtonIcon`)
- Types: `ComponentNameProps`

### Import Order
1. External packages (`react`, `react-native`, etc.)
2. Internal packages (`@/config/...`, `@/components/...`)
3. Relative imports (`./...`)

### Export Pattern
- `export default` for primary component
- Named exports for utilities/types if needed

## Type Safety with API Types

```tsx
import type { RouterOutputs } from "api";

// Get type from tRPC query
type Transaction = RouterOutputs["transaction"]["allThisMonth"][number];
type Fund = RouterOutputs["fund"]["getById"]["data"];

type ComponentProps = {
  transaction: Transaction;
  onUpdate: (updatedTransaction: Transaction) => void;
};
```
