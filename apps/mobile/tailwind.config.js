const colors = require("./src/utils/colors");
const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      height: {
        hairline: hairlineWidth(),
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },

      colors: {
        // Raw color scales (keep for specific use cases)
        ...colors.light.violet,
        ...colors.light.mauve,
        ...colors.light.lime,
        ...colors.light.red,
        ...colors.light.pink,
        ...colors.dark.mauveDark,
        ...colors.dark.limeDark,
        ...colors.dark.redDark,

        // Semantic tokens using CSS variables for dark mode support
        background: {
          DEFAULT: "var(--color-background)",
          secondary: "var(--color-background-secondary)",
          tertiary: "var(--color-background-tertiary)",
        },
        foreground: {
          DEFAULT: "var(--color-foreground)",
          secondary: "var(--color-foreground-secondary)",
          muted: "var(--color-foreground-muted)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
          secondary: "var(--color-accent-secondary)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          secondary: "var(--color-border-secondary)",
        },
        "tab-bar": {
          DEFAULT: "var(--color-tab-bar)",
          foreground: "var(--color-tab-bar-foreground)",
        },
      },

      fontFamily: {
        satoshi: ["Satoshi-Regular"],
        "satoshi-italic": ["Satoshi-Italic"],
        "satoshi-medium": ["Satoshi-Medium"],
        "satoshi-medium-italic": ["Satoshi-MediumItalic"],
        "satoshi-semibold": "Satoshi-SemiBold",
        "satoshi-semibold-italic": "Satoshi-SemiBoldItalic",
        "satoshi-bold": ["Satoshi-Bold"],
        "satoshi-bold-italic": ["Satoshi-BoldItalic"],

        "azeret-mono-regular": ["AzeretMono_400Regular"],
        nunito: ["Nunito_400Regular"],
        "nunito-medium": ["Nunito_500Medium"],
        "nunito-semibold": ["Nunito_600SemiBold"],
        "nunito-bold": ["Nunito_700Bold"],
        "nunito-extra-bold": ["Nunito_800ExtraBold"],

        inter: "Inter_400Regular",
        "inter-italic": "Inter_400Regular_Italic",
        "inter-medium": "Inter_500Medium",
        "inter-medium-italic": "Inter_500Medium_Italic",
        "inter-bold": "Inter_700Bold",
        "inter-bold-italic": "Inter_700Bold_Italic",
      },
    },
  },
  plugins: [],
};
