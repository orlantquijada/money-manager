import { useLayoutEffect, useRef } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
  LinearTransition,
  LayoutAnimationFunction,
  withDelay,
  withSpring,
} from "react-native-reanimated"
import * as ContextMenu from "zeego/context-menu"

import { lime } from "~/utils/colors"
import { toCurrencyShort } from "~/utils/functions"
import { transitions } from "~/utils/motion"
import { trpc } from "~/utils/trpc"
import Button from "../Button"

import ArrowDown from "../../../assets/icons/hero-icons/arrow-down.svg"
import { useSignOut } from "~/utils/hooks/useAuth"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

export default function TotalSpent() {
  const totalSpent = useTotalSpent()

  const enabled = useRef(false)
  useLayoutEffect(() => {
    enabled.current = true
  }, [])

  const navigation = useRootStackNavigation()
  const { handleSignOut } = useSignOut()

  return (
    <View className="grow">
      <View className="w-full flex-row items-center">
        <Pressable
          onPress={() => {
            handleSignOut().then(() => {
              navigation.navigate("Welcome")
            })
          }}
        >
          <Animated.Text
            className="font-nunito-bold text-mauve12 mr-2 text-4xl"
            key={totalSpent}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            exiting={CustomSlideOutUp as any}
            // FIX: initial animation not working on IOS
            // disable initial animation
            entering={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              enabled.current ? (CustomSlideInDown as any) : undefined
            }
            layout={LinearTransition.springify()
              .damping(transitions.lessSnappy.damping)
              .stiffness(transitions.lessSnappy.stiffness)}
          >
            {toCurrencyShort(totalSpent)}
          </Animated.Text>
        </Pressable>
        {/* TODO: progress relative to previous month */}
        <Animated.View
          layout={LinearTransition.springify()
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
      {/* <Dropdown /> */}
    </View>
  )
}

export function Dropdown() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Button>
          <Text>Hello</Text>
        </Button>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Label>Label</ContextMenu.Label>
        <ContextMenu.Item
          key="item 1"
          destructive
          onSelect={() => {
            console.log("wow")
          }}
        >
          <ContextMenu.ItemTitle>Hello World</ContextMenu.ItemTitle>

          <ContextMenu.ItemIcon
            ios={{
              name: "trash", // required
              scale: "small",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

const offset = 40
const delay = 150

const CustomSlideOutUp: LayoutAnimationFunction = (_) => {
  "worklet"

  const animations = {
    transform: [
      {
        translateY: withDelay(
          delay,
          withSpring(-offset, transitions.lessSnappy),
        ),
      },
    ],
    opacity: withDelay(delay, withSpring(0, transitions.lessSnappy)),
  }
  const initialValues = {
    transform: [{ translateY: 0 }],
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
    transform: [
      { translateY: withDelay(delay, withSpring(0, transitions.lessSnappy)) },
    ],
    opacity: withDelay(delay, withSpring(1, transitions.lessSnappy)),
  }
  const initialValues = {
    transform: [{ translateY: offset }],
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
        const amount = Number(current.amount)
        return total + amount
      }, 0),
  })

  return total || 0
}
