import {
  Easing,
  LinearTransition,
  Reanimated3DefaultSpringConfig,
  type WithTimingConfig,
  withRepeat,
  withSequence,
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

export const layoutSpringify = LinearTransition.springify()
  .stiffness(transitions.snappy.stiffness)
  .damping(transitions.snappy.damping)
  .mass(Reanimated3DefaultSpringConfig.mass);
