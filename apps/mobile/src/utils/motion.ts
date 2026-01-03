import {
  Easing,
  LinearTransition,
  Reanimated3DefaultSpringConfig,
  type WithTimingConfig,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const transitions = {
  bounce: {
    stiffness: 260,
    damping: 10,
    mass: Reanimated3DefaultSpringConfig.mass,
  },
  soft: {
    stiffness: 100,
    damping: 30,
    mass: Reanimated3DefaultSpringConfig.mass,
  },
  lessSnappy: {
    stiffness: 200,
    damping: 30,
    mass: Reanimated3DefaultSpringConfig.mass,
  },
  snappy: {
    stiffness: 300,
    damping: 30,
    mass: Reanimated3DefaultSpringConfig.mass,
  },
  snappier: {
    stiffness: 400,
    damping: 30,
    mass: Reanimated3DefaultSpringConfig.mass,
  },
  noTransition: {
    type: "timing",
    duration: 0,
  },
} as const;

type FlickerOptions = {
  numberOfReps?: number;
  easing?: WithTimingConfig["easing"];
  inactiveOpacity?: number;
  activeOpacity?: number;
  tickDurationMs?: number;
};

export function flicker({
  easing = Easing.linear,
  activeOpacity = 1,
  inactiveOpacity = 0.7,
  numberOfReps = 2,
  tickDurationMs = 120,
}: FlickerOptions = {}) {
  return withSequence(
    withTiming(inactiveOpacity, {
      duration: tickDurationMs,
      easing,
    }),
    withRepeat(
      withTiming(activeOpacity, { duration: tickDurationMs, easing }),
      numberOfReps,
      true
    ),
    withTiming(activeOpacity, { duration: tickDurationMs, easing })
  );
}

type SpringConfigKeys = Exclude<keyof typeof transitions, "noTransition">;

export function layoutSpringify(config: SpringConfigKeys) {
  return LinearTransition.springify()
    .stiffness(transitions[config].stiffness)
    .damping(transitions[config].damping)
    .mass(Reanimated3DefaultSpringConfig.mass);
}

export const totalSpentSlideOutUpConfig = {
  offset: 40,
  delay: 150,
};

export function TotalSpentSlideOutUp() {
  "worklet";

  const { delay, offset } = totalSpentSlideOutUpConfig;

  const animations = {
    transform: [
      {
        translateY: withDelay(
          delay,
          withSpring(-offset, transitions.lessSnappy)
        ),
      },
    ],
    opacity: withDelay(delay, withSpring(0, transitions.lessSnappy)),
  };
  const initialValues = {
    transform: [{ translateY: 0 }],
    opacity: 1,
  };

  return {
    animations,
    initialValues,
  };
}

const digitSlideConfig = {
  offset: 40,
};

export function DigitSlideIn() {
  "worklet";

  const { offset } = digitSlideConfig;

  const animations = {
    transform: [{ translateY: withSpring(0, transitions.snappier) }],
    opacity: withSpring(1, transitions.snappier),
  };
  const initialValues = {
    transform: [{ translateY: offset }],
    opacity: 0,
  };

  return {
    animations,
    initialValues,
  };
}

export function DigitSlideOutDown() {
  "worklet";

  const { offset } = digitSlideConfig;

  const animations = {
    transform: [{ translateY: withSpring(offset, transitions.snappier) }],
    opacity: withSpring(0, transitions.snappier),
  };
  const initialValues = {
    transform: [{ translateY: 0 }],
    opacity: 1,
  };

  return {
    animations,
    initialValues,
  };
}

export function DigitSlideOutUp() {
  "worklet";

  const { offset } = digitSlideConfig;

  const animations = {
    transform: [{ translateY: withSpring(-offset, transitions.snappier) }],
    opacity: withSpring(0, transitions.snappier),
  };
  const initialValues = {
    transform: [{ translateY: 0 }],
    opacity: 1,
  };

  return {
    animations,
    initialValues,
  };
}
