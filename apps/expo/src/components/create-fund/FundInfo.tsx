import { ComponentProps, FC, useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { SvgProps } from "react-native-svg"
import clsx from "clsx"

import { transitions } from "~/utils/motion"

import Presence from "~/components/Presence"
import TextInput from "~/components/TextInput"
import CreateFooter from "~/components/CreateFooter"

import ScaleDownPressable from "../ScaleDownPressable"
import StyledMotiView from "../StyledMotiView"
import { type Fund } from ".prisma/client"

import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg"
import LockIcon from "../../../assets/icons/lock.svg"
import GPSIcon from "../../../assets/icons/gps.svg"

const DELAY = 40
const FUND_CARD_HEIGHT = 65
const FUND_CARD_GAP = 8

const translateY: Record<Fund["fundType"], number> = {
  SPENDING: 0,
  NON_NEGOTIABLE: FUND_CARD_GAP + FUND_CARD_HEIGHT,
  TARGET: (FUND_CARD_GAP + FUND_CARD_HEIGHT) * 2,
}
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

export default function FundInfo({
  onPress,
  onBackPress,
}: {
  onPress: () => void
  onBackPress: () => void
}) {
  const [selectedType, setSelectedType] = useState<Fund["fundType"]>("SPENDING")
  const [fundName, setFundName] = useState("")

  const disabled = !fundName || !selectedType

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
                What's the name of your fund?
              </Text>
              <TextInput
                placeholder="new-fund"
                value={fundName}
                onChangeText={setFundName}
                autoFocus
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
              <Presence {...presenceProps[selectedType]}>
                <StyledMotiView
                  className="bg-mauveDark4 absolute top-0 left-0 right-0 h-[65px] rounded-xl"
                  animate={{ translateY: translateY[selectedType] }}
                  transition={transitions.snappy}
                />
              </Presence>
              <Presence {...presenceProps["SPENDING"]}>
                <ScaleDownPressable onPress={() => setSelectedType("SPENDING")}>
                  <FundCard
                    Icon={ShoppingBagIcon}
                    label="For Spending"
                    description="Description"
                    selected={selectedType === "SPENDING"}
                    className="mb-2"
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps["NON_NEGOTIABLE"]}>
                <ScaleDownPressable
                  onPress={() => setSelectedType("NON_NEGOTIABLE")}
                >
                  <FundCard
                    Icon={LockIcon}
                    label="Non-negotiables"
                    description="Description"
                    selected={selectedType === "NON_NEGOTIABLE"}
                    className="mb-2"
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps["TARGET"]}>
                <ScaleDownPressable onPress={() => setSelectedType("TARGET")}>
                  <FundCard
                    Icon={GPSIcon}
                    label="Targets"
                    description="Description"
                    selected={selectedType === "TARGET"}
                  />
                </ScaleDownPressable>
              </Presence>
            </View>
          </View>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        onContinuePress={onPress}
        onBackPress={onBackPress}
      />
    </>
  )
}

function FundCard({
  label,
  description,
  Icon,
  className,
  style,
}: {
  selected?: boolean
  label: string
  description: string
  Icon: FC<SvgProps>
  className?: string
  style?: ComponentProps<typeof View>["style"]
}) {
  return (
    <StyledMotiView
      className={clsx("flex flex-row rounded-xl py-3 px-4", className)}
      style={style}
    >
      <View className="mt-[6px] mr-4">
        <Icon />
      </View>

      <View>
        <Text className="text-mauveDark12 font-satoshi-medium text-base">
          {label}
        </Text>
        <Text className="text-mauveDark10 font-satoshi-medium text-base">
          {description}
        </Text>
      </View>
    </StyledMotiView>
  )
}
