import {
  Utensils,
  Store,
  Coffee,
  ShoppingBag,
  Train,
  Smartphone,
  Tv,
  ShoppingCart,
  Gamepad2,
  Heart,
  Shield,
  Zap,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

// カラー定義（温かみのあるナチュラル系）
export const colors = {
  bgBase: '#FBF8F3',       // 温かみのあるオフホワイト
  bgCard: '#FFFCF5',       // クリーム系
  textMain: '#3D2C29',     // 濃いブラウン
  textSub: '#8B7355',      // ミディアムブラウン
  accent: '#E07A5F',       // コーラル
  accentLight: '#FEF3F0',  // コーラル薄め
  border: '#E8DFD3',       // ライトベージュ
  success: '#6A9A78',      // モスグリーン
  warning: '#E09F3E',      // マスタード
} as const;

// グラフ用カラー（パステル寄りの調和のとれた配色）
export const chartColors = [
  '#E07A5F',  // コーラル（食費）
  '#6A9A78',  // モスグリーン（通信）
  '#7BA3C4',  // スカイブルー（交通）
  '#D4A574',  // サンド（日用品）
  '#9B8AA6',  // ラベンダー（娯楽）
  '#A4C4B5',  // セージ（買い物）
  '#E0B88A',  // キャメル（カフェ）
  '#8BAEA2',  // ティール（サブスク）
  '#C9A9A6',  // ローズ（健康）
  '#A5B5A5',  // オリーブ（保険）
  '#C9B8A8',  // ベージュ（光熱費）
  '#A89F91',  // ウォームグレー（その他）
] as const;

// カテゴリIDとカラーのマッピング
export const categoryColors: Record<string, string> = {
  food: '#E07A5F',        // コーラル
  convenience: '#D4A574', // サンド
  cafe: '#E0B88A',        // キャメル
  daily: '#A5B5A5',       // オリーブ
  transport: '#7BA3C4',   // スカイブルー
  telecom: '#6A9A78',     // モスグリーン
  subscription: '#8BAEA2',// ティール
  shopping: '#A4C4B5',    // セージ
  entertainment: '#9B8AA6',// ラベンダー
  health: '#C9A9A6',      // ローズ
  insurance: '#B5A89F',   // トープ
  utility: '#C9B8A8',     // ベージュ
  other: '#A89F91',       // ウォームグレー
};

// カテゴリIDとアイコンのマッピング
const categoryIcons: Record<string, LucideIcon> = {
  food: Utensils,
  convenience: Store,
  cafe: Coffee,
  daily: ShoppingBag,
  transport: Train,
  telecom: Smartphone,
  subscription: Tv,
  shopping: ShoppingCart,
  entertainment: Gamepad2,
  health: Heart,
  insurance: Shield,
  utility: Zap,
  other: MoreHorizontal,
};

// カテゴリIDからアイコンを取得
export function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] || MoreHorizontal;
}
