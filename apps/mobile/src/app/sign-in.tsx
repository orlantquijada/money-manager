import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { Platform } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import AppleIcon from "@/icons/apple";
import GoogleIcon from "@/icons/google";

// Handle OAuth redirect
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();

  const { startSSOFlow: startAppleFlow } = useSSO();
  const { startSSOFlow: startGoogleFlow } = useSSO();

  const handleAppleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleFlow({
        strategy: "oauth_apple",
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(app)/(tabs)/(main)/(dashboard)");
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
        router.replace("/(app)/(tabs)/(main)/(dashboard)");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }, [startGoogleFlow, router]);

  return (
    <StyledLeanView className="flex-1 bg-background px-6 pt-safe-offset-20 pb-safe-offset-8">
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <StyledLeanText className="font-bold text-4xl text-foreground">
          Welcome to{"\n"}Money Manager
        </StyledLeanText>
        <StyledLeanText className="mt-4 text-foreground-secondary text-lg">
          Take control of your finances with simple envelope budgeting.
        </StyledLeanText>
      </Animated.View>

      {/* Sign in buttons */}
      <StyledLeanView className="mt-auto gap-3">
        {Platform.OS === "ios" && (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <ScalePressable
              className="h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-black"
              onPress={handleAppleSignIn}
            >
              <AppleIcon color="#fff" height={20} width={20} />
              <StyledLeanText className="font-semibold text-base text-white">
                Continue with Apple
              </StyledLeanText>
            </ScalePressable>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ScalePressable
            className="h-14 flex-row items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white"
            onPress={handleGoogleSignIn}
          >
            <GoogleIcon height={20} width={20} />
            <StyledLeanText className="font-semibold text-base text-gray-900">
              Continue with Google
            </StyledLeanText>
          </ScalePressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <StyledLeanText className="mt-4 text-center text-foreground-secondary text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </StyledLeanText>
        </Animated.View>
      </StyledLeanView>
    </StyledLeanView>
  );
}
