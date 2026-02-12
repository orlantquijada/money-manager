import type { ComponentProps } from "react";
import { Path } from "react-native-svg";
import { AnimatedSvg } from "@/components/ui/animated-svg";
import type { IconProps } from "@/utils/types";

export default function Icon({
  className,
  color = "currentColor",
  size = 20,
  ...props
}: IconProps & ComponentProps<typeof AnimatedSvg>) {
  return (
    <AnimatedSvg
      className={className}
      fill={color}
      height={size}
      viewBox="0 0 20 20"
      width={size}
      {...props}
    >
      <Path
        clipRule="evenodd"
        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
        fillRule="evenodd"
      />
    </AnimatedSvg>
  );
}
