import { useLayoutEffect, useRef } from "react"
import { Text, View } from "react-native"
import Animated, {
  Layout,
  LayoutAnimationFunction,
  withDelay,
  withSpring,
} from "react-native-reanimated"

import { lime } from "~/utils/colors"
import { toCurrencyShort } from "~/utils/functions"
import { transitions } from "~/utils/motion"
import { trpc } from "~/utils/trpc"

import ArrowDown from "../../../assets/icons/hero-icons/arrow-down.svg"

export default function TotalSpent() {
  const totalSpent = useTotalSpent()

  const enabled = useRef(false)
  useLayoutEffect(() => {
    enabled.current = true
  }, [])

  return (
    <View className="grow">
      <View className="w-full flex-row items-center">
        <Animated.Text
          className="font-nunito-bold text-mauve12 mr-2 text-4xl"
          key={totalSpent}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exiting={CustomSlideOutUp as any}
          // disable initial animation
          entering={
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            enabled.current ? (CustomSlideInDown as any) : undefined
          }
          layout={Layout.springify()
            .damping(transitions.lessSnappy.damping)
            .stiffness(transitions.lessSnappy.stiffness)}
        >
          {toCurrencyShort(totalSpent)}
        </Animated.Text>
        {/* TODO: progress relative to previous month */}
        <Animated.View
          layout={Layout.springify()
            .damping(transitions.lessSnappy.damping)
            .stiffness(transitions.lessSnappy.stiffness)
            .delay(delay)}
          className="flex-row"
        >
          <View className="bg-lime4 aspect-square h-5 items-center justify-center rounded-full">
            <ArrowDown color={lime.lime11} height={16} width={16} />
          </View>
          <Text className="font-satoshi-medium text-lime11 text-sm"> 25%</Text>
        </Animated.View>
      </View>
      <Text className="font-satoshi-medium text-mauve10 mr-1 text-base">
        Total spent this month
      </Text>
    </View>
  )
}

const offset = 40
const delay = 0

const CustomSlideOutUp: LayoutAnimationFunction = (values) => {
  "worklet"

  const animations = {
    originY: withDelay(delay, withSpring(-offset, transitions.lessSnappy)),
    opacity: withDelay(delay, withSpring(0, transitions.lessSnappy)),
  }
  const initialValues = {
    originY: values.currentOriginY,
    opacity: 1,
  }

  return {
    animations,
    initialValues,
  }
}

const CustomSlideInDown: LayoutAnimationFunction = (_) => {
  "worklet"

  const animations = {
    originY: withDelay(delay, withSpring(0, transitions.lessSnappy)),
    opacity: withDelay(delay, withSpring(1, transitions.lessSnappy)),
  }
  const initialValues = {
    originY: offset,
    opacity: 0,
  }

  return {
    animations,
    initialValues,
  }
}

function useTotalSpent() {
  // NOTE: `allThisMonth` is called twice (it's used in transactions list) but bec. of react-query
  // it doesn't query twice since it's already cached
  const { data: total } = trpc.transaction.allThisMonth.useQuery(undefined, {
    select: (transactions) =>
      transactions.reduce((total, current) => {
        return total + Number(current.amount)
      }, 0),
  })

  return total || 0
}
