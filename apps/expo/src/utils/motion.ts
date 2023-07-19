import { LayoutAnimationFunction, withSpring } from "react-native-reanimated"

export const transitions = {
  bounce: {
    stiffness: 260,
    damping: 10,
  },
  soft: {
    stiffness: 100,
    damping: 30,
  },
  snappy: {
    stiffness: 300,
    damping: 30,
  },
  snappier: {
    stiffness: 400,
    damping: 30,
  },
  noTransition: {
    type: "timing",
    duration: 0,
  },
} as const

// custom layout animations for create-transaction amount
const offset = 90
export const CustomSlideOutDown: LayoutAnimationFunction = (values) => {
  "worklet"

  const animations = {
    originY: withSpring(offset, transitions.snappier),
    opacity: withSpring(0, transitions.snappier),
  }

  const initialValues = { originY: values.currentOriginY, opacity: 1 }

  return {
    animations,
    initialValues,
  }
}

export const CustomSlideOutUp: LayoutAnimationFunction = (values) => {
  "worklet"

  const animations = {
    originY: withSpring(-offset, transitions.snappier),
    opacity: withSpring(0, transitions.snappier),
  }
  const initialValues = {
    originY: values.currentOriginY,
    opacity: 1,
  }

  return {
    animations,
    initialValues,
  }
}

export const CustomSlideInDown: LayoutAnimationFunction = (_) => {
  "worklet"

  const animations = {
    originY: withSpring(0, transitions.snappier),
    opacity: withSpring(1, transitions.snappier),
  }
  const initialValues = {
    originY: offset,
    opacity: 0,
  }

  return {
    animations,
    initialValues,
  }
}
