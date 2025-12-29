import type { Ref } from "react";
import type { Text, TextProps } from "react-native";
import { NativeText } from "react-native/Libraries/Text/TextNativeComponent";

export default function LeanText(props: TextProps & { ref?: Ref<Text> }) {
  return <NativeText {...props} />;
}

LeanText.displayName = "RCTText";
