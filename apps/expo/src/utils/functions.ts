import { Fund, Transaction } from ".prisma/client"
import {
  differenceInCalendarDays,
  format,
  getWeekOfMonth,
  getWeeksInMonth,
  isThisMonth,
  isThisYear,
} from "date-fns"
import { dayOfWeek, daysInCurrentMonth } from "./constants"

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
      ? (getWeeksInMonth(now) - getWeekOfMonth(fund.createdAt || now) + 1) *
          budgetedAmount
      : getWeeksInMonth(now) * budgetedAmount
  else if (fund.timeMode === "BIMONTHLY") {
    return fund.createdAt &&
      isThisMonth(fund.createdAt) &&
      fund.createdAt.getDate() > daysInCurrentMonth / 2
      ? budgetedAmount
      : budgetedAmount * 2
  }

  return budgetedAmount
}

export function formatDefaultReadableDate(date: Date) {
  return format(date, isThisYear(date) ? "MMM d" : "MMM d, yyyy")
}

export function formatRelativeDate(toDate: Date, baseDate: Date) {
  const diff = differenceInCalendarDays(toDate, baseDate)

  if (diff === 0) return "Today"
  else if (diff === 1) return "Tomorrow"
  else if (diff === -1) return "Yesterday"
  else if (diff < -1 && diff > -7) return `Last ${dayOfWeek[toDate.getDay()]}`

  return formatDefaultReadableDate(toDate)
}

const formatKey = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}
const parseKey = (dateString: string) => {
  const [year, month, date] = dateString.split("-").map(Number)
  // @ts-expect-error type should be Number bec of the cast
  return new Date(year, month, date)
}
export function groupTransactionByDate<T extends Transaction>(
  transactions: T[],
) {
  // date string as key
  const groupByDate: Record<string, typeof transactions[number][]> = {}

  for (const transaction of transactions) {
    const date = transaction.date
    const key = formatKey(transaction.date || new Date())
    if (!date) continue
    else if (groupByDate[key]) {
      groupByDate[key]?.push(transaction)
    } else {
      groupByDate[key] = [transaction]
    }
  }

  return Object.entries(groupByDate).map(([key, value]) => ({
    title: parseKey(key),
    data: value,
  }))
}

export function getInnerBorderRadius(outerRadius: number, padding: number) {
  return outerRadius - padding
}
