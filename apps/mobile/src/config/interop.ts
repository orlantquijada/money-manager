import { cssInterop } from "nativewind";
import { Svg } from "react-native-svg";
import LeanText from "@/components/lean-text";
import LeanView from "@/components/lean-view";

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { width: true, height: true },
  },
});

cssInterop(LeanView, {
  className: {
    target: "style",
  },
});

cssInterop(LeanText, {
  className: {
    target: "style",
  },
});
