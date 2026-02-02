import type { FundType } from "api";
import { useMemo } from "react";
import { type LayoutChangeEvent, Platform, ScrollView } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  ScalePressable,
  type ScalePressableProps,
} from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Lock, ShoppingBag } from "@/icons";
import {
  type CreateFundScreens,
  FUND_NAME_PLACEHOLDERS,
  useCreateFundStore,
} from "@/lib/create-fund";
import { cn } from "@/utils/cn";
import { transitions } from "@/utils/motion";
import { choice } from "@/utils/random";
import type { IconComponent } from "@/utils/types";
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
  const name = useCreateFundStore((s) => s.name);
  const setName = useCreateFundStore((s) => s.setName);
  const setFundType = useCreateFundStore((s) => s.setFundType);

  // Use shared value as source of truth during selection to avoid re-renders
  // Store is synced only on navigation to prevent animation interruption
  const selectedType = useSharedValue<FundType>("SPENDING");
  const placeholder = useMemo(() => choice(FUND_NAME_PLACEHOLDERS), []);

  const {
    style,
    handleNonNegotiableOnLayout,
    handleSpendingOnLayout,
    // handleTargetOnLayout,
  } = useAnimations(selectedType);

  return (
    <>
      <ScrollView
        className={cn("px-4", Platform.OS === "android" ? "pt-28" : "pt-20")}
        contentContainerClassName="pb-safe-offset-4 flex gap-y-8 flex-1"
      >
        <Presence delay={DELAY} delayMultiplier={5} exitDelayMultiplier={1}>
          <StyledLeanView className="gap-2.5">
            <StyledLeanText className="font-satoshi-medium text-foreground text-lg">
              What&apos;s the name of your fund?
            </StyledLeanText>
            <TextInput
              onChangeText={setName}
              placeholder={placeholder}
              value={name}
            />
          </StyledLeanView>
        </Presence>

        <StyledLeanView className="gap-y-2.5">
          <Presence delay={DELAY} delayMultiplier={6} exitDelayMultiplier={2}>
            <StyledLeanText className="font-satoshi-medium text-foreground text-lg">
              Choose a fund type
            </StyledLeanText>
          </Presence>

          <StyledLeanView className="relative">
            <Presence {...presenceProps[selectedType.get()]}>
              <Animated.View
                className="absolute right-0 left-0 rounded-xl android:border-hairline border-border bg-muted"
                style={[{ borderCurve: "continuous" }, style]}
              />
            </Presence>

            <StyledLeanView style={{ gap: FUND_CARDS_GAP }}>
              <Presence {...presenceProps.SPENDING}>
                <FundCard
                  description="Usually for groceries, transportation"
                  Icon={ShoppingBag}
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
                  Icon={Lock}
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
            </StyledLeanView>
          </StyledLeanView>
        </StyledLeanView>
      </ScrollView>

      <CreateFooter
        disabled={!name.trim()}
        hideBackButton
        onContinuePress={() => {
          // Sync to store before navigating
          const type = selectedType.get();
          setFundType(type);
          navigateToNextScreen(type, setScreen);
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
  Icon: IconComponent;
} & ScalePressableProps;

function FundCard({
  label,
  description,
  pillLabel,
  Icon,
  className,
  ...props
}: FundCardProps) {
  const iconSize = 20;
  return (
    <ScalePressable
      className={cn("flex flex-col gap-1.5 rounded-xl px-4 py-3", className)}
      opacityValue={0.7}
      scaleValue={0.98}
      {...props}
    >
      <StyledLeanView className="flex-row gap-4">
        <Icon className="translate-y-1 self-start text-foreground" size={20} />

        <StyledLeanView className="flex-row items-center gap-2">
          <StyledLeanText className="font-satoshi-medium text-base text-foreground">
            {label}
          </StyledLeanText>

          {!!pillLabel && (
            <StyledLeanView
              className="h-5 items-center justify-center rounded-full bg-background-secondary px-1.5"
              style={{ borderCurve: "continuous" }}
            >
              <StyledLeanText className="font-satoshi-medium text-foreground-muted text-xs tracking-wide">
                {pillLabel}
              </StyledLeanText>
            </StyledLeanView>
          )}
        </StyledLeanView>
      </StyledLeanView>

      <StyledLeanView className="flex-row gap-4">
        <StyledLeanView className="h-px" style={{ width: iconSize }} />
        <StyledLeanText className="shrink font-inter text-foreground-muted text-sm">
          {description}
        </StyledLeanText>
      </StyledLeanView>
    </ScalePressable>
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
    "worklet";
    // Cache shared values at the start to avoid multiple bridge crossings
    const type = selectedType.get();
    const spendingH = spendingHeight.get();
    const nonNegH = nonNegotiableHeight.get();

    // Use function to calculate translateY, avoiding nested ternary
    const getTranslateY = () => {
      if (type === "SPENDING") return 0;
      if (type === "NON_NEGOTIABLE") return FUND_CARDS_GAP + spendingH;
      return FUND_CARDS_GAP * 2 + nonNegH + spendingH; // TARGET
    };
    const translateY = getTranslateY();
    const height = type === "SPENDING" ? spendingH : nonNegH;

    return {
      height: withSpring(height, transitions.snappy),
      transform: [
        { translateY: withSpring(translateY, transitions.lessBounce) },
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
