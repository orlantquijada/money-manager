import { BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import { withUniwind } from "uniwind";
import LeanText from "@/components/lean-text";
import LeanView from "@/components/lean-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export const StyledSvg = withUniwind(Svg);
export const StyledPath = withUniwind(Path, {
  fill: {
    fromClassName: "fillClassName",
    styleProperty: "color",
  },
  stroke: {
    fromClassName: "strokeClassName",
    styleProperty: "color",
  },
});

export const StyledLeanView = withUniwind(LeanView);
export const StyledLeanText = withUniwind(LeanText);

export const StyledSafeAreaView = withUniwind(SafeAreaView);

export const StyledBottomSheetView = withUniwind(BottomSheetView);

export const StyledIconSymbol = withUniwind(IconSymbol);
