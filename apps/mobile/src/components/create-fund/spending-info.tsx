import type { TimeMode } from "api";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Reanimated3DefaultSpringConfig,
} from "react-native-reanimated";
import type { CreateFundScreens } from "@/lib/create-fund";
import { mauveDark } from "@/utils/colors";
import { transitions } from "@/utils/motion";
import FadingEdge, { useOverflowFadeEdge } from "../fading-edge";
import Presence from "../presence";
import { CurrencyInput } from "../text-input";
import Choice from "./choice";
import CreateFooter from "./footer";

const DELAY = 40;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
};

export default function SpendingInfo({ setScreen }: Props) {
  const [selectedChoice, setSelectedChoice] = useState<TimeMode>();

  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  return (
    <>
      <FadingEdge fadeColor={mauveDark.mauveDark1} {...fadeProps}>
        <ScrollView
          className="p-4 pt-0"
          contentContainerClassName="pb-4 flex gap-y-8"
          onScroll={handleScroll}
        >
          <View className="mb-8">
            <Presence delay={DELAY} delayMultiplier={1}>
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                How frequent do you use this fund?
              </Text>
            </Presence>

            <View className="mt-2.5 flex w-3/5 gap-2">
              <Presence delay={DELAY} delayMultiplier={2}>
                <Choice
                  choiceLabel="A"
                  onPress={() => setSelectedChoice("WEEKLY")}
                  selected={selectedChoice === "WEEKLY"}
                >
                  Weekly
                </Choice>
              </Presence>
              <Presence delay={DELAY} delayMultiplier={3}>
                <Choice
                  choiceLabel="B"
                  onPress={() => setSelectedChoice("MONTHLY")}
                  selected={selectedChoice === "MONTHLY"}
                >
                  Monthly
                </Choice>
              </Presence>

              <Presence delay={DELAY} delayMultiplier={4}>
                <Choice
                  choiceLabel="C"
                  onPress={() => setSelectedChoice("BIMONTHLY")}
                  selected={selectedChoice === "BIMONTHLY"}
                >
                  Twice a Month
                </Choice>
              </Presence>
            </View>
          </View>

          {selectedChoice && (
            <Presence delay={DELAY} delayMultiplier={5}>
              <View className="gap-2.5">
                <View className="flex-row">
                  <Text
                    className="font-satoshi-medium text-lg text-mauveDark12"
                    style={{ lineHeight: undefined }}
                  >
                    How much will you allocate{" "}
                  </Text>
                  <View className="relative">
                    <TimeModeText
                      key={selectedChoice}
                      timeMode={selectedChoice}
                    />
                  </View>
                </View>
                <CurrencyInput defaultValue="10" />
              </View>
            </Presence>
          )}
        </ScrollView>
      </FadingEdge>

      <CreateFooter
        onBackPress={() => {
          setScreen("fundInfo");
        }}
        onContinuePress={() => {
          setScreen("chooseFolder");
        }}
      >
        Continue
      </CreateFooter>
    </>
  );
}

function TimeModeText({ timeMode }: { timeMode: TimeMode }) {
  return (
    <Animated.View
      className="absolute top-0 left-0"
      entering={FadeInDown.springify()
        .damping(transitions.snappy.damping)
        .stiffness(transitions.snappy.stiffness)
        .mass(Reanimated3DefaultSpringConfig.mass)}
      exiting={FadeOutUp.springify()
        .damping(transitions.snappy.damping)
        .stiffness(transitions.snappy.stiffness)
        .mass(Reanimated3DefaultSpringConfig.mass)}
    >
      <Text
        className="font-satoshi-medium text-lg text-mauveDark12"
        style={{ lineHeight: undefined }}
      >
        {readableTimeModeMap[timeMode]}?
      </Text>
    </Animated.View>
  );
}

const readableTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  BIMONTHLY: "twice a month",
  EVENTUALLY: "",
};
