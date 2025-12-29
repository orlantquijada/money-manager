import { createElement, type Ref } from "react";
import type { TextProps, View } from "react-native";

export default function LeanView(props: TextProps & { ref?: Ref<View> }) {
  return createElement("RCTView", props);
}
LeanView.displayName = "RCTView";
