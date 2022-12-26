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
          },
        },
      ],
    ],
    presets: ["babel-preset-expo"],
  }
}
