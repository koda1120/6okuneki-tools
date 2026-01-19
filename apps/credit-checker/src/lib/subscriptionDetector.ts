// サブスクリプション検出処理
import type { CategorizedTransaction, SubscriptionDetection } from '../types';

// サブスクを検出
export function detectSubscriptions(
  transactions: CategorizedTransaction[]
): SubscriptionDetection[] {
  const subscriptionMap = new Map<string, CategorizedTransaction[]>();

  // サブスクとしてマークされたトランザクションをグループ化
  for (const tx of transactions) {
    if (tx.isSubscription && tx.subscriptionInfo) {
      const key = tx.subscriptionInfo.serviceName;
      const existing = subscriptionMap.get(key) || [];
      existing.push(tx);
      subscriptionMap.set(key, existing);
    }
  }

  // 同じ店名で複数回の決済があるものもサブスク候補として追加
  const merchantCounts = new Map<string, CategorizedTransaction[]>();
  for (const tx of transactions) {
    if (!tx.isSubscription && tx.category !== null) {
      const key = tx.description.toUpperCase().substring(0, 20); // 最初の20文字で正規化
      const existing = merchantCounts.get(key) || [];
      existing.push(tx);
      merchantCounts.set(key, existing);
    }
  }

  // 2回以上同じ金額で決済されているものをサブスク候補に追加
  for (const [, txs] of merchantCounts) {
    if (txs.length >= 2) {
      // 同じ金額のものをグループ化
      const amountGroups = new Map<number, CategorizedTransaction[]>();
      for (const tx of txs) {
        const existing = amountGroups.get(tx.amount) || [];
        existing.push(tx);
        amountGroups.set(tx.amount, existing);
      }

      for (const [, samePriceTxs] of amountGroups) {
        if (samePriceTxs.length >= 2) {
          const key = samePriceTxs[0].description;
          if (!subscriptionMap.has(key)) {
            subscriptionMap.set(key, samePriceTxs);
          }
        }
      }
    }
  }

  // SubscriptionDetection形式に変換
  const results: SubscriptionDetection[] = [];

  for (const [serviceName, txs] of subscriptionMap) {
    const sortedTxs = txs.sort((a, b) => a.date.localeCompare(b.date));
    const frequency = detectFrequency(sortedTxs);
    const monthlyAmount = calculateMonthlyAmount(sortedTxs, frequency);

    results.push({
      serviceName,
      category: txs[0].category || 'subscription',
      monthlyAmount,
      yearlyAmount: monthlyAmount * 12,
      frequency,
      cancelUrl: txs[0].subscriptionInfo?.cancelUrl,
      transactions: sortedTxs,
    });
  }

  // 月額金額の降順でソート
  return results.sort((a, b) => b.monthlyAmount - a.monthlyAmount);
}

// 頻度を検出（月額or年額）
function detectFrequency(transactions: CategorizedTransaction[]): 'monthly' | 'yearly' {
  if (transactions.length < 2) return 'monthly';

  // 決済間隔を計算
  const intervals: number[] = [];
  for (let i = 1; i < transactions.length; i++) {
    const prevDate = new Date(transactions[i - 1].date);
    const currDate = new Date(transactions[i].date);
    const daysDiff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    intervals.push(daysDiff);
  }

  // 平均間隔を計算
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // 300日以上なら年額、それ以外は月額
  return avgInterval > 300 ? 'yearly' : 'monthly';
}

// 月額金額を計算
function calculateMonthlyAmount(
  transactions: CategorizedTransaction[],
  frequency: 'monthly' | 'yearly'
): number {
  if (transactions.length === 0) return 0;

  const amounts = transactions.map(tx => tx.amount);
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;

  if (frequency === 'yearly') {
    return Math.round(avgAmount / 12);
  }

  return Math.round(avgAmount);
}

// サブスクの月額合計を計算
export function calculateSubscriptionTotals(
  subscriptions: SubscriptionDetection[]
): { monthly: number; yearly: number } {
  const monthly = subscriptions.reduce((sum, sub) => sum + sub.monthlyAmount, 0);
  return {
    monthly,
    yearly: monthly * 12,
  };
}
