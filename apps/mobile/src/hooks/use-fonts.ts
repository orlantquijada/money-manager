import { AzeretMono_400Regular } from "@expo-google-fonts/azeret-mono";
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
} from "@expo-google-fonts/inter";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_700Bold_Italic,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";

function useAppFonts() {
  const [loaded] = useFonts({
    // "Satoshi-Regular": require("../assets/fonts/Satoshi-Regular.otf"),
    // "Satoshi-Italic": require("../assets/fonts/Satoshi-Italic.otf"),
    // "Satoshi-Medium": require("../assets/fonts/Satoshi-Medium.otf"),
    // "Satoshi-MediumItalic": require("../assets/fonts/Satoshi-MediumItalic.otf"),
    // "Satoshi-Bold": require("../assets/fonts/Satoshi-Bold.otf"),
    // "Satoshi-BoldItalic": require("../assets/fonts/Satoshi-BoldItalic.otf"),

    // "Satoshi-Regular": Inter_400Regular,
    // "Satoshi-Italic": Inter_400Regular_Italic,
    // "Satoshi-Medium": Inter_500Medium,
    // "Satoshi-MediumItalic": Inter_500Medium_Italic,
    // "Satoshi-Bold": Inter_700Bold,
    // "Satoshi-BoldItalic": Inter_700Bold_Italic,

    "Satoshi-Regular": PlusJakartaSans_400Regular,
    "Satoshi-Italic": PlusJakartaSans_400Regular_Italic,
    "Satoshi-Medium": PlusJakartaSans_500Medium,
    "Satoshi-MediumItalic": PlusJakartaSans_500Medium_Italic,
    "Satoshi-SemiBold": PlusJakartaSans_600SemiBold,
    "Satoshi-SemiBoldItalic": PlusJakartaSans_600SemiBold_Italic,
    "Satoshi-Bold": PlusJakartaSans_700Bold,
    "Satoshi-BoldItalic": PlusJakartaSans_700Bold_Italic,

    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_500Medium_Italic,
    Inter_700Bold,
    Inter_700Bold_Italic,

    PlusJakartaSans_400Regular,
    PlusJakartaSans_400Regular_Italic,
    PlusJakartaSans_500Medium_Italic,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_700Bold_Italic,

    AzeretMono_400Regular,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  return loaded;
}

export { useAppFonts as useFonts };
