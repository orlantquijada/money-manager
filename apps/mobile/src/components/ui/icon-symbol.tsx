// Fallback for using MaterialCommunityIcons on Android and web.

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { SymbolViewProps, SymbolWeight } from "expo-symbols";
import type { ComponentProps } from "react";
import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import { withUniwind } from "uniwind";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

/**
 * Add your SF Symbols to Material Community Icons mappings here.
 * - see Material Community Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code-tags",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "ellipsis.circle": "dots-horizontal-circle-outline",
  ellipsis: "dots-horizontal",
  "sun.max.fill": "weather-sunny",
  "moon.fill": "weather-night",
  iphone: "cellphone",
  xmark: "close",
  envelope: "email-outline",
  at: "at",
  "person.crop.circle": "account-circle-outline",
  sparkles: "auto-fix",
  folder: "folder-outline",
  clock: "clock-outline",
  "bell.badge": "bell-badge-outline",
  "square.and.arrow.up": "export-variant",
  trash: "trash-can-outline",
  "hand.raised": "hand-pointing-up",
  "doc.text": "file-document-outline",
  "rectangle.portrait.and.arrow.right": "logout",
  "arrow.up.right": "open-in-new",
  "chevron.up.chevron.down": "unfold-more-horizontal",
  "person.circle.fill": "account-circle",
  plus: "plus",
  "chart.pie": "chart-pie",
  "xmark.circle.fill": "close-circle",
  magnifyingglass: "magnify",
} satisfies Partial<IconMapping>;

type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Community Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Community Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialCommunityIcons
      color={color}
      name={MAPPING[name]}
      size={size}
      style={style}
    />
  );
}

export const StyledIconSymbol = withUniwind(IconSymbol, {
  color: {
    fromClassName: "colorClassName",
    styleProperty: "accentColor",
  },
});
