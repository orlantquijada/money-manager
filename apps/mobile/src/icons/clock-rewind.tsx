import { Path } from "react-native-svg";
import { StyledSvg } from "@/config/interop";
import type { IconProps } from "@/utils/types";

export default function ClockRewind({
  className,
  color = "currentColor",
  size = 24,
}: IconProps) {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {/* Clock circle */}
      <Path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      {/* Clock hands */}
      <Path
        d="M12 7V12L15 14"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      {/* Rewind arrow curve */}
      <Path
        d="M7.5 3C5.5 4.5 4 6.5 3.5 9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      {/* Rewind arrow head */}
      <Path
        d="M3 4V8H7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      {/* Bottom curve of clock */}
      <Path
        d="M3.5 15C4.5 18.5 7.5 21 12 21"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </StyledSvg>
  );
}
