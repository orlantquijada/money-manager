import { BottomSheetView } from "@gorhom/bottom-sheet";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import LeanText from "@/components/lean-text";
import LeanView from "@/components/lean-view";

export const StyledLeanView = withUniwind(LeanView);
export const StyledLeanText = withUniwind(LeanText);

export const StyledSafeAreaView = withUniwind(SafeAreaView);

export const StyledBottomSheetView = withUniwind(BottomSheetView);

export const StyledGlassView = withUniwind(GlassView);
