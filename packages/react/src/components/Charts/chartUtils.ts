/** Round a data maximum up to a "nice" axis ceiling (1/2/2.5/5 × 10^n). */
export function niceMax(maxValue: number): number {
  if (!Number.isFinite(maxValue) || maxValue <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(maxValue));
  const n = maxValue / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * pow;
}

/** Axis ceiling that lands every division on a round number: nice(max/divisions) × divisions. */
export function niceAxisMax(dataMax: number, divisions: number): number {
  return niceMax(dataMax / Math.max(1, divisions)) * Math.max(1, divisions);
}

/** Evenly spaced tick values from 0 to max inclusive. */
export function tickValues(max: number, divisions: number): number[] {
  return Array.from({ length: divisions + 1 }, (_, i) => (max / divisions) * i);
}

export function defaultFormat(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
}
