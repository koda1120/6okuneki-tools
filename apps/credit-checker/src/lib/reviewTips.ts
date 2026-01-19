// 見直し提案生成処理
import type { DiagnosisResult, ReviewTip } from '../types';
import type { Category } from '../types/category';

// カテゴリ別の高比率メッセージ設定
interface HighRatioConfig {
  threshold: number;      // 高比率とみなす閾値（%）
  title: string;
  getMessage: (amount: number, percentage: number) => string;
  severity: 'info' | 'suggestion' | 'warning';
  isNecessary: boolean;   // 必要経費かどうか
}

const highRatioConfigs: Partial<Record<Category, HighRatioConfig>> = {
  // 必要経費系（削減を促さない）
  health: {
    threshold: 30,
    title: '医療・健康への支出が多めです',
    getMessage: (amount, percentage) =>
      `医療・健康費が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）を占めています。必要な支出ですが、医療費控除の対象になる場合があります。領収書は保管しておきましょう。`,
    severity: 'info',
    isNecessary: true,
  },
  daily: {
    threshold: 35,
    title: '日用品への支出が多めです',
    getMessage: (amount, percentage) =>
      `日用品が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。生活に必要な支出ですが、まとめ買いやプライベートブランドの活用で少し節約できるかもしれません。`,
    severity: 'info',
    isNecessary: true,
  },
  utility: {
    threshold: 25,
    title: '公共料金の比率が高めです',
    getMessage: (amount, percentage) =>
      `公共料金が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。電力会社の見直しや節電・節水を意識すると削減につながることがあります。`,
    severity: 'info',
    isNecessary: true,
  },

  // 見直し可能系
  food: {
    threshold: 40,
    title: '食費の割合が高めです',
    getMessage: (amount, percentage) =>
      `食費が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）を占めています。外食が多い場合は、自炊の回数を増やすと節約につながります。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  convenience: {
    threshold: 10,
    title: 'コンビニ出費が多めです',
    getMessage: (amount, percentage) =>
      `コンビニでの支出が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。スーパーやドラッグストアの活用で節約できるかもしれません。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  cafe: {
    threshold: 5,
    title: 'カフェ出費が目立ちます',
    getMessage: (amount, percentage) =>
      `カフェでの支出が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。自宅でのコーヒーや水筒持参で節約できます。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  entertainment: {
    threshold: 15,
    title: '娯楽費が多めです',
    getMessage: (amount, percentage) =>
      `娯楽費が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。趣味は大切ですが、無料で楽しめる方法も検討してみましょう。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  shopping: {
    threshold: 30,
    title: 'ショッピング出費が多めです',
    getMessage: (amount, percentage) =>
      `ショッピングが${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。衝動買いを避け、本当に必要なものか考える習慣をつけると節約につながります。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  subscription: {
    threshold: 15,
    title: 'サブスク費用の比率が高めです',
    getMessage: (amount, percentage) =>
      `サブスクが${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。使っていないサービスがないか定期的に確認しましょう。`,
    severity: 'warning',
    isNecessary: false,
  },

  // 確認・見直し推奨系
  telecom: {
    threshold: 15,
    title: '通信費の比率が高めです',
    getMessage: (amount, percentage) =>
      `通信費が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。格安SIMやプランの見直しで大幅に節約できる可能性があります。`,
    severity: 'suggestion',
    isNecessary: false,
  },
  transport: {
    threshold: 20,
    title: '交通費の比率が高めです',
    getMessage: (amount, percentage) =>
      `交通費が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。通勤費は必要ですが、定期券の見直しやシェアサイクルの活用も検討してみましょう。`,
    severity: 'info',
    isNecessary: true,
  },
  insurance: {
    threshold: 20,
    title: '保険料の比率が高めです',
    getMessage: (amount, percentage) =>
      `保険料が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。保障内容の見直しで適正化できる場合があります。FPへの相談も検討してみましょう。`,
    severity: 'info',
    isNecessary: true,
  },
  other: {
    threshold: 30,
    title: 'その他の支出が多めです',
    getMessage: (amount, percentage) =>
      `その他に分類された支出が${percentage.toFixed(1)}%（${amount.toLocaleString()}円）。内訳を確認して、削減できるものがないかチェックしてみましょう。`,
    severity: 'info',
    isNecessary: false,
  },
};

// 見直し提案を生成
export function generateReviewTips(result: DiagnosisResult): ReviewTip[] {
  const tips: ReviewTip[] = [];
  const addedCategories = new Set<Category>();

  // カテゴリ別の高比率チェック
  for (const categoryResult of result.byCategory) {
    const config = highRatioConfigs[categoryResult.category];
    if (config && categoryResult.percentage >= config.threshold) {
      tips.push({
        id: `${categoryResult.category}_high_ratio`,
        title: config.title,
        description: config.getMessage(categoryResult.totalAmount, categoryResult.percentage),
        category: categoryResult.category,
        amount: categoryResult.totalAmount,
        severity: config.severity,
      });
      addedCategories.add(categoryResult.category);
    }
  }

  // カフェは金額でもチェック（5,000円以上）
  const cafe = result.byCategory.find(c => c.category === 'cafe');
  if (cafe && !addedCategories.has('cafe') && cafe.totalAmount > 5000) {
    const config = highRatioConfigs.cafe!;
    tips.push({
      id: 'cafe_high_amount',
      title: config.title,
      description: config.getMessage(cafe.totalAmount, cafe.percentage),
      category: 'cafe',
      amount: cafe.totalAmount,
      severity: config.severity,
    });
    addedCategories.add('cafe');
  }

  // サブスクが5件以上
  if (result.subscriptions.length >= 5 && !addedCategories.has('subscription')) {
    tips.push({
      id: 'subscription_many',
      title: 'サブスクが複数あります',
      description: `${result.subscriptions.length}件のサブスク（月額約${result.subscriptionMonthlyTotal.toLocaleString()}円）。使っていないサービスがないか確認してみましょう。`,
      category: 'subscription',
      amount: result.subscriptionMonthlyTotal,
      severity: 'warning',
    });
    addedCategories.add('subscription');
  }

  // サブスク月額が1万円以上
  if (result.subscriptionMonthlyTotal > 10000 && !addedCategories.has('subscription')) {
    tips.push({
      id: 'subscription_expensive',
      title: 'サブスク費用が高めです',
      description: `サブスク合計が月${result.subscriptionMonthlyTotal.toLocaleString()}円（年間${result.subscriptionYearlyTotal.toLocaleString()}円）。本当に必要なサービスか見直してみましょう。`,
      category: 'subscription',
      amount: result.subscriptionMonthlyTotal,
      severity: 'warning',
    });
  }

  // 分類できなかった項目がある
  if (result.unclassified.length > 0) {
    tips.push({
      id: 'unclassified',
      title: '確認が必要な項目があります',
      description: `${result.unclassified.length}件が自動分類できませんでした。内容をご確認ください。`,
      severity: 'info',
    });
  }

  // 特に問題がない場合
  if (tips.length === 0) {
    tips.push({
      id: 'looking_good',
      title: '良好な支出パターンです',
      description: '特に大きな見直しポイントは見つかりませんでした。引き続きバランスの良い家計管理を続けてください。',
      severity: 'info',
    });
  }

  return tips;
}
