import { Path } from "react-native-svg";
import { StyledSvg } from "@/config/interop";
import type { IconProps } from "@/utils/types";

export default function Icon({
  className,
  color = "currentColor",
  size = 24,
  strokeWidth = 1.5,
}: IconProps & { strokeWidth?: number }) {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={size}
      stroke={color}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      <Path
        d="M15.75 19.5 8.25 12l7.5-7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSvg>
  );
}
