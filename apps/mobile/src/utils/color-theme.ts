import { vars } from "nativewind";
import { type ThemeTokens, theme, themeDark } from "./colors";

function createThemeVars(t: ThemeTokens) {
  return vars({
    "--color-background": t.background.DEFAULT,
    "--color-background-secondary": t.background.secondary,
    "--color-background-tertiary": t.background.tertiary,

    "--color-foreground": t.foreground.DEFAULT,
    "--color-foreground-secondary": t.foreground.secondary,
    "--color-foreground-muted": t.foreground.muted,

    "--color-card": t.card.DEFAULT,
    "--color-card-foreground": t.card.foreground,

    "--color-primary": t.primary.DEFAULT,
    "--color-primary-foreground": t.primary.foreground,

    "--color-muted": t.muted.DEFAULT,
    "--color-muted-foreground": t.muted.foreground,

    "--color-accent": t.accent.DEFAULT,
    "--color-accent-foreground": t.accent.foreground,
    "--color-accent-secondary": t.accent.secondary,

    "--color-destructive": t.destructive.DEFAULT,
    "--color-destructive-foreground": t.destructive.foreground,

    "--color-border": t.border.DEFAULT,
    "--color-border-secondary": t.border.secondary,

    "--color-tab-bar": t.tabBar.DEFAULT,
    "--color-tab-bar-foreground": t.tabBar.foreground,
  });
}

export const themes = {
  light: createThemeVars(theme),
  dark: createThemeVars(themeDark),
} as const;

export type Theme = keyof typeof themes;
