import { Fund, FundType } from ".prisma/client"
import { BottomSheetSectionList, useBottomSheet } from "@gorhom/bottom-sheet"
import { memo } from "react"
import { Text, View } from "react-native"
import { fundTypeReadableText, userId } from "~/utils/constants"
import { getTotalBudgetedAmount, toCurrencyNarrow } from "~/utils/functions"
import { trpc } from "~/utils/trpc"
import ScaleDownPressable from "../ScaleDownPressable"
import clsx from "clsx"
import { useTransactionStore } from "~/utils/hooks/useTransactionStore"

// TODO: skeleton
const FundSectionList = memo(({ searchText }: { searchText: string }) => {
  const funds = useFunds()

  const selectedFund = useTransactionStore((s) => s.fund)

  const { forceClose } = useBottomSheet()

  const handleSetFund = (newFund: Fund) => {
    useTransactionStore.setState({
      fund: newFund.id === selectedFund?.id ? undefined : newFund,
    })
    forceClose()
  }

  const filteredData = searchText
    ? funds.data?.map((item) => ({
        ...item,
        data: item.data.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase()),
        ),
      }))
    : funds.data

  return (
    <BottomSheetSectionList
      sections={filteredData || []}
      renderItem={({ item, section, index }) => {
        const selected = item.id === selectedFund?.id
        const moneyLeft = item.totalBudgetedAmount - item.totalSpent

        return (
          <View
            className={clsx(
              "h-12",
              selected ? "bg-mauveDark4" : "bg-transparent",
              section.data.length - 1 === index && "mb-6",
            )}
          >
            <ScaleDownPressable
              scale={0.98}
              onPress={() => {
                handleSetFund(item)
              }}
              className="h-full flex-row items-center justify-between self-stretch px-4"
            >
              <Text className="text-mauveDark12 font-satoshi-medium text-base">
                {item.name}
              </Text>

              <View className="flex-row items-center gap-1">
                <View
                  className={clsx(
                    "h-8 justify-center rounded-lg px-2",
                    // moneyLeft > 0 && "bg-lime10",
                    // moneyLeft < 0 && "bg-red10",
                  )}
                >
                  <Text
                    className={clsx(
                      "font-nunito-medium text-mauveDark11 text-sm",
                      moneyLeft > 0 && "text-limeDark10",
                      moneyLeft < 0 && "text-redDark10",
                    )}
                  >
                    {toCurrencyNarrow(moneyLeft)}
                  </Text>
                </View>
              </View>
            </ScaleDownPressable>
          </View>
        )
      }}
      renderSectionHeader={({ section }) =>
        section.data.length ? (
          <View className="mb-2 px-4">
            <Text className="text-mauveDark11 font-satoshi-medium text-sm">
              {fundTypeReadableText[section.title]}
            </Text>
          </View>
        ) : null
      }
      keyExtractor={(item) => item.id.toString()}
    />
  )
})
FundSectionList.displayName = "FundSectionList"

function useFunds() {
  return trpc.fund.listFromUserId.useQuery(userId, {
    select: (funds) => {
      const fundsWithBudgetedAmount = funds.map((fund) => ({
        ...fund,
        totalBudgetedAmount: getTotalBudgetedAmount(fund),
      }))

      const fundsGroupedByType: Record<FundType, typeof funds> = {
        SPENDING: [],
        TARGET: [],
        NON_NEGOTIABLE: [],
      }
      for (const fund of fundsWithBudgetedAmount)
        fundsGroupedByType[fund.fundType].push(fund)

      return Object.entries(fundsGroupedByType).map(
        ([title, data]) =>
          ({
            title,
            data,
          } as { title: FundType; data: typeof fundsWithBudgetedAmount }),
      )
    },
  })
}

export default FundSectionList
