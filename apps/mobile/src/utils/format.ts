const shortFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
});
export function toCurrencyShort(amount: number) {
  return shortFormatter.format(amount);
}

export function toCurrencyNarrow(amount: number) {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: amount % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

// no decimal
export const wholeCurrencyFormatterOptions = {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;
const wholeFormatter = new Intl.NumberFormat(
  "en-PH",
  wholeCurrencyFormatterOptions
);

export function toWholeCurrency(amount: number) {
  return wholeFormatter.format(amount);
}
