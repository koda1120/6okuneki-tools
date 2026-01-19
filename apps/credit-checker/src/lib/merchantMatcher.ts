// 店名マッチング処理
import type { MerchantEntry } from '../types/merchant';
import type { Category } from '../types/category';
import merchantsData from '../data/merchants.json';

interface MerchantResult {
  category: Category;
  subcategory?: string;
  isSubscription: boolean;
  cancelUrl?: string;
  merchantName: string;
}

// インデックスの構築
const exactIndex = new Map<string, MerchantEntry>();
const aliasIndex = new Map<string, MerchantEntry>();
let indexBuilt = false;

function buildIndex(): void {
  if (indexBuilt) return;

  for (const merchant of merchantsData.merchants as MerchantEntry[]) {
    // 正規化した名前でインデックス
    exactIndex.set(merchant.name.toUpperCase(), merchant);

    // エイリアスでもインデックス
    for (const alias of merchant.aliases) {
      aliasIndex.set(alias.toUpperCase(), merchant);
    }
  }

  indexBuilt = true;
}

// 完全一致マッチング
export function matchMerchantExact(description: string): MerchantResult | null {
  buildIndex();

  const normalized = description.toUpperCase().trim();

  // 完全一致を試行
  let merchant = exactIndex.get(normalized) || aliasIndex.get(normalized);

  if (merchant) {
    return {
      category: merchant.category,
      subcategory: merchant.subcategory,
      isSubscription: merchant.isSubscription || false,
      cancelUrl: merchant.cancelUrl,
      merchantName: merchant.name,
    };
  }

  return null;
}

// 部分一致マッチング
export function matchMerchantPartial(description: string): MerchantResult | null {
  buildIndex();

  const normalized = description.toUpperCase();

  // 完全一致インデックスで部分一致を試行
  for (const [name, merchant] of exactIndex) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return {
        category: merchant.category,
        subcategory: merchant.subcategory,
        isSubscription: merchant.isSubscription || false,
        cancelUrl: merchant.cancelUrl,
        merchantName: merchant.name,
      };
    }
  }

  // エイリアスインデックスで部分一致を試行
  for (const [alias, merchant] of aliasIndex) {
    if (normalized.includes(alias)) {
      return {
        category: merchant.category,
        subcategory: merchant.subcategory,
        isSubscription: merchant.isSubscription || false,
        cancelUrl: merchant.cancelUrl,
        merchantName: merchant.name,
      };
    }
  }

  return null;
}
