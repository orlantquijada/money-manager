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
  noTransition: {
    type: "timing",
    duration: 0,
  },
} as const
