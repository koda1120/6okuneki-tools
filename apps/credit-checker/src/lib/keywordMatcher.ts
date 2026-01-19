// キーワードマッチング処理
import type { KeywordEntry } from '../types/merchant';
import type { Category } from '../types/category';
import keywordsData from '../data/keywords.json';

interface KeywordResult {
  category: Category;
  subcategory?: string;
  priority: number;
}

// キーワードリストを優先度順にソート
const sortedKeywords = (keywordsData.keywords as KeywordEntry[])
  .sort((a, b) => b.priority - a.priority);

// キーワードマッチング
export function matchKeyword(description: string): KeywordResult | null {
  const upperDesc = description.toUpperCase();

  for (const entry of sortedKeywords) {
    const keyword = entry.keyword;
    const keywordUpper = keyword.toUpperCase();

    // 言語に応じてマッチング
    let matched = false;

    if (entry.language === 'ja') {
      // 日本語キーワードは元のまま比較
      matched = description.includes(keyword);
    } else if (entry.language === 'en') {
      // 英語キーワードは大文字小文字を無視
      matched = upperDesc.includes(keywordUpper);
    } else {
      // both: 両方試行
      matched = description.includes(keyword) || upperDesc.includes(keywordUpper);
    }

    if (matched) {
      return {
        category: entry.category,
        subcategory: entry.subcategory,
        priority: entry.priority,
      };
    }
  }

  return null;
}
