// メインのカテゴリ分類処理
import type {
  RawTransaction,
  CategorizedTransaction,
  Category,
  MatchMethod
} from '../types';
import { matchMerchantExact, matchMerchantPartial } from './merchantMatcher';
import { matchKeyword } from './keywordMatcher';
import { classifyWithAi } from './aiClassifier';

// ユニークID生成
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// 分類結果を作成
function createResult(
  tx: RawTransaction,
  category: Category | null,
  matchMethod: MatchMethod,
  confidence: number,
  options: {
    subcategory?: string;
    isSubscription?: boolean;
    cancelUrl?: string;
    merchantName?: string;
  } = {}
): CategorizedTransaction {
  return {
    id: generateId(),
    date: tx.date,
    description: tx.description,
    amount: tx.amount,
    memo: tx.memo,
    category,
    subcategory: options.subcategory,
    matchMethod,
    confidence,
    isSubscription: options.isSubscription || false,
    subscriptionInfo: options.isSubscription ? {
      serviceName: options.merchantName || tx.description,
      frequency: 'unknown',
      cancelUrl: options.cancelUrl,
    } : undefined,
  };
}

// トランザクションを分類
export async function categorizeTransactions(
  transactions: RawTransaction[],
  useAi: boolean = false
): Promise<CategorizedTransaction[]> {
  const results: CategorizedTransaction[] = [];
  const needsAi: RawTransaction[] = [];

  for (const tx of transactions) {
    // Step 1: 店名完全一致
    let merchantResult = matchMerchantExact(tx.description);
    if (merchantResult) {
      results.push(createResult(tx, merchantResult.category, 'merchant_exact', 100, {
        subcategory: merchantResult.subcategory,
        isSubscription: merchantResult.isSubscription,
        cancelUrl: merchantResult.cancelUrl,
        merchantName: merchantResult.merchantName,
      }));
      continue;
    }

    // Step 2: 店名部分一致
    merchantResult = matchMerchantPartial(tx.description);
    if (merchantResult) {
      results.push(createResult(tx, merchantResult.category, 'merchant_partial', 90, {
        subcategory: merchantResult.subcategory,
        isSubscription: merchantResult.isSubscription,
        cancelUrl: merchantResult.cancelUrl,
        merchantName: merchantResult.merchantName,
      }));
      continue;
    }

    // Step 3: キーワードマッチング
    const keywordResult = matchKeyword(tx.description);
    if (keywordResult) {
      results.push(createResult(tx, keywordResult.category, 'keyword', 70, {
        subcategory: keywordResult.subcategory,
      }));
      continue;
    }

    // Step 4: AI分類が必要
    if (useAi) {
      needsAi.push(tx);
    } else {
      // AIを使わない場合は分類不能
      results.push(createResult(tx, null, 'unclassified', 0));
    }
  }

  // AI分類（まとめて処理）
  if (needsAi.length > 0 && useAi) {
    const aiResults = await classifyWithAi(
      needsAi,
      (tx, category, matchMethod, confidence) =>
        createResult(tx, category, matchMethod, confidence)
    );
    results.push(...aiResults);
  }

  return results;
}
