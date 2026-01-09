import { createElement, type Ref } from "react";
import type { Text, TextProps } from "react-native";

export default function LeanText(props: TextProps & { ref?: Ref<Text> }) {
  return createElement("RCTText", props);
}

LeanText.displayName = "RCTText";
