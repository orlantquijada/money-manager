import type { LinearGradientPoint } from "expo-linear-gradient";

type LinearGradientDirection = {
  start: LinearGradientPoint;
  end: LinearGradientPoint;
};

export const topToBottom: LinearGradientDirection = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

export const leftToRight: LinearGradientDirection = {
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

export const topLeftToBottomRight: LinearGradientDirection = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};
