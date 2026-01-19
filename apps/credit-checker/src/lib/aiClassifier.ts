// AI分類処理（Cloudflare Workers AI）
import type { RawTransaction, CategorizedTransaction, Category } from '../types';

const AI_ENDPOINT = '/api/classify';
const FREE_TIER_LIMIT = 50; // 1回のリクエストあたりの上限

interface AiClassificationResult {
  index: number;
  category: string;
  confidence: number;
}

// カテゴリ名（日本語）からカテゴリIDへのマッピング
const categoryMap: Record<string, Category> = {
  '食費': 'food',
  'コンビニ': 'convenience',
  'カフェ': 'cafe',
  '日用品': 'daily',
  '交通費': 'transport',
  '通信費': 'telecom',
  'サブスク': 'subscription',
  'ショッピング': 'shopping',
  '娯楽': 'entertainment',
  '医療・健康': 'health',
  '保険': 'insurance',
  '公共料金': 'utility',
  'その他': 'other',
};

// AIでの分類を実行
export async function classifyWithAi(
  transactions: RawTransaction[],
  createResult: (
    tx: RawTransaction,
    category: Category | null,
    matchMethod: 'ai' | 'unclassified',
    confidence: number
  ) => CategorizedTransaction
): Promise<CategorizedTransaction[]> {
  const results: CategorizedTransaction[] = [];

  // 無料枠内に制限
  const toClassify = transactions.slice(0, FREE_TIER_LIMIT);
  const overflow = transactions.slice(FREE_TIER_LIMIT);

  if (toClassify.length > 0) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descriptions: toClassify.map(tx => tx.description),
        }),
      });

      if (response.ok) {
        const aiResults: AiClassificationResult[] = await response.json();

        // 結果をマッピング
        for (let i = 0; i < toClassify.length; i++) {
          const tx = toClassify[i];
          const aiResult = aiResults.find(r => r.index === i + 1);

          if (aiResult && aiResult.category && categoryMap[aiResult.category]) {
            results.push(createResult(
              tx,
              categoryMap[aiResult.category],
              'ai',
              aiResult.confidence || 60
            ));
          } else {
            results.push(createResult(tx, null, 'unclassified', 0));
          }
        }
      } else {
        // APIエラー時は全て分類不能
        for (const tx of toClassify) {
          results.push(createResult(tx, null, 'unclassified', 0));
        }
      }
    } catch {
      // ネットワークエラー時は全て分類不能
      for (const tx of toClassify) {
        results.push(createResult(tx, null, 'unclassified', 0));
      }
    }
  }

  // 無料枠超過分は分類不能
  for (const tx of overflow) {
    results.push(createResult(tx, null, 'unclassified', 0));
  }

  return results;
}

// AI分類が利用可能かチェック（簡易）
export async function isAiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'HEAD',
    });
    return response.ok;
  } catch {
    return false;
  }
}
