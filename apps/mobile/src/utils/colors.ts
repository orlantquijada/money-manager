// Re-export Radix colors directly - these are all hex values
export {
  amberDark,
  lime,
  limeDark,
  mauve,
  mauveA,
  mauveDark,
  mauveDarkA,
  pink,
  pinkDark,
  red,
  redDark,
  violet,
  violetDark,
} from "@radix-ui/colors";

import {
  mauve,
  mauveDark,
  red,
  redDark,
  violet,
  violetDark,
} from "@radix-ui/colors";

export const theme = {
  background: {
    DEFAULT: mauve.mauve1,
    secondary: mauve.mauve2,
    tertiary: mauve.mauve3,
  },
  foreground: {
    DEFAULT: mauve.mauve12,
    secondary: mauve.mauve11,
    muted: mauve.mauve9,
  },
  card: {
    DEFAULT: mauve.mauve2,
    foreground: mauve.mauve12,
  },
  primary: {
    DEFAULT: violet.violet9,
    foreground: violet.violet1,
  },
  muted: {
    DEFAULT: mauve.mauve3,
    foreground: mauve.mauve11,
  },
  accent: {
    DEFAULT: violet.violet8,
    foreground: mauve.mauve12,
    secondary: mauve.mauve4,
  },
  destructive: {
    DEFAULT: red.red9,
    foreground: red.red1,
  },
  border: {
    DEFAULT: mauve.mauve6,
    secondary: mauve.mauve5,
  },
  tabBar: {
    DEFAULT: mauve.mauve1,
    foreground: mauve.mauve12,
  },
} as const;

export type ThemeTokens = typeof theme;

export const themeDark = {
  background: {
    DEFAULT: mauveDark.mauve1,
    secondary: mauveDark.mauve2,
    tertiary: mauveDark.mauve3,
  },
  foreground: {
    DEFAULT: mauveDark.mauve12,
    secondary: mauveDark.mauve11,
    muted: mauveDark.mauve9,
  },
  card: {
    DEFAULT: mauveDark.mauve2,
    foreground: mauveDark.mauve12,
  },
  primary: {
    DEFAULT: violetDark.violet9,
    foreground: violetDark.violet12,
  },
  muted: {
    DEFAULT: mauveDark.mauve3,
    foreground: mauveDark.mauve11,
  },
  accent: {
    DEFAULT: violetDark.violet8,
    foreground: mauveDark.mauve12,
    secondary: mauveDark.mauve4,
  },
  destructive: {
    DEFAULT: redDark.red9,
    foreground: redDark.red12,
  },
  border: {
    DEFAULT: mauveDark.mauve6,
    secondary: mauveDark.mauve5,
  },
  tabBar: {
    DEFAULT: mauveDark.mauve1,
    foreground: mauveDark.mauve12,
  },
} satisfies ThemeTokens;

/**
 * Converts a hex color to a transparent version with the given opacity.
 * @param hex - Hex color string (e.g., "#ff0000" or "#f00")
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA string in format "rgba(R, G, B, opacity)"
 */
export function hexToTransparent(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Handle shorthand hex (e.g., #fff -> #ffffff)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
