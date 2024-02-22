import { ComponentProps, ReactNode } from "react"
import { Text, View } from "react-native"
import clsx from "clsx"

import { toCurrencyNarrow } from "~/utils/functions"
import { trpc } from "~/utils/trpc"

import { Fund } from ".prisma/client"
import StyledMotiView from "../StyledMotiView"

type Props = {
  fundId: Fund["id"]
}

export default function RecentTransactions({ fundId }: Props) {
  const transactions = useTransactions(fundId)

  const { status, data } = transactions

  return (
    <View className="mt-6">
      {status === "success" ? (
        <Content empty={data.length === 0}>
          <Text className="font-satoshi-bold text-mauve9 mr-auto mb-2 text-base">
            Recent Transactions
          </Text>

          {data.map((item) => (
            <View
              className="flex-row items-center justify-between"
              key={item.id}
            >
              <Text
                className={clsx(
                  "font-satoshi-medium text-mauve9 text-base capitalize",
                  !item.store?.name && "font-satoshi",
                )}
              >
                {item.store?.name || "Store needed"}
              </Text>

              <Text className="font-nunito-semibold text-mauve9 ml-auto text-base">
                {toCurrencyNarrow(Number(item.amount))}
              </Text>

              <View className="ml-3 aspect-square w-6"></View>
            </View>
          ))}
        </Content>
      ) : (
        <View className="gap-y-1">
          <View className="flex-row">
            <Pulse className="h-6 w-1/3" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6"></View>
          </View>

          <View className="flex-row">
            <Pulse className="h-6 w-1/2" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6"></View>
          </View>

          <View className="flex-row">
            <Pulse className="h-6 w-2/5" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6"></View>
          </View>
        </View>
      )}
    </View>
  )
}

function Content({
  empty,
  children,
}: {
  empty?: boolean
  children?: ReactNode
}) {
  if (empty) return null
  return children
}

function Pulse({
  children,
  className,
  show,
  ...props
}: ComponentProps<typeof View> & { show?: boolean }) {
  if (show)
    return (
      <StyledMotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 500 }}
        className={clsx("bg-mauve4 self-start rounded-md", className)}
        {...props}
      >
        <View className="opacity-0">{children}</View>
      </StyledMotiView>
    )

  return children
}

function useTransactions(fundId: Fund["id"]) {
  return trpc.transaction.recentByFund.useQuery(fundId)
}
