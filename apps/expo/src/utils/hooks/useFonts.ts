import { useFonts as useExpoFonts } from "expo-font"

export function useFonts() {
  const [loaded] = useExpoFonts({
    "Satoshi-Regular": require("../../assets/fonts/Satoshi/Satoshi-Regular.ttf"),
    "Satoshi-Italic": require("../../assets/fonts/Satoshi/Satoshi-Italic.ttf"),
    "Satoshi-Medium": require("../../assets/fonts/Satoshi/Satoshi-Medium.ttf"),
    "Satoshi-MediumItalic": require("../../assets/fonts/Satoshi/Satoshi-MediumItalic.ttf"),
    "Satoshi-Bold": require("../../assets/fonts/Satoshi/Satoshi-Bold.ttf"),
    "Satoshi-BoldItalic": require("../../assets/fonts/Satoshi/Satoshi-BoldItalic.ttf"),
  })

  return loaded
}
