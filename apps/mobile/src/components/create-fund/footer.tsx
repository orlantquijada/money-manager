import type { PropsWithChildren } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { cn } from "@/utils/cn";
import { mauveDark } from "@/utils/colors";
import Button from "../button";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
};

export const FOOTER_HEIGHT = 64;

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
  children,
}: PropsWithChildren<Props>) {
  return (
    <View
      className="flex flex-row items-center justify-between border-t border-t-mauveDark8 bg-mauveDark1 px-4"
      style={{
        height: FOOTER_HEIGHT,
      }}
    >
      <Pressable
        className={cn(
          "h-8 justify-center transition-all active:scale-95 active:opacity-50",
          hideBackButton && "opacity-0"
        )}
        disabled={hideBackButton}
        hitSlop={{ left: 20, right: 20, top: 5, bottom: 5 }}
        onPress={onBackPress}
      >
        <Text className="font-satoshi-medium text-mauveDark12 text-sm">
          Back
        </Text>
      </Pressable>

      <Button
        className="min-w-20 active:scale-95"
        disabled={disabled || loading}
        hitSlop={12}
        onPress={onContinuePress}
      >
        {loading && (
          <ActivityIndicator
            className="absolute"
            color={mauveDark.mauveDark1}
            size="small"
          />
        )}

        <Text
          className={cn(
            "font-satoshi-medium text-mauveDark1 text-sm",
            loading && "opacity-0"
          )}
        >
          {children}
        </Text>
      </Button>
    </View>
  );
}
