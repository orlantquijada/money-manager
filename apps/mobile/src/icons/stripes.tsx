import { useMemo } from "react";
import { ClipPath, Defs, G, Pattern, Rect, Svg } from "react-native-svg";
import type { IconProps } from "@/utils/types";

interface StripesProps extends Omit<IconProps, "size"> {
  height?: number;
  width?: number;
  /** Width of each stripe in pixels. Default: 5 */
  stripeWidth?: number;
  /** Primary stripe color. Default: "#AA99EC" */
  primaryColor?: string;
  /** Secondary stripe color. Default: "#D7CFF9" */
  secondaryColor?: string;
}

export default function Icon({
  className,
  height = 16,
  width = 600,
  stripeWidth = 5,
  primaryColor = "#AA99EC",
  secondaryColor = "#D7CFF9",
}: StripesProps) {
  // The pattern repeats every 2 stripes (primary + secondary)
  const patternSize = stripeWidth * 2;

  // Calculate how many pattern repetitions we need to cover the width
  // We add extra for the diagonal rotation
  const patternRepetitions = useMemo(() => {
    return Math.ceil((width + height) / patternSize) + 2;
  }, [width, height, patternSize]);

  // Generate the stripe rectangles for the pattern
  const stripes = useMemo(() => {
    const elements: React.ReactElement[] = [];
    const totalWidth = patternRepetitions * patternSize;

    for (let i = 0; i < patternRepetitions; i++) {
      const x = i * patternSize;

      // Primary stripe
      elements.push(
        <Rect
          fill={primaryColor}
          height={totalWidth}
          key={`primary-${i}`}
          width={stripeWidth}
          x={x}
          y={0}
        />
      );

      // Secondary stripe
      elements.push(
        <Rect
          fill={secondaryColor}
          height={totalWidth}
          key={`secondary-${i}`}
          width={stripeWidth}
          x={x + stripeWidth}
          y={0}
        />
      );
    }

    return elements;
  }, [
    patternRepetitions,
    patternSize,
    stripeWidth,
    primaryColor,
    secondaryColor,
  ]);

  const totalPatternSize = patternRepetitions * patternSize;

  return (
    <Svg
      className={className}
      fill="none"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <Defs>
        <Pattern
          height={height}
          id="stripePattern"
          patternTransform="rotate(-45)"
          patternUnits="userSpaceOnUse"
          width={totalPatternSize}
        >
          {stripes}
        </Pattern>
        <ClipPath id="clipRect">
          <Rect fill="#fff" height={height} width={width} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clipRect)">
        <Rect fill="#fff" height={height} width={width} />
        <Rect
          fill="url(#stripePattern)"
          height={height * 3}
          width={width * 2}
          x={-width / 2}
          y={-height}
        />
      </G>
    </Svg>
  );
}
