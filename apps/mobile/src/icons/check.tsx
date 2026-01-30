import { Path } from "react-native-svg";
import { StyledSvg } from "@/config/interop-svg";
import type { IconProps } from "@/utils/types";

export default function Check({
  className,
  color = "currentColor",
  size = 20,
}: IconProps) {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      <Path
        d="M4.16675 10.8333L7.50008 14.1666L15.8334 5.83325"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </StyledSvg>
  );
}
