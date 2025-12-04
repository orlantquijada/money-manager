import type { FundType } from "api";
import { getDaysInMonth } from "date-fns";
import { amberDark, lime, violet } from "./colors";

export const screenPadding = 16;

export const COMMON_FOLDER_NAMES = [
  "Bills",
  "Wants",
  "Needs",
  "Targets",
  "Spending",
  "Non-negotiable",
  "Entertainment",
  "Subscriptions",
];

export const dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const userId = "cllxs4k5y0000t7ni39urht8i";

export const daysInCurrentMonth = getDaysInMonth(new Date());

export const fundTypeReadableText: Record<FundType, string> = {
  NON_NEGOTIABLE: "Nonnegotiable",
  TARGET: "Target",
  SPENDING: "Spending",
};

export const progressBarColors: Record<FundType, string> = {
  SPENDING: violet.violet6,
  NON_NEGOTIABLE: lime.lime4,
  // amberDark12 90% opacity
  TARGET: `${amberDark.amber12}e6`,
};
