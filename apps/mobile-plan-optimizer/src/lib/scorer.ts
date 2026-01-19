import type { Plan } from '../types/plan';
import type { UserUsage, CommonSettings } from '../types/diagnosis';
import type { PlanScore, ScoreBreakdown, AppliedDiscount } from '../types/result';
import { estimateDataUsage, recommendVoiceOption } from './filter';

// カード名とユーザー選択値のマッピング
const CARD_MAPPING: Record<string, string[]> = {
  d_card: ['dカード', 'dcard', 'd-card'],
  au_pay: ['au PAYカード', 'aupay', 'au pay'],
  paypay: ['PayPayカード', 'paypay'],
  rakuten: ['楽天カード', 'rakuten', '楽天'],
};

/**
 * ユーザーのカードが対象カードに含まれるかチェック
 */
function matchesTargetCard(userCard: string, targetCards: string[]): boolean {
  if (userCard === 'none' || userCard === 'other') {
    return false;
  }
  if (targetCards.length === 0) {
    return false;
  }

  const userCardKeywords = CARD_MAPPING[userCard] || [];
  return targetCards.some((target) =>
    userCardKeywords.some((keyword) =>
      target.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

/**
 * プランをスコアリングする
 */
export function scorePlan(
  plan: Plan,
  user: UserUsage,
  common: CommonSettings,
  allPlans: Plan[]
): PlanScore {
  const breakdown = calculateBreakdown(plan, user, common, allPlans);
  const voiceOption = recommendVoiceOption(user);
  const monthlyPrice = calculateMonthlyPrice(plan, user, common, voiceOption);
  const appliedDiscounts = getAppliedDiscounts(plan, common);
  const warnings = getWarnings(plan, user, common);

  // 重み付けスコア計算
  const weights = getWeights(common.priority);
  const totalScore = Math.round(
    breakdown.priceScore * weights.price +
    breakdown.qualityScore * weights.quality +
    breakdown.dataScore * weights.data +
    breakdown.voiceScore * weights.voice +
    breakdown.discountScore * weights.discount +
    breakdown.supportScore * weights.support
  );

  return {
    plan,
    totalScore,
    breakdown,
    monthlyPrice,
    yearlyPrice: monthlyPrice * 12,
    appliedDiscounts,
    warnings,
    recommendedVoiceOption: voiceOption,
  };
}

function calculateBreakdown(
  plan: Plan,
  user: UserUsage,
  common: CommonSettings,
  allPlans: Plan[]
): ScoreBreakdown {
  const estimatedUsage = estimateDataUsage(user);

  // 料金スコア（安いほど高スコア）
  const prices = allPlans.map((p) => p.monthlyPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const priceScore = Math.round(
    ((maxPrice - plan.monthlyPrice) / priceRange) * 100
  );

  // 品質スコア（MNO > サブブランド > MVNO）
  const qualityScore = getQualityScore(plan);

  // データ量マッチスコア
  const dataScore = getDataMatchScore(plan, estimatedUsage);

  // 通話オプションスコア
  const voiceOption = recommendVoiceOption(user);
  const voiceScore = getVoiceOptionScore(plan, voiceOption);

  // 割引スコア
  const discountScore = getDiscountScore(plan, common);

  // サポートスコア
  const supportScore = getSupportScore(plan, common);

  return {
    priceScore,
    qualityScore,
    dataScore,
    voiceScore,
    discountScore,
    supportScore,
  };
}

function getWeights(priority: CommonSettings['priority']) {
  const baseWeights = {
    price: 0.25,
    quality: 0.15,
    data: 0.2,
    voice: 0.1,
    discount: 0.15,
    support: 0.15,
  };

  // 重視ポイントの重みを2倍に
  const priorityMap: Record<string, keyof typeof baseWeights> = {
    price: 'price',
    quality: 'quality',
    support: 'support',
    balance: 'price', // バランスの場合は変更なし
  };

  const priorityKey = priorityMap[priority];
  if (priorityKey && priority !== 'balance') {
    const boosted = { ...baseWeights };
    boosted[priorityKey] *= 2;

    // 正規化
    const total = Object.values(boosted).reduce((a, b) => a + b, 0);
    Object.keys(boosted).forEach((key) => {
      boosted[key as keyof typeof boosted] /= total;
    });

    return boosted;
  }

  return baseWeights;
}

function getQualityScore(plan: Plan): number {
  // 回線種別によるスコア
  const networkScores: Record<string, number> = {
    docomo: 90,
    au: 88,
    softbank: 85,
    rakuten: 75,
  };

  const baseScore = networkScores[plan.networkType] || 70;

  // 5G対応でボーナス
  const fiveGBonus = plan.has5g ? 5 : 0;

  return Math.min(100, baseScore + fiveGBonus);
}

function getDataMatchScore(plan: Plan, estimatedUsage: number): number {
  if (plan.dataCapacityGb === null) {
    // 無制限プラン
    return estimatedUsage > 20 ? 100 : 80;
  }

  const ratio = plan.dataCapacityGb / estimatedUsage;

  if (ratio >= 1.5) {
    // 十分な容量
    return 90;
  } else if (ratio >= 1.0) {
    // ちょうど良い
    return 100;
  } else if (ratio >= 0.8) {
    // やや不足
    return 70;
  } else {
    // 不足
    return 40;
  }
}

function getVoiceOptionScore(
  plan: Plan,
  recommended: 'none' | '5min' | 'unlimited'
): number {
  if (recommended === 'none') {
    // 通話オプション不要
    return 100;
  }

  const has5min = plan.voiceOptions.some(
    (o) => o.freeMinutes && o.freeMinutes >= 5
  );
  const hasUnlimited = plan.voiceOptions.some((o) => o.unlimited);

  if (recommended === '5min') {
    return has5min ? 100 : hasUnlimited ? 80 : 60;
  } else {
    return hasUnlimited ? 100 : has5min ? 70 : 50;
  }
}

function getDiscountScore(plan: Plan, common: CommonSettings): number {
  let score = 50; // ベーススコア

  // 光回線割引
  if (plan.homeInternetDiscount.available) {
    const targetServices = plan.homeInternetDiscount.targetServices || [];
    const hasMatch =
      common.homeInternet !== 'none' &&
      (targetServices.length === 0 ||
        targetServices.some((s) =>
          s.toLowerCase().includes(common.homeInternet.replace('_', ' '))
        ));
    if (hasMatch) {
      score += 25;
    }
  }

  // カード割引
  if (plan.cardDiscount.available) {
    const targetCards = plan.cardDiscount.targetCards || [];
    const cardMap: Record<string, string[]> = {
      d_card: ['dcard', 'd-card', 'dカード'],
      au_pay: ['aupay', 'au pay'],
      paypay: ['paypay'],
      rakuten: ['rakuten', '楽天'],
    };
    const userCardKeywords = cardMap[common.creditCard] || [];
    const hasMatch =
      common.creditCard !== 'none' &&
      common.creditCard !== 'other' &&
      (targetCards.length === 0 ||
        targetCards.some((c) =>
          userCardKeywords.some((k) => c.toLowerCase().includes(k))
        ));
    if (hasMatch) {
      score += 25;
    }
  }

  return Math.min(100, score);
}

function getSupportScore(plan: Plan, common: CommonSettings): number {
  switch (common.supportNeed) {
    case 'shop_required':
      return plan.shopSupport.available ? 100 : 0;
    case 'shop_preferred':
      return plan.shopSupport.available ? 100 : 60;
    case 'online_ok':
      return 100;
    default:
      return 70;
  }
}

function calculateMonthlyPrice(
  plan: Plan,
  user: UserUsage,
  common: CommonSettings,
  voiceOption: 'none' | '5min' | 'unlimited'
): number {
  let price = plan.monthlyPrice;
  const estimatedUsage = estimateDataUsage(user);

  // 段階制の場合は使用量に応じた料金
  if (plan.dataCapacityType === 'tiered' && plan.priceTiers) {
    for (const tier of plan.priceTiers) {
      if (estimatedUsage <= tier.upToGb) {
        price = tier.price;
        break;
      }
    }
  }

  // 通話オプション
  if (voiceOption !== 'none') {
    const option = plan.voiceOptions.find((o) =>
      voiceOption === '5min' ? o.freeMinutes && o.freeMinutes >= 5 : o.unlimited
    );
    if (option) {
      price += option.price;
    }
  }

  // 割引適用
  if (plan.homeInternetDiscount.available && plan.homeInternetDiscount.discountAmount) {
    if (common.homeInternet !== 'none') {
      price -= plan.homeInternetDiscount.discountAmount;
    }
  }

  if (plan.cardDiscount.available && plan.cardDiscount.discountAmount) {
    const targetCards = plan.cardDiscount.targetCards || [];
    const cardMatches = matchesTargetCard(common.creditCard, targetCards);
    if (cardMatches) {
      price -= plan.cardDiscount.discountAmount;
    }
  }

  // 家族割引（家族人数に応じて）
  if (plan.familyDiscount.available && plan.familyDiscount.discountPerLine && common.familyMembers >= 2) {
    price -= plan.familyDiscount.discountPerLine;
  }

  return Math.max(0, price);
}

function getAppliedDiscounts(plan: Plan, common: CommonSettings): AppliedDiscount[] {
  const discounts: AppliedDiscount[] = [];

  if (
    plan.homeInternetDiscount.available &&
    plan.homeInternetDiscount.discountAmount &&
    common.homeInternet !== 'none'
  ) {
    discounts.push({
      name: '光回線セット割',
      amount: plan.homeInternetDiscount.discountAmount,
    });
  }

  if (plan.cardDiscount.available && plan.cardDiscount.discountAmount) {
    const targetCards = plan.cardDiscount.targetCards || [];
    if (matchesTargetCard(common.creditCard, targetCards)) {
      discounts.push({
        name: 'カード割引',
        amount: plan.cardDiscount.discountAmount,
      });
    }
  }

  if (plan.familyDiscount.available && plan.familyDiscount.discountPerLine && common.familyMembers >= 2) {
    discounts.push({
      name: `家族割（${common.familyMembers}人）`,
      amount: plan.familyDiscount.discountPerLine,
    });
  }

  return discounts;
}

function getWarnings(
  plan: Plan,
  user: UserUsage,
  common: CommonSettings
): string[] {
  const warnings: string[] = [];
  const estimatedUsage = estimateDataUsage(user);

  // データ量不足の警告
  if (plan.dataCapacityGb !== null && plan.dataCapacityGb < estimatedUsage) {
    warnings.push(
      `推定使用量(${estimatedUsage}GB)に対してデータ容量が不足する可能性があります`
    );
  }

  // 店舗サポートなしの警告
  if (
    (common.supportNeed === 'shop_required' ||
      common.supportNeed === 'shop_preferred') &&
    !plan.shopSupport.available
  ) {
    warnings.push('店舗でのサポートがありません');
  }

  // キャリアメールなしの注意
  if (plan.cautions.some((c) => c.includes('キャリアメール'))) {
    warnings.push('キャリアメールが使用できません');
  }

  return warnings;
}
