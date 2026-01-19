// 診断結果の構築処理
import type {
  CategorizedTransaction,
  DiagnosisResult,
  CategorySummary,
  Category
} from '../types';
import { detectSubscriptions, calculateSubscriptionTotals } from './subscriptionDetector';
import { generateReviewTips } from './reviewTips';
import categoriesData from '../data/categories.json';

// カテゴリIDからラベルを取得
function getCategoryLabel(categoryId: Category): string {
  const category = categoriesData.categories.find(c => c.id === categoryId);
  return category?.label || categoryId;
}

// カテゴリ別サマリーを構築
function buildCategorySummary(transactions: CategorizedTransaction[]): CategorySummary[] {
  const categoryTotals = new Map<Category, { amount: number; count: number }>();

  // 分類済みトランザクションを集計
  for (const tx of transactions) {
    if (tx.category) {
      const existing = categoryTotals.get(tx.category) || { amount: 0, count: 0 };
      existing.amount += tx.amount;
      existing.count += 1;
      categoryTotals.set(tx.category, existing);
    }
  }

  // 合計金額を計算
  const totalAmount = Array.from(categoryTotals.values())
    .reduce((sum, v) => sum + v.amount, 0);

  // CategorySummary形式に変換
  const summaries: CategorySummary[] = Array.from(categoryTotals.entries())
    .map(([category, data]) => ({
      category,
      label: getCategoryLabel(category),
      totalAmount: data.amount,
      transactionCount: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return summaries;
}

// 診断結果を構築
export function buildDiagnosisResult(
  transactions: CategorizedTransaction[]
): DiagnosisResult {
  // 日付でソート
  const sortedTxs = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  // 基本サマリー
  const classifiedTxs = sortedTxs.filter(tx => tx.category !== null);
  const unclassifiedTxs = sortedTxs.filter(tx => tx.category === null);
  const totalAmount = sortedTxs.reduce((sum, tx) => sum + tx.amount, 0);

  const summary = {
    totalAmount,
    transactionCount: sortedTxs.length,
    periodStart: sortedTxs.length > 0 ? sortedTxs[0].date : '',
    periodEnd: sortedTxs.length > 0 ? sortedTxs[sortedTxs.length - 1].date : '',
    classifiedCount: classifiedTxs.length,
    unclassifiedCount: unclassifiedTxs.length,
  };

  // カテゴリ別サマリー
  const byCategory = buildCategorySummary(sortedTxs);

  // サブスク検出
  const subscriptions = detectSubscriptions(sortedTxs);
  const subscriptionTotals = calculateSubscriptionTotals(subscriptions);

  // 分類不能リスト
  const unclassified = unclassifiedTxs.map(tx => ({
    transaction: tx,
    reason: '自動分類できませんでした',
  }));

  // 仮の結果を作成（reviewTips生成用）
  const partialResult: DiagnosisResult = {
    summary,
    byCategory,
    subscriptions,
    subscriptionMonthlyTotal: subscriptionTotals.monthly,
    subscriptionYearlyTotal: subscriptionTotals.yearly,
    reviewTips: [],
    unclassified,
    transactions: sortedTxs,
    analyzedAt: new Date().toISOString(),
  };

  // 見直し提案を生成
  const reviewTips = generateReviewTips(partialResult);

  return {
    ...partialResult,
    reviewTips,
  };
}
