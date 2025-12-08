import { Path, Svg } from "react-native-svg";
import type { IconProps } from "@/utils/types";

export default function Icon({
  className,
  color = "currentColor",
  size = 15,
}: IconProps) {
  return (
    <Svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 15 15"
      width={size}
    >
      <Path d="M9 4L9 11L4.5 7.5L9 4Z" fill={color} />
    </Svg>
  );
}
