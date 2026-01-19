export const colors = {
  bgBase: '#FAFAFA',      // 純白に近いグレー
  bgCard: '#FFFFFF',
  textMain: '#111827',    // ほぼ黒
  textSub: '#6B7280',
  accent: '#0891B2',      // シアン（テック感）
  border: '#E5E7EB',
  success: '#10B981',     // 緑（節約額の強調）
  warning: '#F59E0B',     // オレンジ（注意）
} as const;

export type ColorKey = keyof typeof colors;
