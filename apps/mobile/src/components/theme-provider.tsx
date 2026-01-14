import { type ReactNode, useEffect } from "react";
import { Uniwind, useUniwind } from "uniwind";
import {
  amber,
  amberDark,
  lime,
  limeDark,
  mauve,
  mauveDark,
  pink,
  pinkDark,
  red,
  redDark,
  type ThemeTokens,
  theme,
  themeDark,
  violet,
  violetDark,
} from "@/utils/colors";

export type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: Theme;
};

/**
 * ThemeProvider wrapper that sets up Uniwind theming.
 * By default, follows system theme.
 */
export function ThemeProvider({
  children,
  initialTheme = "system",
}: ThemeProviderProps) {
  useEffect(() => {
    // Set initial theme on mount
    Uniwind.setTheme(initialTheme);
  }, [initialTheme]);

  return <>{children}</>;
}

/**
 * Hook to access current theme and whether adaptive themes are enabled.
 * Uses Uniwind's built-in useUniwind hook.
 */
export function useTheme() {
  const { theme, hasAdaptiveThemes } = useUniwind();

  return {
    theme,
    isDark: theme === "dark",
    isSystem: hasAdaptiveThemes,
    setTheme: Uniwind.setTheme,
  };
}

type ColorGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Raw color scales
type AmberColor = `amber-${ColorGrade}`;
type MauveColor = `mauve-${ColorGrade}`;
type VioletColor = `violet-${ColorGrade}`;
type LimeColor = `lime-${ColorGrade}`;
type RedColor = `red-${ColorGrade}`;
type PinkColor = `pink-${ColorGrade}`;

type RawColorKey =
  | AmberColor
  | MauveColor
  | VioletColor
  | LimeColor
  | RedColor
  | PinkColor;

// Progress bar semantic tokens (CSS-based, with light/dark values)
type ProgressColorKey =
  | "progress-spending"
  | "progress-non-negotiable"
  | "quick-stat-non-negotiable";

// Semantic tokens - derived from theme object structure
// For each key in theme: if value is object with DEFAULT, produce "key" + "key-variant" for each non-DEFAULT key
type SemanticColorKey = {
  [K in keyof ThemeTokens]: ThemeTokens[K] extends { DEFAULT: string }
    ? K | `${K}-${Exclude<keyof ThemeTokens[K], "DEFAULT"> & string}`
    : never;
}[keyof ThemeTokens];

export type ColorKey = RawColorKey | ProgressColorKey | SemanticColorKey;

// Color scale mapping
const colorScales = {
  amber: { light: amber, dark: amberDark },
  mauve: { light: mauve, dark: mauveDark },
  violet: { light: violet, dark: violetDark },
  lime: { light: lime, dark: limeDark },
  red: { light: red, dark: redDark },
  pink: { light: pink, dark: pinkDark },
} as const;

type ColorScaleName = keyof typeof colorScales;

/**
 * Hook to get a color value that adapts to the current theme.
 *
 * @example
 * const mauve1 = useThemeColor("mauve-1");
 * const bg = useThemeColor("background");
 * const primary = useThemeColor("primary");
 */
export function useThemeColor(key: ColorKey): string {
  const { isDark } = useTheme();

  // Handle progress color tokens (CSS-based with light/dark values)
  const progressColor = getProgressColor(key, isDark);
  if (progressColor) return progressColor;

  // Handle semantic tokens (e.g., "background", "primary-foreground")
  const semanticValue = getSemanticColor(key, isDark);
  if (semanticValue) return semanticValue;

  // Handle raw color scales (e.g., "mauve-8", "violet-9")
  const [scaleName, grade] = key.split("-") as [ColorScaleName, string];
  const scale = colorScales[scaleName];
  if (!scale) return key;

  const targetScale = isDark ? scale.dark : scale.light;
  const colorKey = `${scaleName}${grade}` as keyof typeof targetScale;

  return targetScale[colorKey] ?? key;
}

// Progress color tokens with hardcoded light/dark values
// These match the CSS variables in global.css
const progressColors = {
  "progress-spending": {
    light: violet.violet6,
    dark: "rgba(110, 86, 207, 0.8)", // violet-9 at 80%
  },
  "progress-non-negotiable": {
    light: lime.lime4,
    dark: "rgba(189, 238, 99, 0.8)", // lime-9 at 80%
  },
  "quick-stat-non-negotiable": {
    light: "rgba(92, 124, 47, 0.5)", // lime-11 at 50%
    dark: limeDark.lime9,
  },
} as const;

function getProgressColor(key: string, isDark: boolean): string | null {
  if (key in progressColors) {
    const colors = progressColors[key as keyof typeof progressColors];
    return isDark ? colors.dark : colors.light;
  }
  return null;
}

function getSemanticColor(key: string, isDark: boolean): string | null {
  const tokens = isDark ? themeDark : theme;

  // Direct match (e.g., "background", "primary")
  if (key in tokens) {
    const value = tokens[key as keyof typeof tokens];
    if (typeof value === "string") return value;
    if (typeof value === "object" && "DEFAULT" in value) return value.DEFAULT;
  }

  // Nested match (e.g., "background-secondary" -> background.secondary)
  const [group, variant] = key.split("-") as [keyof typeof tokens, string];
  if (group in tokens) {
    const groupValue = tokens[group];
    if (typeof groupValue === "object" && variant in groupValue) {
      return groupValue[variant as keyof typeof groupValue];
    }
  }

  return null;
}
