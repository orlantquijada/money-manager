import type { Fund } from ".prisma/client";
import clsx from "clsx";
import { type ComponentProps, type FC, useState } from "react";
import { type LayoutChangeEvent, ScrollView, Text, View } from "react-native";
import {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { SvgProps } from "react-native-svg";
import CreateFooter from "~/components/CreateFooter";
import Presence from "~/components/Presence";
import TextInput from "~/components/TextInput";
import type { CreateFundScreens, setScreen } from "~/screens/create-fund";
import { transitions } from "~/utils/motion";
import GPSIcon from "../../../assets/icons/gps.svg";
import LockIcon from "../../../assets/icons/lock.svg";
import ShoppingBagIcon from "../../../assets/icons/shopping-bag.svg";
import ScaleDownPressable from "../ScaleDownPressable";
import StyledMotiView from "../StyledMotiView";
import { useFormData } from "./context";

type FundType = Fund["fundType"];
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
  TARGET: {
    delayMultiplier: 9,
    delay: DELAY,
    exitDelayMultiplier: 5,
  },
} as const;

type Props = {
  setScreen: setScreen;
};

export default function FundInfo({ setScreen }: Props) {
  const { setFormValues, formData } = useFormData();
  const selectedType = useSharedValue(formData.fundType || "SPENDING");

  const [fundName, setFundName] = useState(formData.name || "");
  const {
    style,
    handleNonNegotiableOnLayout,
    handleSpendingOnLayout,
    handleTargetOnLayout,
  } = useAnimations(selectedType);

  const disabled = !(fundName && selectedType);
  // const dirty = Boolean(fundName)

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <Presence delay={DELAY} delayMultiplier={5} exitDelayMultiplier={1}>
            <View className="gap-[10px]">
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                What&apos;s the name of your fund?
              </Text>
              <TextInput
                onChangeText={setFundName}
                placeholder="new-fund"
                value={fundName}
                // autoFocus={!dirty}
              />
            </View>
          </Presence>

          <View className="gap-y-[10px]">
            <Presence delay={DELAY} delayMultiplier={6} exitDelayMultiplier={2}>
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                Choose a fund type
              </Text>
            </Presence>

            <View className="relative">
              <Presence {...presenceProps[selectedType.value]}>
                <StyledMotiView
                  className="absolute right-0 left-0 rounded-xl bg-mauveDark4"
                  style={style}
                />
              </Presence>
              <Presence {...presenceProps.SPENDING}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "SPENDING";
                  }}
                >
                  <FundCard
                    className="mb-2"
                    description="Usually for groceries, transportation"
                    Icon={ShoppingBagIcon}
                    label="For Spending"
                    onLayout={handleSpendingOnLayout}
                    pillLabel="Variable"
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps.NON_NEGOTIABLE}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "NON_NEGOTIABLE";
                  }}
                >
                  <FundCard
                    className="mb-2"
                    description="Automatically set aside money for this budget. Usually for rent, electricity"
                    Icon={LockIcon}
                    label="Non-negotiables"
                    onLayout={handleNonNegotiableOnLayout}
                    pillLabel="Fixed"
                  />
                </ScaleDownPressable>
              </Presence>

              <Presence {...presenceProps.TARGET}>
                <ScaleDownPressable
                  onPressIn={() => {
                    selectedType.value = "TARGET";
                  }}
                >
                  <FundCard
                    description="Set a target amount to build up over time. Usually for savings, big purchases"
                    Icon={GPSIcon}
                    label="Targets"
                    onLayout={handleTargetOnLayout}
                  />
                </ScaleDownPressable>
              </Presence>
            </View>
          </View>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        hideBackButton
        onContinuePress={() => {
          const screens: Record<FundType, CreateFundScreens> = {
            SPENDING: "spendingInfo",
            NON_NEGOTIABLE: "nonNegotiableInfo",
            TARGET: "targetsInfo",
          };
          setScreen(screens[selectedType.value]);
          setFormValues({ name: fundName, fundType: selectedType.value });
        }}
      >
        Continue
      </CreateFooter>
    </>
  );
}

function FundCard({
  label,
  description,
  pillLabel,
  Icon,
  className,
  style,
  onLayout,
}: {
  label: string;
  pillLabel?: string;
  description: string;
  Icon: FC<SvgProps>;
} & Pick<ComponentProps<typeof View>, "style" | "className" | "onLayout">) {
  return (
    <StyledMotiView
      className={clsx("flex flex-row rounded-xl px-4 py-3", className)}
      onLayout={onLayout}
      style={style}
    >
      <View className="mt-[6px] mr-4">
        <Icon />
      </View>

      <View className="flex-shrink">
        <View className="flex-row items-center">
          <Text className="font-satoshi-medium text-base text-mauveDark12">
            {label}
          </Text>
          {pillLabel ? (
            <View className="ml-2 justify-center rounded-full bg-mauveDark7 px-1.5 py-0.5">
              <Text className="font-satoshi-medium text-mauveDark10 text-xs tracking-wide">
                {pillLabel}
              </Text>
            </View>
          ) : null}
        </View>
        <Text className="font-satoshi-medium text-base text-mauveDark10">
          {description}
        </Text>
      </View>
    </StyledMotiView>
  );
}

const FUND_CARD_GAP = 8;
function useAnimations(selectedType: SharedValue<FundType>) {
  // NOTE: saving heights on one `SharedValue` doesn't work – I've tried
  const spendingHeight = useSharedValue(0);
  const nonNegotiableHeight = useSharedValue(0);
  const targetHeight = useSharedValue(0);

  const handleOnLayout =
    (height: SharedValue<number>) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      height.value = nativeEvent.layout.height;
    };

  const handleSpendingOnLayout = handleOnLayout(spendingHeight);
  const handleNonNegotiableOnLayout = handleOnLayout(nonNegotiableHeight);
  const handleTargetOnLayout = handleOnLayout(targetHeight);

  const style = useAnimatedStyle(() => {
    let height = spendingHeight.value;
    if (selectedType.value === "NON_NEGOTIABLE") {
      height = nonNegotiableHeight.value;
    } else if (selectedType.value === "TARGET") {
      height = targetHeight.value;
    }

    const translateY = {
      SPENDING: 0,
      NON_NEGOTIABLE: FUND_CARD_GAP + spendingHeight.value,
      TARGET:
        FUND_CARD_GAP * 2 + nonNegotiableHeight.value + spendingHeight.value,
    };

    return {
      height: withSpring(height, transitions.snappy),
      transform: [
        {
          translateY: withSpring(
            translateY[selectedType.value],
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
