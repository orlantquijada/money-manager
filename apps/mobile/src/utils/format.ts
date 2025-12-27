const shortFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
});
export function toCurrencyShort(amount: number) {
  return shortFormatter.format(amount);
}
