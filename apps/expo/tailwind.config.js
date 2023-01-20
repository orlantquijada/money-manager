const light = {
  violet: {
    violet1: "hsl(255, 65.0%, 99.4%)",
    violet2: "hsl(252, 100%, 99.0%)",
    violet3: "hsl(252, 96.9%, 97.4%)",
    violet4: "hsl(252, 91.5%, 95.5%)",
    violet5: "hsl(252, 85.1%, 93.0%)",
    violet6: "hsl(252, 77.8%, 89.4%)",
    violet7: "hsl(252, 71.0%, 83.7%)",
    violet8: "hsl(252, 68.6%, 76.3%)",
    violet9: "hsl(252, 56.0%, 57.5%)",
    violet10: "hsl(251, 48.1%, 53.5%)",
    violet11: "hsl(250, 43.0%, 48.0%)",
    violet12: "hsl(254, 60.0%, 18.5%)",
  },
  mauve: {
    mauve1: "hsl(300, 20.0%, 99.0%)",
    mauve2: "hsl(300, 7.7%, 97.5%)",
    mauve3: "hsl(294, 5.5%, 95.3%)",
    mauve4: "hsl(289, 4.7%, 93.3%)",
    mauve5: "hsl(283, 4.4%, 91.3%)",
    mauve6: "hsl(278, 4.1%, 89.1%)",
    mauve7: "hsl(271, 3.9%, 86.3%)",
    mauve8: "hsl(255, 3.7%, 78.8%)",
    mauve9: "hsl(252, 4.0%, 57.3%)",
    mauve10: "hsl(253, 3.5%, 53.5%)",
    mauve11: "hsl(252, 4.0%, 44.8%)",
    mauve12: "hsl(260, 25.0%, 11.0%)",
  },
}

const dark = {
  mauve: {
    mauveDark1: "hsl(246, 6.0%, 9.0%)",
    mauveDark2: "hsl(240, 5.1%, 11.6%)",
    mauveDark3: "hsl(241, 5.0%, 14.3%)",
    mauveDark4: "hsl(242, 4.9%, 16.5%)",
    mauveDark5: "hsl(243, 4.9%, 18.8%)",
    mauveDark6: "hsl(244, 4.9%, 21.5%)",
    mauveDark7: "hsl(245, 4.9%, 25.4%)",
    mauveDark8: "hsl(247, 4.8%, 32.5%)",
    mauveDark9: "hsl(252, 4.0%, 45.2%)",
    mauveDark10: "hsl(247, 3.4%, 50.7%)",
    mauveDark11: "hsl(253, 4.0%, 63.7%)",
    mauveDark12: "hsl(256, 6.0%, 93.2%)",
  },
}

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("tailwind-config")],
  corePlugins: {
    backgroundOpacity: false,
  },

  theme: {
    extend: {
      colors: {
        ...light.violet,
        ...light.mauve,
        ...dark.mauve,
      },
    },
    fontFamily: {
      satoshi: ["Satoshi-Regular"],
      "satoshi-italic": ["Satoshi-Italic"],
      "satoshi-medium": ["Satoshi-Medium"],
      "satoshi-medium-italic": ["Satoshi-MediumItalic"],
      "satoshi-bold": ["Satoshi-Bold"],
      "satoshi-bold-italic": ["Satoshi-BoldItalic"],
    },
  },
}
