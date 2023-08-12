import { Text, View } from "react-native"
import { lime } from "~/utils/colors"
import { toCurrencyShort } from "~/utils/functions"
import { trpc } from "~/utils/trpc"
import ArrowDown from "../../../assets/icons/hero-icons/arrow-down.svg"

export default function TotalSpent() {
  const totalSpent = useTotalSpent()

  return (
    <View>
      <View className="flex-row items-center">
        <Text className="font-nunito-bold text-mauve12 mr-2 text-4xl">
          {toCurrencyShort(totalSpent)}
        </Text>
        {/* TODO: progress relative to previous month */}
        <View className="bg-lime4 aspect-square h-5 items-center justify-center rounded-full">
          <ArrowDown color={lime.lime11} height={16} width={16} />
        </View>
        <Text className="font-satoshi-medium text-lime11 text-sm"> 25%</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="font-satoshi-medium text-mauve10 mr-1 text-base">
          Total spent this month
        </Text>
      </View>
    </View>
  )
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
