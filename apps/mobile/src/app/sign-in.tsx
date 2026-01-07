import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import AppleIcon from "@/icons/apple";
import GoogleIcon from "@/icons/google";

// Handle OAuth redirect
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor("background");
  const foreground = useThemeColor("foreground");
  const foregroundSecondary = useThemeColor("foreground-secondary");

  const { startSSOFlow: startAppleFlow } = useSSO();
  const { startSSOFlow: startGoogleFlow } = useSSO();

  const handleAppleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(app)/(tabs)/(dashboard)");
      }
    } catch (error) {
      console.error("Apple sign-in error:", error);
    }
  }, [startAppleFlow, router]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(app)/(tabs)/(dashboard)");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }, [startGoogleFlow, router]);

  return (
    <View className="flex-1 px-6 pt-safe-offset-20 pb-safe-offset-8" style={{ backgroundColor }}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text className="text-4xl font-bold" style={{ color: foreground }}>
          Welcome to{"\n"}Money Manager
        </Text>
        <Text className="mt-4 text-lg" style={{ color: foregroundSecondary }}>
          Take control of your finances with simple envelope budgeting.
        </Text>
      </Animated.View>

      {/* Sign in buttons */}
      <View className="mt-auto gap-3">
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <ScalePressable
            className="h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-black"
            onPress={handleAppleSignIn}
          >
            <AppleIcon width={20} height={20} color="#fff" />
            <Text className="text-base font-semibold text-white">
              Continue with Apple
            </Text>
          </ScalePressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ScalePressable
            className="h-14 flex-row items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white"
            onPress={handleGoogleSignIn}
          >
            <GoogleIcon width={20} height={20} />
            <Text className="text-base font-semibold text-gray-900">
              Continue with Google
            </Text>
          </ScalePressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text className="mt-4 text-center text-sm" style={{ color: foregroundSecondary }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
