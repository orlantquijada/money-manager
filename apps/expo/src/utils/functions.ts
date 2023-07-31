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

// hide decimal if walay decimal ang amount
// 100
// 100.50
export const toCurrencyNarrow = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number,
) => {
  let timeoutId: number | undefined = undefined

  return (...args: T) => {
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      callback(...args)
    }, wait)
  }
}

export function capitalize<T extends string>(str: T) {
  return `${str[0]?.toUpperCase()}${str.slice(1)}` as Capitalize<T>
}

export function sum(numArray: number[]) {
  return numArray.reduce((prev, total) => total + prev, 0)
}
