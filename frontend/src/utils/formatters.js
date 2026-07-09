export function formatCurrency(value, options = {}) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(numericValue);
}

export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(Number(value || 0));
}

export function formatPercent(value) {
  return `${formatNumber(value)}%`;
}
