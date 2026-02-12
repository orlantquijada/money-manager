/**
 * Chart color palette for pie charts and data visualizations.
 *
 * Uses a monochromatic scale derived from the app's accent color (violet).
 * Ordered from darkest to lightest - index 0 is most prominent (for top fund),
 * index 5 is lightest (for "Other" grouping).
 *
 * References Tailwind/CSS variable color keys that resolve via useThemeColor.
 */

import { useThemeColor } from "@/components/theme-provider";

// 6 shades from darkest to lightest using color keys
// Slice 0: Top fund (most prominent)
// Slice 5: "Other" grouping (least prominent)
export function useChartColors(): [
  string,
  string,
  string,
  string,
  string,
  string,
] {
  const c0 = useThemeColor("violet-9");
  const c1 = useThemeColor("violet-8");
  const c2 = useThemeColor("violet-7");
  const c3 = useThemeColor("violet-6");
  const c4 = useThemeColor("violet-5");
  const c5 = useThemeColor("violet-4");

  return [c0, c1, c2, c3, c4, c5];
}

export function useChartColor(index: number): string {
  const colors = useChartColors();
  return colors[index % colors.length];
}
