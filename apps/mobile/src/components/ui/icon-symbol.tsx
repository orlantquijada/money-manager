// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SymbolViewProps, SymbolWeight } from "expo-symbols";
import type { ComponentProps } from "react";
import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import { withUniwind } from "uniwind";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "ellipsis.circle": "more-horiz",
  "sun.max.fill": "wb-sunny",
  "moon.fill": "nightlight-round",
  iphone: "smartphone",
  xmark: "close",
  envelope: "email",
  at: "alternate-email",
  "person.crop.circle": "account-circle",
  sparkles: "auto-awesome",
  folder: "folder",
  clock: "schedule",
  "bell.badge": "notifications",
  "square.and.arrow.up": "share",
  trash: "delete",
  "hand.raised": "pan-tool",
  "doc.text": "description",
  "rectangle.portrait.and.arrow.right": "logout",
  "arrow.up.right": "open-in-new",
  "chevron.up.chevron.down": "unfold-more",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
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
    <MaterialIcons
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
