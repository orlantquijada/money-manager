import { styled } from "nativewind"
import { Dimensions, View } from "react-native"
import Animated, {
  interpolateColor,
  SharedValue,
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
const cardHeight = {
  lg: 90,
  sm: 60,
}

type ProgressBarProps = {
  /*
   * value should be 0-100
   */
  progress: number
  didScroll: SharedValue<number>
}

export function HeaderProgressBar({
  progress: progressProp,
  didScroll: didScrollProp,
}: ProgressBarProps) {
  const progress = useDerivedValue(
    () => withSpring(progressBarWidth * (progressProp / 100), transitions.soft),
    [progressProp],
  )

  const cardStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, progressInput, [
      mauve.mauve11,
      mauve.mauve12,
    ])

    return {
      backgroundColor,
    }
  })

  const subtextColor = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, progressInput, [
      mauve.mauve6,
      mauve.mauve8,
    ])

    return { color }
  })

  // const amountColor = useAnimatedStyle(() => {
  //   const color = interpolateColor(progress.value, progressInput, [
  //     mauve.mauve8,
  //     mauve.mauve10,
  //   ])
  //
  //   return { color }
  // })

  return (
    <View style={{ height: cardHeight.lg }} className="mt-6">
      <StyledMotiView
        style={cardStyles}
        animate={useDerivedValue(() => ({
          height: didScrollProp.value ? cardHeight.sm : cardHeight.lg,
          borderRadius: didScrollProp.value ? 15 : 20,
        }))}
        transition={transitions.snappier}
        className="bg-mauve12 relative z-10 items-center justify-center overflow-hidden py-2"
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

        <StyledMotiView
          animate={useDerivedValue(() => ({
            scale: didScrollProp.value ? 0.85 : 1,
          }))}
          className="items-center"
          transition={transitions.snappier}
        >
          <StyledAnimatedText
            className="font-satoshi-medium text-mauve8"
            style={subtextColor}
          >
            Total Spent this month
          </StyledAnimatedText>
          <View className="flex-row">
            <StyledAnimatedText
              className="font-nunito-bold text-base"
              // style={amountColor}
              style={subtextColor}
            >
              ₱
            </StyledAnimatedText>
            <StyledAnimatedText
              className="font-nunito-bold text-2xl"
              style={subtextColor}
            >
              2,539.50
            </StyledAnimatedText>
          </View>
        </StyledMotiView>
      </StyledMotiView>
    </View>
  )
}
