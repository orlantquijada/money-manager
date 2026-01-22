import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight,
} from "expo-symbols";
import type { StyleProp, ViewStyle } from "react-native";
import { withUniwind } from "uniwind";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      name={name}
      resizeMode="scaleAspectFit"
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
      tintColor={color}
      weight={weight}
    />
  );
}

export const StyledIconSymbol = withUniwind(IconSymbol, {
  color: {
    fromClassName: "colorClassName",
    styleProperty: "accentColor",
  },
});
