const colors = require("./src/utils/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        ...colors.light.violet,
        ...colors.light.mauve,
        ...colors.light.lime,
        ...colors.light.red,
        ...colors.dark.mauve,
        ...colors.dark.lime,
        ...colors.dark.red,
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
