import { useEffect } from "react";
import { Uniwind, useUniwind } from "uniwind";
import { usePreferencesStore } from "@/stores/preferences";
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

/**
 * Hook to access and control the app theme.
 * Syncs with preferences store (MMKV) and Uniwind automatically.
 *
 * @example
 * const { theme, resolvedTheme, isDark, setTheme } = useTheme();
 * // theme: stored preference ("light" | "dark" | "system")
 * // resolvedTheme: actual applied theme ("light" | "dark")
 * // isDark: boolean shortcut for resolvedTheme === "dark"
 * // setTheme: updates both preferences and Uniwind
 */
export function useTheme() {
  const { theme: resolvedTheme, hasAdaptiveThemes } = useUniwind();
  const storedTheme = usePreferencesStore((s) => s.theme);
  const setStoredTheme = usePreferencesStore((s) => s.setTheme);

  // Sync stored preference to Uniwind on mount and when it changes
  useEffect(() => {
    Uniwind.setTheme(storedTheme);
  }, [storedTheme]);

  const setTheme = (t: Theme) => {
    setStoredTheme(t);
    // Uniwind will be updated via the useEffect above
  };

  return {
    /** Stored preference: "light" | "dark" | "system" */
    theme: storedTheme,
    /** Resolved theme after applying system preference: "light" | "dark" */
    resolvedTheme,
    /** Whether the resolved theme is dark */
    isDark: resolvedTheme === "dark",
    /** Whether system theme is being used */
    isSystem: hasAdaptiveThemes,
    /** Update theme preference (persists to storage + applies to Uniwind) */
    setTheme,
  };
}

/**
 * Lightweight hook for components that only need isDark.
 * More efficient than useTheme() when you don't need setTheme.
 */
export function useIsDark() {
  const { theme } = useUniwind();
  return theme === "dark";
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

// Cache for resolved colors: "light:key" or "dark:key" -> resolved color
const colorCache = new Map<string, string>();

function resolveColor(key: ColorKey, isDark: boolean): string {
  const progressColor = getProgressColor(key, isDark);
  if (progressColor) return progressColor;

  const semanticValue = getSemanticColor(key, isDark);
  if (semanticValue) return semanticValue;

  const [scaleName, grade] = key.split("-") as [ColorScaleName, string];
  const scale = colorScales[scaleName];
  if (!scale) return key;

  const targetScale = isDark ? scale.dark : scale.light;
  const colorKey = `${scaleName}${grade}` as keyof typeof targetScale;

  return targetScale[colorKey] ?? key;
}

/**
 * Hook to get a color value that adapts to the current theme.
 *
 * @example
 * const mauve1 = useThemeColor("mauve-1");
 * const bg = useThemeColor("background");
 * const primary = useThemeColor("primary");
 */
export function useThemeColor(key: ColorKey): string {
  const isDark = useIsDark();

  const cacheKey = `${isDark ? "d" : "l"}:${key}`;
  const cached = colorCache.get(cacheKey);
  if (cached) return cached;

  const resolved = resolveColor(key, isDark);
  colorCache.set(cacheKey, resolved);
  return resolved;
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
