import { useLayoutEffect, useRef } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
  Layout,
  LayoutAnimationFunction,
  withDelay,
  withSpring,
} from "react-native-reanimated"
import * as ContextMenu from "zeego/context-menu"
import * as DropdownMenu from "zeego/dropdown-menu"

import { lime } from "~/utils/colors"
import { toCurrencyShort } from "~/utils/functions"
import { transitions } from "~/utils/motion"
import { trpc } from "~/utils/trpc"

import ArrowDown from "../../../assets/icons/hero-icons/arrow-down.svg"
import Button from "../Button"

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
      <MyMenu />
      <DropMenu />
    </View>
  )
}

export function DropMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button>
          <Text>Hello World</Text>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>label 1</DropdownMenu.Label>
        <DropdownMenu.Item key="key">
          <DropdownMenu.ItemTitle>title 1</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>

        <DropdownMenu.Group>
          <DropdownMenu.Item key="key2">
            <DropdownMenu.ItemTitle>title 1</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemTitle>title 2</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>

        <DropdownMenu.CheckboxItem key="check 2" value="mixed">
          <DropdownMenu.ItemTitle>title 1</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="trigger" textValue="Hello">
            <DropdownMenu.Item key="trigger 2">
              <DropdownMenu.ItemTitle>title 1</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <View>
              <Text>asd</Text>
            </View>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Arrow />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export function MyMenu() {
  return (
    <ContextMenu.Root
    // onOpenChange={(isOpen) => {
    //   console.log(isOpen)
    // }}
    // onOpenWillChange={(willOpen) => {
    //   console.log({ willOpen })
    // }}
    >
      <ContextMenu.Trigger action="longPress">
        <Button>
          <Text>Hello</Text>
        </Button>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Preview>
          {() => <View>{/* <Text>Hello World</Text> */}</View>}
        </ContextMenu.Preview>

        <ContextMenu.Label>Label 1</ContextMenu.Label>
        <ContextMenu.Item key="hello">
          <ContextMenu.ItemTitle>Item Title 1</ContextMenu.ItemTitle>
        </ContextMenu.Item>

        {/* <ContextMenu.Group> */}
        {/*   <ContextMenu.Item key="world"> */}
        {/*     <ContextMenu.ItemTitle>Item Title 2</ContextMenu.ItemTitle> */}
        {/*   </ContextMenu.Item> */}
        {/* </ContextMenu.Group> */}

        {/* <ContextMenu.CheckboxItem key="wow" value={false}> */}
        {/*   <ContextMenu.ItemTitle>Item Title 3</ContextMenu.ItemTitle> */}
        {/*   <ContextMenu.ItemIndicator /> */}
        {/* </ContextMenu.CheckboxItem> */}

        {/* <ContextMenu.Sub> */}
        {/*   <ContextMenu.SubTrigger key="sub1"> */}
        {/*     <Text>Hello World 2</Text> */}
        {/*   </ContextMenu.SubTrigger> */}
        {/*   <ContextMenu.SubContent /> */}
        {/* </ContextMenu.Sub> */}

        <ContextMenu.Separator />
        <ContextMenu.Arrow />
      </ContextMenu.Content>
    </ContextMenu.Root>
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
