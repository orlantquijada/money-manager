import type { ComponentProps } from "react";
import { TextInput, type TextInputProps } from "react-native";
import Animated, {
  type AnimatedProps,
  type SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText({
  text,
  ...props
}: {
  text: SharedValue<string>;
} & ComponentProps<typeof AnimatedTextInput>): React.ReactElement {
  const animatedProps = useAnimatedProps(
    () =>
      ({
        text: text.value,
      }) as unknown as AnimatedProps<TextInputProps>
  );

  return (
    <AnimatedTextInput
      {...props}
      animatedProps={animatedProps}
      editable={false}
      underlineColorAndroid="transparent"
      value={text.value}
    />
  );
}
