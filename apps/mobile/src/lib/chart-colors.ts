/**
 * Chart color palette for pie charts and data visualizations.
 *
 * Uses a monochromatic scale derived from the app's accent color (violet).
 * Ordered from darkest to lightest - index 0 is most prominent (for top fund),
 * index 5 is lightest (for "Other" grouping).
 *
 * To change the color scheme, replace these hex values with another
 * Radix color scale (e.g., blue, cyan, pink).
 */

// Base accent color (Radix violet-9)
export const CHART_ACCENT = "#6e56cf";

// 6 shades from darkest to lightest
// Slice 0: Top fund (most prominent)
// Slice 5: "Other" grouping (least prominent)
export const CHART_COLORS = [
  "#6e56cf", // violet-9 - darkest, most prominent
  "#aa99ec", // violet-8
  "#c2b5f5", // violet-7
  "#d4cafe", // violet-6
  "#e1d9ff", // violet-5
  "#ebe4ff", // violet-4 - lightest, for "Other"
] as const;

export type ChartColor = (typeof CHART_COLORS)[number];

/**
 * Get a chart color by index, wrapping if needed.
 * Safe for any number of data points.
 */
export function getChartColor(index: number): ChartColor {
  return CHART_COLORS[index % CHART_COLORS.length];
}
