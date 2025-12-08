import { Circle, Path, Svg } from "react-native-svg";
import type { IconProps } from "@/utils/types";

export default function Icon({
  className,
  color = "currentColor",
  size = 20,
}: IconProps) {
  return (
    <Svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      <Circle cx="10" cy="10" fill={color} opacity={0.12} r="8.333" />
      <Path
        d="M13.7035 2.53285C12.5878 1.97839 11.3302 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 9.68699 18.3159 9.37805 18.2823 9.07403M7.49984 9.16663L9.99984 11.6666L18.3332 3.33329"
        // stroke="#161618"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Svg>
  );
}
