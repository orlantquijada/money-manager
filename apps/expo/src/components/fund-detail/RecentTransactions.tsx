import { useBottomSheet } from "@gorhom/bottom-sheet";
import type { Fund } from "api";
import { clsx } from "clsx";
import { format } from "date-fns";
import type { ComponentProps, ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { toCurrencyNarrow } from "~/utils/functions";
import { trpc } from "~/utils/trpc";
import StyledMotiView from "../StyledMotiView";

type Props = {
  fundId: Fund["id"];
};

export default function RecentTransactions({ fundId }: Props) {
  const { status, data } = useTransactions(fundId);

  const { animatedIndex } = useBottomSheet();
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0, 1]),
  }));

  return (
    <Animated.View className="mt-6" style={style}>
      {status === "success" ? (
        <Content empty={data.length === 0}>
          <Text className="mr-auto mb-2 font-satoshi-bold text-base text-mauve9">
            Recent Transactions
          </Text>

          {data.map((item) => (
            <View
              className="flex-row items-center justify-between"
              key={item.id}
            >
              <Text
                className={clsx(
                  "font-satoshi-medium text-base text-mauve9",
                  !item.store?.name && "font-satoshi"
                )}
              >
                {item.store?.name ||
                  format(item.date || new Date(), "MMM d 'at' h:mm bbb") ||
                  "Store needed"}
              </Text>

              <Text className="ml-auto font-nunito-semibold text-base text-mauve9">
                {toCurrencyNarrow(Number(item.amount))}
              </Text>

              <View className="ml-3 aspect-square w-6" />
            </View>
          ))}
        </Content>
      ) : (
        <View className="gap-y-1">
          <View className="flex-row">
            <Pulse className="h-6 w-1/3" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6" />
          </View>

          <View className="flex-row">
            <Pulse className="h-6 w-1/2" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6" />
          </View>

          <View className="flex-row">
            <Pulse className="h-6 w-2/5" show />
            <Pulse className="ml-auto h-6 w-12" show />
            <View className="ml-3 aspect-square w-6" />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

function Content({
  empty,
  children,
}: {
  empty?: boolean;
  children?: ReactNode;
}) {
  if (empty) {
    return null;
  }
  return children;
}

function Pulse({
  children,
  className,
  show,
  ...props
}: ComponentProps<typeof View> & { show?: boolean }) {
  if (show) {
    return (
      <StyledMotiView
        animate={{ opacity: 1 }}
        className={clsx("self-start rounded-md bg-mauve4", className)}
        from={{ opacity: 0.5 }}
        transition={{ loop: true, duration: 500 }}
        {...props}
      >
        <View className="opacity-0">{children}</View>
      </StyledMotiView>
    );
  }

  return children;
}

function useTransactions(fundId: Fund["id"]) {
  return trpc.transaction.recentByFund.useQuery(fundId);
}
