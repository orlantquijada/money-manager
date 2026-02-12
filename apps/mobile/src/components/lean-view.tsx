import { createElement, type Ref } from "react";
import type { View, ViewProps } from "react-native";

export default function LeanView(props: ViewProps & { ref?: Ref<View> }) {
  return createElement("RCTView", props);
}
LeanView.displayName = "RCTView";
