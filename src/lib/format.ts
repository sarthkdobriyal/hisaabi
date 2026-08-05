// Shared currency formatter — dashboard, expenses, and cards all render money
// the same way. INR grouping ("en-IN") with no decimals for whole-rupee display.
export function currencyFmt(currency: string): Intl.NumberFormat {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 });
}
