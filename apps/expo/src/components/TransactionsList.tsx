import { SectionList, Text, View } from "react-native"

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
                <Text className="text-mauve11 font-satoshi text-base">
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
      contentContainerStyle={{
        paddingBottom: 48,
      }}
    />
  )
}

function SectionHeader({ section }: { section: TransactionSection }) {
  const [showDefaultText, { toggle }] = useToggle(true)

  return (
    <View className="bg-violet1 w-full flex-row items-center justify-between">
      <ScaleDownPressable
        onPress={toggle}
        opacity={0.6}
        scale={1}
        containerStyle={{ flexGrow: 1 }}
      >
        <Text className="text-mauve8 font-satoshi-bold pb-3 text-lg">
          {showDefaultText
            ? formatRelativeDate(section.title, new Date())
            : formatDefaultReadableDate(section.title)}
        </Text>
      </ScaleDownPressable>

      <Text className="text-mauve8 font-nunito-bold pb-3 text-base">
        {toCurrencyNarrow(
          sum(section.data.map(({ amount }) => Number(amount))),
        )}
      </Text>
    </View>
  )
}
