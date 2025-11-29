import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

export function ToggleGroup(props: ViewProps) {
  return (
    <View className="w-full flex-row rounded-md bg-mauve3 p-1" {...props} />
  );
}

export function ToggleButton({
  selected,
  children,
}: PropsWithChildren<{ selected?: boolean }>) {
  return (
    <Pressable
      className={clsx(
        "grow items-center rounded-[4px] px-3 py-1.5",
        selected && "bg-mauve1"
      )}
    >
      <Text
        className={clsx(
          "font-satoshi-medium text-mauve11 text-sm",
          selected && "text-mauve12"
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
