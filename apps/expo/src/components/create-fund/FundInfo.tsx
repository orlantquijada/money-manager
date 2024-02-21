import { ComponentProps, FC, useState } from "react"
import { View, Text, ScrollView, LayoutChangeEvent } from "react-native"
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { SvgProps } from "react-native-svg"
import clsx from "clsx"

import { transitions } from "~/utils/motion"

import Presence from "~/components/Presence"
import TextInput from "~/components/TextInput"
import CreateFooter from "~/components/CreateFooter"
import { setScreen, type CreateFundScreens } from "~/screens/create-fund"

import ScaleDownPressable from "../ScaleDownPressable"
import StyledMotiView from "../StyledMotiView"
import { type Fund } from ".prisma/client"
import { useFormData } from "./context"

import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg"
import LockIcon from "../../../assets/icons/lock.svg"
import GPSIcon from "../../../assets/icons/gps.svg"

type FundType = Fund["fundType"]
const DELAY = 40
const presenceProps = {
  SPENDING: {
    delayMultiplier: 7,
    delay: DELAY,
    exitDelayMultiplier: 3,
  },
  NON_NEGOTIABLE: {
    delayMultiplier: 8,
    delay: DELAY,
    exitDelayMultiplier: 4,
  },
  TARGET: {
    delayMultiplier: 9,
    delay: DELAY,
    exitDelayMultiplier: 5,
  },
} as const

type Props = {
  setScreen: setScreen
}

export default function FundInfo({ setScreen }: Props) {
  const { setFormValues, formData } = useFormData()
  const selectedType = useSharedValue(formData.fundType || "SPENDING")

  const [fundName, setFundName] = useState(formData.name || "")
  const {
    style,
    handleNonNegotiableOnLayout,
    handleSpendingOnLayout,
    handleTargetOnLayout,
  } = useAnimations(selectedType)

  const disabled = !fundName || !selectedType
  // const dirty = Boolean(fundName)

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <Presence delayMultiplier={5} delay={DELAY} exitDelayMultiplier={1}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                What&apos;s the name of your fund?
              </Text>
              <TextInput
                placeholder="new-fund"
                value={fundName}
                onChangeText={setFundName}
                // autoFocus={!dirty}
              />
            </View>
          </Presence>

          <View className="gap-y-[10px]">
            <Presence delayMultiplier={6} delay={DELAY} exitDelayMultiplier={2}>
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                Choose a fund type
              </Text>
            </Presence>

            <View className="relative">
              <Presence {...presenceProps[selectedType.value]}>
                <StyledMotiView
                  className="bg-mauveDark4 absolute left-0 right-0 rounded-xl"
                  style={style}
                />
              </Presence>
              <Presence {...presenceProps["SPENDING"]}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "SPENDING"
                  }}
                >
                  <FundCard
                    Icon={ShoppingBagIcon}
                    label="For Spending"
                    pillLabel="Variable"
                    description="Usually for groceries, transportation"
                    className="mb-2"
                    onLayout={handleSpendingOnLayout}
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps["NON_NEGOTIABLE"]}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "NON_NEGOTIABLE"
                  }}
                >
                  <FundCard
                    Icon={LockIcon}
                    label="Non-negotiables"
                    pillLabel="Fixed"
                    description="Automatically set aside money for this budget. Usually for rent, electricity"
                    className="mb-2"
                    onLayout={handleNonNegotiableOnLayout}
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps["TARGET"]}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "TARGET"
                  }}
                >
                  <FundCard
                    Icon={GPSIcon}
                    label="Targets"
                    description="Set a target amount to build up over time. Usually for savings, big purchases"
                    onLayout={handleTargetOnLayout}
                  />
                </ScaleDownPressable>
              </Presence>
            </View>
          </View>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        hideBackButton
        onContinuePress={() => {
          const screens: Record<FundType, CreateFundScreens> = {
            SPENDING: "spendingInfo",
            NON_NEGOTIABLE: "nonNegotiableInfo",
            TARGET: "targetsInfo",
          }
          setScreen(screens[selectedType.value])
          setFormValues({ name: fundName, fundType: selectedType.value })
        }}
      >
        Continue
      </CreateFooter>
    </>
  )
}

function FundCard({
  label,
  description,
  pillLabel,
  Icon,
  className,
  style,
  onLayout,
}: {
  label: string
  pillLabel?: string
  description: string
  Icon: FC<SvgProps>
} & Pick<ComponentProps<typeof View>, "style" | "className" | "onLayout">) {
  return (
    <StyledMotiView
      className={clsx("flex flex-row rounded-xl py-3 px-4", className)}
      style={style}
      onLayout={onLayout}
    >
      <View className="mt-[6px] mr-4">
        <Icon />
      </View>

      <View className="flex-shrink">
        <View className="flex-row items-center">
          <Text className="text-mauveDark12 font-satoshi-medium text-base">
            {label}
          </Text>
          {pillLabel ? (
            <View className="bg-mauveDark7 ml-2 justify-center rounded-full px-1.5 py-0.5">
              <Text className="font-satoshi-medium text-mauveDark10 text-xs tracking-wide">
                {pillLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="text-mauveDark10 font-satoshi-medium text-base">
          {description}
        </Text>
      </View>
    </StyledMotiView>
  )
}

const FUND_CARD_GAP = 8
function useAnimations(selectedType: SharedValue<FundType>) {
  // NOTE: saving heights on one `SharedValue` doesn't work – I've tried
  const spendingHeight = useSharedValue(0)
  const nonNegotiableHeight = useSharedValue(0)
  const targetHeight = useSharedValue(0)

  const handleOnLayout =
    (height: SharedValue<number>) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      height.value = nativeEvent.layout.height
    }

  const handleSpendingOnLayout = handleOnLayout(spendingHeight)
  const handleNonNegotiableOnLayout = handleOnLayout(nonNegotiableHeight)
  const handleTargetOnLayout = handleOnLayout(targetHeight)

  const style = useAnimatedStyle(() => {
    let height = spendingHeight.value
    if (selectedType.value === "NON_NEGOTIABLE")
      height = nonNegotiableHeight.value
    else if (selectedType.value === "TARGET") height = targetHeight.value

    const translateY = {
      SPENDING: 0,
      NON_NEGOTIABLE: FUND_CARD_GAP + spendingHeight.value,
      TARGET:
        FUND_CARD_GAP * 2 + nonNegotiableHeight.value + spendingHeight.value,
    }

    return {
      height: withSpring(height, transitions.snappy),
      transform: [
        {
          translateY: withSpring(
            translateY[selectedType.value],
            transitions.snappy,
          ),
        },
      ],
    }
  })

  return {
    style,
    handleTargetOnLayout,
    handleSpendingOnLayout,
    handleNonNegotiableOnLayout,
  }
}
