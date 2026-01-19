// カテゴリ型定義

export type Category =
  | 'food'           // 食費
  | 'convenience'    // コンビニ
  | 'cafe'           // カフェ
  | 'daily'          // 日用品
  | 'transport'      // 交通費
  | 'telecom'        // 通信費
  | 'subscription'   // サブスク
  | 'shopping'       // ショッピング
  | 'entertainment'  // 娯楽
  | 'health'         // 医療・健康
  | 'insurance'      // 保険
  | 'utility'        // 公共料金
  | 'other';         // その他

export interface CategoryDefinition {
  id: Category;
  label: string;
  labelEn: string;
  color: string;
  description: string;
  examples: string[];
}
