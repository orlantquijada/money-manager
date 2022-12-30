module.exports = function (api) {
  api.cache(true)
  return {
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            "~": "./src",
            "@assets": "./assets",
          },
        },
      ],
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./src/tamagui.config.ts",
          // logTimings: true,
          // disableExtraction: process.env.NODE_ENV === "development",
        },
      ],
      [
        "transform-inline-environment-variables",
        {
          include: "TAMAGUI_TARGET",
        },
      ],
      "react-native-reanimated/plugin",
    ],
    presets: ["babel-preset-expo"],
  }
}
