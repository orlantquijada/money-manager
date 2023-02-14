import { styled } from "nativewind"
import { Dimensions } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"

import { mauve } from "~/utils/colors"
import { screenPadding } from "~/utils/constants"
import { transitions } from "~/utils/motion"

import StyledMotiView from "../StyledMotiView"

import Stripes from "../../../assets/icons/stripes.svg"

const StyledAnimatedText = styled(Animated.Text)

const { width } = Dimensions.get("screen")
const progressBarWidth = width - screenPadding * 2
const progressInput = [0, progressBarWidth]

type ProgressBarProps = {
  /*
   * value should be 0-100
   */
  progress: number
}
export function HeaderProgressBar({
  progress: progressProp,
}: ProgressBarProps) {
  const progress = useDerivedValue(
    () => withSpring(progressBarWidth * (progressProp / 100), transitions.soft),
    [progressProp],
  )

  const cardBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, progressInput, [
      mauve.mauve11,
      mauve.mauve12,
    ])

    return { backgroundColor }
  })

  const subtextColor = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, progressInput, [
      mauve.mauve6,
      mauve.mauve8,
    ])

    return { color }
  })

  const amountColor = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, progressInput, [
      mauve.mauve8,
      mauve.mauve10,
    ])

    return { color }
  })

  return (
    <StyledMotiView
      style={cardBackground}
      className="bg-mauve12 relative mt-6 items-center justify-center overflow-hidden rounded-2xl p-6"
    >
      <StyledMotiView
        from={{ translateX: 0 }}
        animate={{
          translateX: progressBarWidth * (progressProp / 100),
        }}
        transition={transitions.soft}
        className="border-mauve11/20 absolute inset-0 z-0 translate-x-1/2 overflow-hidden border-l-2"
      >
        <Stripes />
      </StyledMotiView>

      <StyledAnimatedText
        className="font-satoshi text-mauve8"
        style={subtextColor}
      >
        Total Spent this month
      </StyledAnimatedText>
      <StyledAnimatedText
        className="font-satoshi-medium text-mauve1 text-2xl"
        style={amountColor}
      >
        <StyledAnimatedText
          className="font-satoshi text-mauve8"
          style={subtextColor}
        >
          ₱
        </StyledAnimatedText>
        2,539.50
      </StyledAnimatedText>
    </StyledMotiView>
  )
}
