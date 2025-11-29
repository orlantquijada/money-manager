import { useFonts as useExpoFonts } from "expo-font";
// import {
//   Nunito_200ExtraLight,
//   Nunito_300Light,
//   Nunito_400Regular,
//   Nunito_500Medium,
//   Nunito_600SemiBold,
//   Nunito_700Bold,
//   Nunito_800ExtraBold,
//   Nunito_900Black,
// } from "@expo-google-fonts/nunito"

export function useFonts() {
  const [loaded] = useExpoFonts({
    "Satoshi-Regular": require("../../../assets/fonts/Satoshi/Satoshi-Regular.ttf"),
    "Satoshi-Italic": require("../../../assets/fonts/Satoshi/Satoshi-Italic.ttf"),
    "Satoshi-Medium": require("../../../assets/fonts/Satoshi/Satoshi-Medium.ttf"),
    "Satoshi-MediumItalic": require("../../../assets/fonts/Satoshi/Satoshi-MediumItalic.ttf"),
    "Satoshi-Bold": require("../../../assets/fonts/Satoshi/Satoshi-Bold.ttf"),
    "Satoshi-BoldItalic": require("../../../assets/fonts/Satoshi/Satoshi-BoldItalic.ttf"),
    "AzeretMono-Regular": require("../../../assets/fonts/AzeretMono/AzeretMono-Regular.ttf"),
    Nunito_400Regular: require("../../../assets/fonts/Nunito/Nunito-Regular.ttf"),
    Nunito_500Medium: require("../../../assets/fonts/Nunito/Nunito-Medium.ttf"),
    Nunito_600SemiBold: require("../../../assets/fonts/Nunito/Nunito-SemiBold.ttf"),
    Nunito_700Bold: require("../../../assets/fonts/Nunito/Nunito-Bold.ttf"),
    Nunito_800ExtraBold: require("../../../assets/fonts/Nunito/Nunito-ExtraBold.ttf"),
  });

  return loaded;
}
