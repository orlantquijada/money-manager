// import { styled } from "nativewind";
import { Dimensions, View } from "react-native";
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { mauve } from "~/utils/colors";
import { screenPadding } from "~/utils/constants";
import { transitions } from "~/utils/motion";
import Stripes from "../../../assets/icons/stripes.svg";
import StyledMotiView from "../StyledMotiView";

// const StyledAnimatedText = styled(Animated.Text);
const StyledAnimatedText = Animated.Text;

const { width } = Dimensions.get("screen");
const progressBarWidth = width - screenPadding * 2;
const progressInput = [0, progressBarWidth];
const cardHeight = {
  lg: 90,
  sm: 60,
};

type ProgressBarProps = {
  /*
   * value should be 0-100
   */
  progress: number;
  didScroll: SharedValue<number>;
};

export function HeaderProgressBar({
  progress: progressProp,
  didScroll: didScrollProp,
}: ProgressBarProps) {
  const progress = useDerivedValue(
    () => withSpring(progressBarWidth * (progressProp / 100), transitions.soft),
    [progressProp]
  );

  const cardStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, progressInput, [
      mauve.mauve11,
      mauve.mauve12,
    ]);

    return {
      backgroundColor,
    };
  });

  const subtextColor = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, progressInput, [
      mauve.mauve6,
      mauve.mauve8,
    ]);

    return { color };
  });

  // const amountColor = useAnimatedStyle(() => {
  //   const color = interpolateColor(progress.value, progressInput, [
  //     mauve.mauve8,
  //     mauve.mauve10,
  //   ])
  //
  //   return { color }
  // })

  return (
    <View className="mt-6" style={{ height: cardHeight.lg }}>
      <StyledMotiView
        animate={useDerivedValue(() => ({
          height: didScrollProp.value ? cardHeight.sm : cardHeight.lg,
          borderRadius: didScrollProp.value ? 15 : 20,
        }))}
        className="relative z-10 items-center justify-center overflow-hidden bg-mauve12 py-2"
        style={cardStyles}
        transition={transitions.snappier}
      >
        <StyledMotiView
          animate={{
            translateX: progressBarWidth * (progressProp / 100),
          }}
          className="absolute inset-0 z-0 translate-x-1/2 overflow-hidden border-mauve11/20 border-l-2"
          from={{ translateX: 0 }}
          transition={transitions.soft}
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
  );
}
