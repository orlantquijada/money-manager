import clsx from "clsx";
import { MotiView } from "moti";
import type { ComponentProps } from "react";
import { ActivityIndicator, View } from "react-native";

import { mauveDark } from "~/utils/colors";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  loadingColor?: string;
} & ComponentProps<typeof MotiView>;

// only a UI comp does not actually do what a button does
// wrap this with a <Pressable /> to have button functionality
export default function Button(props: Props) {
  const {
    children,
    disabled = false,
    loading = false,
    loadingColor = mauveDark.mauve1,
    transition,
    animate,
    ...rest
  } = props;
  return (
    <MotiView
      animate={{
        backgroundColor: disabled
          ? mauveDark.mauve11
          : typeof animate === "object" && "backgroundColor" in animate
            ? animate.backgroundColor
            : mauveDark.mauve12,
        ...animate,
      }}
      className="relative h-8 items-center justify-center rounded-xl px-4 transition-colors"
      transition={{
        backgroundColor: { type: "timing", duration: 200 },
        ...transition,
      }}
      {...rest}
    >
      <View
        className={clsx(
          "h-full items-center justify-center self-stretch",
          loading && "opacity-0"
        )}
      >
        {children}
      </View>
      {loading && (
        <ActivityIndicator
          className="absolute"
          color={loadingColor}
          size="small"
        />
      )}
    </MotiView>
  );
}
