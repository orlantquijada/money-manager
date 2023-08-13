import { Fund } from ".prisma/client"
import { getWeekOfMonth, getWeeksInMonth, isThisMonth } from "date-fns"
import { daysInCurrentMonth } from "./constants"

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

export const shortFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
})
export const toCurrencyShort = (amount: number) => {
  return shortFormatter.format(amount)
}

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

export function getTotalBudgetedAmount(fund: Fund) {
  const budgetedAmount = Number(fund.budgetedAmount)
  const now = new Date()

  if (fund.timeMode === "WEEKLY")
    return isThisMonth(fund.createdAt || now)
      ? (getWeeksInMonth(now) - getWeekOfMonth(now) + 1) * budgetedAmount
      : getWeeksInMonth(now) * budgetedAmount
  else if (fund.timeMode === "BIMONTHLY") {
    return isThisMonth(fund.createdAt || now) &&
      now.getDay() > daysInCurrentMonth / 2
      ? budgetedAmount
      : budgetedAmount * 2
  }

  return budgetedAmount
}
