export const getRandomChoice = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export const range = (size: number) => {
  return [...Array(size).keys()]
}

export const clamp = (num: number, min: number, max: number) => {
  "worklet"
  return Math.min(Math.max(num, min), max)
}

export const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})
export const toCurrency = (amount: number) => pesoFormatter.format(amount)
