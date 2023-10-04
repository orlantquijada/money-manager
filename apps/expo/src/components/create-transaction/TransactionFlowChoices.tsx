import { TextStyle, View, ViewProps } from "react-native"
import ScaleDownPressable from "../ScaleDownPressable"
import Animated, {
  AnimatedStyleProp,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import {
  TransactionFlow,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"
import { useMeasureWidth } from "~/utils/hooks/useAnimateHeight"
import { transitions } from "~/utils/motion"
import { getInnerBorderRadius } from "~/utils/functions"
import { mauveDark } from "~/utils/colors"
import { AnimatePresence, MotiView } from "moti"

const outerRadius = 14
const outerPadding = 4

export default function TransactionFlowChoices() {
  const defaultTxnFlow = useTransactionStore((s) => s.txnFlow)
  const fund = useTransactionStore((s) => s.fund)
  const txnFlow = useSharedValue<TransactionFlow>(defaultTxnFlow || "income")

  const handleOnChange = (flow: TransactionFlow) => () => {
    console.log("asdasd")
    txnFlow.value = flow
    useTransactionStore.setState({ txnFlow: flow })
  }

  const { measuredWidth, handleOnLayout } = useMeasureWidth()

  const activeIndicatorStyle = useAnimatedStyle(() => ({
    left: withSpring(
      // padding left = 4, separator width = 2
      txnFlow.value === "income" ? 4 : measuredWidth.value / 2 + 2,
      transitions.snappy,
    ),
    // padding = 4 + separator width = 2
    width: measuredWidth.value / 2 - 6,
  }))

  const incomeTextStyle = useActiveTextStyle(txnFlow, "income")
  const expenseTextStyle = useActiveTextStyle(txnFlow, "expense")

  return (
    <AnimatePresence>
      {fund?.fundType === "TARGET" && (
        <MotiView
          className="bg-mauveDark3 relative flex-row items-center justify-center"
          style={{ padding: outerPadding, borderRadius: outerRadius }}
          onLayout={handleOnLayout}
          from={{ opacity: 0, translateY: 20 }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            translateY: -20,
          }}
          transition={{ ...transitions.snappy, delay: 150 }}
          exitTransition={{ ...transitions.snappy, delay: 150 }}
        >
          <Animated.View
            className="bg-mauveDark6 absolute h-8 px-2"
            pointerEvents="none"
            style={[
              { borderRadius: getInnerBorderRadius(outerRadius, outerPadding) },
              activeIndicatorStyle,
            ]}
          />
          <ScaleDownPressable
            containerStyle={{ flexGrow: 1 }}
            className="flex-1"
            onPress={handleOnChange("income")}
          >
            <Choice className="w-full" textStyle={incomeTextStyle}>
              Income
            </Choice>
          </ScaleDownPressable>
          <View className="h-full w-1" />
          <ScaleDownPressable
            containerStyle={{ flexGrow: 1 }}
            onPress={handleOnChange("expense")}
          >
            <Choice className="w-full" textStyle={expenseTextStyle}>
              Expense
            </Choice>
          </ScaleDownPressable>
        </MotiView>
      )}
    </AnimatePresence>
  )
}

function Choice(
  props: ViewProps & { textStyle?: AnimatedStyleProp<TextStyle> },
) {
  return (
    <View {...props} className="h-8 items-center justify-center px-2">
      <Animated.Text
        className="font-satoshi-bold text-mauveDark12 text-base leading-5"
        style={props.textStyle}
        // animate={{
        //   color: props.active ? mauveDark.mauve12 : mauveDark.mauve11,
        // }}
      >
        {props.children}
      </Animated.Text>
    </View>
  )
}

function useActiveTextStyle(
  txnFlow: SharedValue<TransactionFlow>,
  flow: TransactionFlow,
) {
  return useAnimatedStyle(() => ({
    color: withTiming(
      txnFlow.value === flow ? mauveDark.mauve12 : mauveDark.mauve11,
      { duration: 200 },
    ),
  }))
}
