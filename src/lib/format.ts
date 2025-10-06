export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e9 || abs < 1e-6) {
    return value.toExponential(6).replace(/\.0+e/, "e").replace(/e\+?(-?\d+)/, "e$1");
  }
  // Show up to 10 significant digits but without scientific notation
  const precise = Number.parseFloat(value.toPrecision(10));
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 10 }).format(precise);
}

export function clampDecimals(value: number, maxDecimals = 10): number {
  const factor = Math.pow(10, maxDecimals);
  return Math.round(value * factor) / factor;
}
