// 見直し提案生成処理
import type { DiagnosisResult, ReviewTip } from '../types';

// 見直し提案を生成
export function generateReviewTips(result: DiagnosisResult): ReviewTip[] {
  const tips: ReviewTip[] = [];

  // コンビニ利用が多い（10%以上）
  const convenience = result.byCategory.find(c => c.category === 'convenience');
  if (convenience && convenience.percentage > 10) {
    tips.push({
      id: 'convenience_high',
      title: 'コンビニ出費が多めです',
      description: `コンビニでの支出が月${convenience.totalAmount.toLocaleString()}円（${convenience.percentage.toFixed(1)}%）。スーパーやドラッグストアの活用で節約できるかもしれません。`,
      category: 'convenience',
      amount: convenience.totalAmount,
      severity: 'suggestion',
    });
  }

  // カフェ利用が多い（5%以上または月5,000円以上）
  const cafe = result.byCategory.find(c => c.category === 'cafe');
  if (cafe && (cafe.percentage > 5 || cafe.totalAmount > 5000)) {
    tips.push({
      id: 'cafe_high',
      title: 'カフェ出費が目立ちます',
      description: `カフェでの支出が月${cafe.totalAmount.toLocaleString()}円。自宅でのコーヒーや水筒持参で節約できます。`,
      category: 'cafe',
      amount: cafe.totalAmount,
      severity: 'suggestion',
    });
  }

  // サブスクが5件以上
  if (result.subscriptions.length >= 5) {
    tips.push({
      id: 'subscription_many',
      title: 'サブスクが複数あります',
      description: `${result.subscriptions.length}件のサブスク（月額約${result.subscriptionMonthlyTotal.toLocaleString()}円）。使っていないサービスがないか確認してみましょう。`,
      category: 'subscription',
      amount: result.subscriptionMonthlyTotal,
      severity: 'warning',
    });
  }

  // サブスク月額が1万円以上
  if (result.subscriptionMonthlyTotal > 10000) {
    tips.push({
      id: 'subscription_expensive',
      title: 'サブスク費用が高めです',
      description: `サブスク合計が月${result.subscriptionMonthlyTotal.toLocaleString()}円（年間${result.subscriptionYearlyTotal.toLocaleString()}円）。本当に必要なサービスか見直してみましょう。`,
      category: 'subscription',
      amount: result.subscriptionMonthlyTotal,
      severity: 'warning',
    });
  }

  // 食費が40%以上
  const food = result.byCategory.find(c => c.category === 'food');
  if (food && food.percentage > 40) {
    tips.push({
      id: 'food_high',
      title: '食費の割合が高めです',
      description: `食費が全体の${food.percentage.toFixed(1)}%を占めています。自炊の回数を増やすと節約につながります。`,
      category: 'food',
      amount: food.totalAmount,
      severity: 'info',
    });
  }

  // 娯楽費が15%以上
  const entertainment = result.byCategory.find(c => c.category === 'entertainment');
  if (entertainment && entertainment.percentage > 15) {
    tips.push({
      id: 'entertainment_high',
      title: '娯楽費が多めです',
      description: `娯楽費が月${entertainment.totalAmount.toLocaleString()}円（${entertainment.percentage.toFixed(1)}%）。無料で楽しめる趣味も検討してみましょう。`,
      category: 'entertainment',
      amount: entertainment.totalAmount,
      severity: 'suggestion',
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
