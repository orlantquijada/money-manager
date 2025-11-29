import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import Button from "./Button";
import ScaleDownPressable from "./ScaleDownPressable";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
};

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
  children,
}: PropsWithChildren<Props>) {
  return (
    <View className="flex flex-row justify-between border-t border-t-mauveDark8 bg-mauveDark1 p-4">
      <ScaleDownPressable
        className={clsx("h-8 justify-center", hideBackButton && "opacity-0")}
        disabled={hideBackButton}
        onPress={onBackPress}
      >
        <Text className="font-satoshi-medium text-mauveDark12 text-sm">
          Back
        </Text>
      </ScaleDownPressable>
      <ScaleDownPressable
        disabled={disabled || loading}
        onPress={onContinuePress}
      >
        <Button className="min-w-[80]" disabled={disabled} loading={loading}>
          <Text
            className="font-satoshi-medium text-mauveDark1 text-sm"
            style={{ lineHeight: 16 }}
          >
            {children}
          </Text>
        </Button>
      </ScaleDownPressable>
    </View>
  );
}
