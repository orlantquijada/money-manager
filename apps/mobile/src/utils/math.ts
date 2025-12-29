export function sum(numArray: number[]) {
  return numArray.reduce((prev, total) => total + prev, 0);
}

export function clamp(num: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(num, min), max);
}
