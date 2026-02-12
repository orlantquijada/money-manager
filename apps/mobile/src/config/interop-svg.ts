import { Path, Svg } from "react-native-svg";
import { withUniwind } from "uniwind";

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
