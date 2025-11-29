import { LinearGradient } from "expo-linear-gradient";
import { SectionList, Text, View } from "react-native";
import type { TransactionSection } from "~/types";
import { violet } from "~/utils/colors";
import {
  formatDefaultReadableDate,
  formatRelativeDate,
  sum,
  toCurrencyNarrow,
} from "~/utils/functions";
import useToggle from "~/utils/hooks/useToggle";

import ScaleDownPressable from "./ScaleDownPressable";

export function TransactionsList({
  transactions,
}: {
  transactions: TransactionSection[];
}) {
  return (
    <SectionList
      contentContainerStyle={{
        paddingBottom: 48,
      }}
      ItemSeparatorComponent={() => <View className="h-2" />}
      keyExtractor={(item) => item.id}
      renderItem={({ item, section, index }) => (
        <View
          className="flex-row items-center bg-violet1"
          style={{
            marginBottom: section.data.length - 1 === index ? 24 : 0,
          }}
        >
          {/* <View className="bg-mauve4 mr-2 aspect-square h-full rounded-full" /> */}

          <View className="flex-grow flex-row items-center justify-between">
            <View>
              <Text className="font-satoshi-bold text-base text-mauve12 capitalize">
                {item.fund.name}
              </Text>
              {item.store ? (
                <Text className="font-satoshi-bold text-base text-mauve8">
                  {item.store.name}
                </Text>
              ) : null}
            </View>

            <Text className="font-nunito-semibold text-base text-mauve11">
              {toCurrencyNarrow(Number(item.amount))}
            </Text>
          </View>
        </View>
      )}
      renderSectionHeader={({ section }) => <SectionHeader section={section} />}
      sections={transactions || []}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled
    />
  );
}

function SectionHeader({ section }: { section: TransactionSection }) {
  const [showDefaultText, { toggle }] = useToggle(true);

  return (
    <View>
      <View className="w-full flex-row items-center justify-between bg-violet1">
        <ScaleDownPressable
          containerStyle={{ flexGrow: 1 }}
          onPress={toggle}
          opacity={0.6}
          scale={1}
        >
          <Text className="font-satoshi-bold text-lg text-mauve8">
            {showDefaultText
              ? formatRelativeDate(section.title, new Date())
              : formatDefaultReadableDate(section.title)}
          </Text>
        </ScaleDownPressable>

        <Text className="font-nunito-bold text-base text-mauve8">
          {toCurrencyNarrow(
            sum(section.data.map(({ amount }) => Number(amount)))
          )}
        </Text>
      </View>
      <View className="relative h-2 w-full overflow-y-visible">
        <LinearGradient
          // violet1 with 0 opacity
          className="absolute top-0 right-0 left-0 z-10 h-6"
          colors={[violet.violet1, "hsla(255, 65.0%, 99.4%, 0)"]}
        />
      </View>
    </View>
  );
}
