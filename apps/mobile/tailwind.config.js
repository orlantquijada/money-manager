const colors = require("./src/utils/colors");
const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  theme: {
    extend: {
      height: {
        hairline: hairlineWidth(),
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },

      colors: {
        ...colors.light.violet,
        ...colors.light.mauve,
        ...colors.light.lime,
        ...colors.light.red,
        ...colors.dark.mauveDark,
        ...colors.dark.limeDark,
        ...colors.dark.redDark,
      },

      fontFamily: {
        satoshi: ["Satoshi-Regular"],
        "satoshi-italic": ["Satoshi-Italic"],
        "satoshi-medium": ["Satoshi-Medium"],
        "satoshi-medium-italic": ["Satoshi-MediumItalic"],
        "satoshi-bold": ["Satoshi-Bold"],
        "satoshi-bold-italic": ["Satoshi-BoldItalic"],
        "azeret-mono-regular": ["AzeretMono_400Regular"],
        nunito: ["Nunito_400Regular"],
        "nunito-medium": ["Nunito_500Medium"],
        "nunito-semibold": ["Nunito_600SemiBold"],
        "nunito-bold": ["Nunito_700Bold"],
        "nunito-extra-bold": ["Nunito_800ExtraBold"],
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
