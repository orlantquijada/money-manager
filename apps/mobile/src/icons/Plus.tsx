import { Path, Svg } from "react-native-svg";
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
      <Path
        clipRule="evenodd"
        d="M10.6667 3.66667C10.6667 3.29848 10.3682 3 10 3C9.63181 3 9.33333 3.29848 9.33333 3.66667V9.33333H3.66667C3.29848 9.33333 3 9.63181 3 10C3 10.3682 3.29848 10.6667 3.66667 10.6667H9.33333V16.3333C9.33333 16.7015 9.63181 17 10 17C10.3682 17 10.6667 16.7015 10.6667 16.3333V10.6667H16.3333C16.7015 10.6667 17 10.3682 17 10C17 9.63181 16.7015 9.33333 16.3333 9.33333H10.6667V3.66667Z"
        // fill="#1A1523"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
}
