export const colors = {
  bgBase: '#F5F7FA',      // 薄いグレーブルー
  bgCard: '#FFFFFF',
  textMain: '#1E2A3B',    // ダークネイビー
  textSub: '#5A6978',     // ミディアムグレー
  accent: '#2C4A7C',      // ネイビー（通常UI）
  lineGreen: '#06C755',   // LINEグリーン（最重要CTA）
  border: '#D8DEE6',
  warning: '#E5A73B',     // アンバー（法定上限超過など）
} as const;

// AD可能性メーターの色分け
export const meterColors = {
  veryLow: '#8B9DB5',     // 0-19: 薄いネイビー
  low: '#8B9DB5',         // 20-39: 薄いネイビー
  medium: '#5A7A9E',      // 40-59: ミディアム
  high: '#2C4A7C',        // 60-79: ネイビー
  veryHigh: '#1E3A5F',    // 80-100: ダークネイビー
} as const;

export type ColorKey = keyof typeof colors;
export type MeterColorKey = keyof typeof meterColors;
