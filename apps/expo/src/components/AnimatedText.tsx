import { ComponentProps } from "react"
import { TextInput, TextInputProps } from "react-native"
import Animated, {
  useAnimatedProps,
  SharedValue,
  AnimatedProps,
} from "react-native-reanimated"

Animated.addWhitelistedNativeProps({ text: true })

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export function AnimatedText({
  text,
  ...props
}: {
  text: SharedValue<string>
} & ComponentProps<typeof AnimatedTextInput>): React.ReactElement {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
    } as unknown as AnimatedProps<TextInputProps>
  })

  return (
    <AnimatedTextInput
      {...props}
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      animatedProps={animatedProps}
    />
  )
}
