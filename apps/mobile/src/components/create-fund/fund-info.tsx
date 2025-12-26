import type { FundType } from "api";
import type { ComponentProps, ReactNode } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Lock, ShoppingBag } from "@/icons";
import type { CreateFundScreens } from "@/lib/create-fund";
import { cn } from "@/utils/cn";
import { mauveDark } from "@/utils/colors";
import { transitions } from "@/utils/motion";
import FadingEdge, { useOverflowFadeEdge } from "../fading-edge";
import Presence from "../presence";
import TextInput from "../text-input";
import CreateFooter from "./footer";

const DELAY = 40;
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
  // TARGET: {
  //   delayMultiplier: 9,
  //   delay: DELAY,
  //   exitDelayMultiplier: 5,
  // },
} satisfies Record<
  FundType,
  {
    delayMultiplier: number;
    delay: number;
    exitDelayMultiplier: number;
  }
>;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
};

export default function FundInfo({ setScreen }: Props) {
  const selectedType = useSharedValue<FundType>("SPENDING");

  const {
    style,
    handleNonNegotiableOnLayout,
    handleSpendingOnLayout,
    // handleTargetOnLayout,
  } = useAnimations(selectedType);

  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  return (
    <>
      <FadingEdge fadeColor={mauveDark.mauveDark1} {...fadeProps}>
        <ScrollView
          className="p-4 pt-0"
          contentContainerClassName="pb-4 flex gap-y-8"
          onScroll={handleScroll}
        >
          <Presence delay={DELAY} delayMultiplier={5} exitDelayMultiplier={1}>
            <View className="gap-2.5">
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                What&apos;s the name of your fund?
              </Text>
              <TextInput
                placeholder="new-fund"
                // autoFocus={!dirty}
              />
            </View>
          </Presence>

          <View className="gap-y-2.5">
            <Presence delay={DELAY} delayMultiplier={6} exitDelayMultiplier={2}>
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                Choose a fund type
              </Text>
            </Presence>

            <View className="relative">
              <Presence {...presenceProps[selectedType.get()]}>
                <Animated.View
                  className="absolute right-0 left-0 rounded-xl bg-mauveDark4"
                  style={style}
                />
              </Presence>

              <View style={{ gap: FUND_CARDS_GAP }}>
                <Presence {...presenceProps.SPENDING}>
                  <FundCard
                    description="Usually for groceries, transportation"
                    icon={<ShoppingBag />}
                    label="For Spending"
                    onLayout={handleSpendingOnLayout}
                    onPress={() => {
                      selectedType.set("SPENDING");
                    }}
                    pillLabel="Variable"
                  />
                </Presence>

                <Presence {...presenceProps.NON_NEGOTIABLE}>
                  <FundCard
                    description="Automatically set aside money for this budget. Usually for rent, electricity"
                    icon={<Lock />}
                    label="Non-negotiables"
                    onLayout={handleNonNegotiableOnLayout}
                    onPress={() => {
                      selectedType.set("NON_NEGOTIABLE");
                    }}
                    pillLabel="Fixed"
                  />
                </Presence>

                {/* <Presence {...presenceProps.TARGET}> */}
                {/*   <FundCard */}
                {/*     description="Set a target amount to build up over time. Usually for savings, big purchases" */}
                {/*     icon={<Gps />} */}
                {/*     label="Targets" */}
                {/*     onLayout={handleTargetOnLayout} */}
                {/*     onPress={() => { */}
                {/*       selectedType.set("TARGET"); */}
                {/*     }} */}
                {/*   /> */}
                {/* </Presence> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </FadingEdge>

      <CreateFooter
        hideBackButton
        onContinuePress={() => {
          navigateToNextScreen(selectedType.get(), setScreen);
        }}
      >
        Continue
      </CreateFooter>
    </>
  );
}

function navigateToNextScreen(
  fundType: FundType,
  setScreen: (screen: CreateFundScreens) => void
) {
  const screenMap: Record<FundType, CreateFundScreens> = {
    SPENDING: "spendingInfo",
    NON_NEGOTIABLE: "nonNegotiableInfo",
    // TARGET: "targetsInfo",
  };
  setScreen(screenMap[fundType]);
}

type FundCardProps = {
  label: string;
  pillLabel?: string;
  description: string;
  icon: ReactNode;
} & ComponentProps<typeof Pressable>;

function FundCard({
  label,
  description,
  pillLabel,
  icon,
  className,
  ...props
}: FundCardProps) {
  return (
    <Pressable
      className={cn(
        "flex flex-row rounded-xl px-4 py-3 transition-all active:scale-[.98] active:opacity-70",
        className
      )}
      {...props}
    >
      <View className="mt-1.5 mr-4">{icon}</View>

      <View className="flex-shrink">
        <View className="flex-row items-center">
          <Text className="font-satoshi-medium text-base text-mauveDark12">
            {label}
          </Text>

          {!!pillLabel && (
            <View className="ml-2 justify-center rounded-full bg-mauveDark7 px-1.5 py-0.5">
              <Text className="font-satoshi-medium text-mauveDark10 text-xs tracking-wide">
                {pillLabel}
              </Text>
            </View>
          )}
        </View>
        <Text className="font-satoshi-medium text-base text-mauveDark10">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const FUND_CARDS_GAP = 8;

function useAnimations(selectedType: SharedValue<FundType>) {
  const spendingHeight = useSharedValue(0);
  const nonNegotiableHeight = useSharedValue(0);
  const targetHeight = useSharedValue(0);

  const initHeightValue =
    (height: SharedValue<number>) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      height.set(nativeEvent.layout.height);
    };

  const handleSpendingOnLayout = initHeightValue(spendingHeight);
  const handleNonNegotiableOnLayout = initHeightValue(nonNegotiableHeight);
  const handleTargetOnLayout = initHeightValue(targetHeight);

  const style = useAnimatedStyle(() => {
    const height =
      selectedType.get() === "NON_NEGOTIABLE"
        ? nonNegotiableHeight.get()
        : spendingHeight.get();

    // let height = spendingHeight.value;
    // if (selectedType.value === "NON_NEGOTIABLE") {
    //   height = nonNegotiableHeight.value;
    // }
    // } else if (selectedType.value === "TARGET") {
    //   height = targetHeight.value;
    // }

    const translateY = {
      SPENDING: 0,
      NON_NEGOTIABLE: FUND_CARDS_GAP + spendingHeight.get(),
      TARGET:
        FUND_CARDS_GAP * 2 + nonNegotiableHeight.get() + spendingHeight.get(),
    };

    return {
      height: withSpring(height, transitions.snappy),
      transform: [
        {
          translateY: withSpring(
            translateY[selectedType.get()],
            transitions.snappy
          ),
        },
      ],
    };
  });

  return {
    style,
    handleTargetOnLayout,
    handleSpendingOnLayout,
    handleNonNegotiableOnLayout,
  };
}
