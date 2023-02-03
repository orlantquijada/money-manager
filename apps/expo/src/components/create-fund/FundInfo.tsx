import { ComponentProps, FC } from "react"
import { View, Text, ScrollView } from "react-native"
import { SvgProps } from "react-native-svg"
import clsx from "clsx"

import Presence from "~/components/Presence"
import TextInput from "~/components/TextInput"
import CreateFooter from "~/components/CreateFooter"

import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg"
import LockIcon from "../../../assets/icons/lock.svg"
import GPSIcon from "../../../assets/icons/gps.svg"

const DELAY = 40

export default function FundInfo({
  onPress,
  onBackPress,
}: {
  onPress: () => void
  onBackPress: () => void
}) {
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
              <TextInput placeholder="new-fund" />
            </View>
          </Presence>

          <View className="gap-y-[10px]">
            <Presence delayMultiplier={6} delay={DELAY} exitDelayMultiplier={2}>
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                Choose a fund type
              </Text>
            </Presence>

            <View>
              <Presence
                delayMultiplier={7}
                delay={DELAY}
                exitDelayMultiplier={3}
              >
                <FundCard
                  Icon={ShoppingBagIcon}
                  label="For Spending"
                  description="Description"
                  selected
                  className="mb-2"
                />
              </Presence>

              <Presence
                delayMultiplier={8}
                delay={DELAY}
                exitDelayMultiplier={4}
              >
                <FundCard
                  Icon={LockIcon}
                  label="Non-negotiables"
                  description="Description"
                />
              </Presence>

              <Presence
                delayMultiplier={9}
                delay={DELAY}
                exitDelayMultiplier={5}
              >
                <FundCard
                  Icon={GPSIcon}
                  label="Targets"
                  description="Description"
                />
              </Presence>
            </View>
          </View>
        </View>
      </ScrollView>
      <CreateFooter onContinuePress={onPress} onBackPress={onBackPress} />
    </>
  )
}

function FundCard({
  selected = false,
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
    <View
      className={clsx(
        selected && "bg-mauveDark4",
        "flex flex-row rounded-xl py-3 px-4",
        className,
      )}
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
    </View>
  )
}
