/**
 * Chart series palette — Lepidus Design System
 *
 * Each entry is the semantic token --color-chart-series-N (themed per
 * light/dark/hc in tokens.css); the hex fallbacks are the light values.
 * Series 1–3 are the Figma chart styles Bar-Graph1-Color{1,2,3} (node
 * 760:1291); 4–6 extend the ramp with system primitives so longer series
 * stay on-brand. Colors are data-driven, so they are applied inline as
 * var() references rather than through CSS module rules.
 */
export const CHART_COLORS = [
  'var(--color-chart-series-1, #f94144)', // Bar-Graph1-Color1 — red
  'var(--color-chart-series-2, #f9c74f)', // Bar-Graph1-Color2 — yellow
  'var(--color-chart-series-3, #1aa367)', // Bar-Graph1-Color3 — green
  'var(--color-chart-series-4, #1c4599)', // blue-600 (brand)
  'var(--color-chart-series-5, #2391dc)', // cyan-500
  'var(--color-chart-series-6, #7096d1)', // blue-400
] as const;

export function chartColor(index: number, override?: string): string {
  return override ?? CHART_COLORS[index % CHART_COLORS.length];
}
