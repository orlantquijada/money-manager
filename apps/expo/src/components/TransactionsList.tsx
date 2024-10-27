import { SectionList, Text, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { violet } from "~/utils/colors"
import {
  formatDefaultReadableDate,
  formatRelativeDate,
  sum,
  toCurrencyNarrow,
} from "~/utils/functions"
import useToggle from "~/utils/hooks/useToggle"
import type { TransactionSection } from "~/types"

import ScaleDownPressable from "./ScaleDownPressable"

export function TransactionsList({
  transactions,
}: {
  transactions: TransactionSection[]
}) {
  return (
    <SectionList
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item, section, index }) => (
        <View
          className="bg-violet1 flex-row items-center"
          style={{
            marginBottom: section.data.length - 1 === index ? 24 : 0,
          }}
        >
          {/* <View className="bg-mauve4 mr-2 aspect-square h-full rounded-full" /> */}

          <View className="flex-grow flex-row items-center justify-between">
            <View>
              <Text className="text-mauve12 font-satoshi-bold text-base capitalize">
                {item.fund.name}
              </Text>
              {item.store ? (
                <Text className="text-mauve8 font-satoshi-bold text-base">
                  {item.store.name}
                </Text>
              ) : null}
            </View>

            <Text className="text-mauve11 font-nunito-semibold text-base">
              {toCurrencyNarrow(Number(item.amount))}
            </Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
      renderSectionHeader={({ section }) => <SectionHeader section={section} />}
      sections={transactions || []}
      stickySectionHeadersEnabled
      contentContainerStyle={{
        paddingBottom: 48,
      }}
    />
  )
}

function SectionHeader({ section }: { section: TransactionSection }) {
  const [showDefaultText, { toggle }] = useToggle(true)

  return (
    <View>
      <View className="bg-violet1 w-full flex-row items-center justify-between">
        <ScaleDownPressable
          onPress={toggle}
          opacity={0.6}
          scale={1}
          containerStyle={{ flexGrow: 1 }}
        >
          <Text className="text-mauve8 font-satoshi-bold text-lg">
            {showDefaultText
              ? formatRelativeDate(section.title, new Date())
              : formatDefaultReadableDate(section.title)}
          </Text>
        </ScaleDownPressable>

        <Text className="text-mauve8 font-nunito-bold text-base">
          {toCurrencyNarrow(
            sum(section.data.map(({ amount }) => Number(amount))),
          )}
        </Text>
      </View>
      <View className="relative h-2 w-full overflow-y-visible">
        <LinearGradient
          // violet1 with 0 opacity
          colors={[violet.violet1, "hsla(255, 65.0%, 99.4%, 0)"]}
          className="absolute left-0 top-0 right-0 z-10 h-6"
        />
      </View>
    </View>
  )
}
