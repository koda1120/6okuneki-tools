import type { DiagnosisInput } from '../types/diagnosis';
import type { DiagnosisResult, PersonResult, FamilyPattern } from '../types/result';
import type { Plan } from '../types/plan';
import { filterPlans, estimateDataUsage, recommendVoiceOption } from './filter';
import { scorePlan } from './scorer';
import { mergeAllTips } from './savingsTips';
import plansData from '../data/plans.json';

/**
 * 診断を実行してメイン結果を返す
 */
export function calculateDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const { personCount, persons, common } = input;
  const plans = plansData.plans as Plan[];

  // 各人の結果を計算
  const personResults: PersonResult[] = persons.map((person, index) => {
    // フィルタリング
    const filteredPlans = filterPlans(plans, person, common);

    // スコアリング
    const scoredPlans = filteredPlans
      .map((plan) => scorePlan(plan, person, common, plans))
      .sort((a, b) => b.totalScore - a.totalScore);

    return {
      personIndex: index,
      recommendedVoiceOption: recommendVoiceOption(person),
      estimatedDataUsage: estimateDataUsage(person),
      rankedPlans: scoredPlans.slice(0, 10), // 上位10件
    };
  });

  // 現在の合計月額を計算
  let currentTotalMonthlyFee: number | null = null;
  const feeParsers: Record<string, number> = {
    '0-1000': 500,
    '1000-2000': 1500,
    '2000-3000': 2500,
    '3000-5000': 4000,
    '5000-7000': 6000,
    '7000-10000': 8500,
    '10000+': 12000,
  };

  const validFees = persons
    .map((p) => feeParsers[p.currentMonthlyFee])
    .filter((f) => f !== undefined);

  if (validFees.length > 0) {
    currentTotalMonthlyFee = validFees.reduce((a, b) => a + b, 0);
  }

  // おすすめの合計月額を計算
  const recommendedTotalMonthlyFee = personResults.reduce(
    (total, result) => total + (result.rankedPlans[0]?.monthlyPrice || 0),
    0
  );

  // 年間節約額を計算
  const estimatedYearlySavings = currentTotalMonthlyFee
    ? (currentTotalMonthlyFee - recommendedTotalMonthlyFee) * 12
    : null;

  // 家族パターン比較（2人以上の場合）
  let familyPatterns: FamilyPattern[] | undefined;
  if (personCount > 1) {
    familyPatterns = calculateFamilyPatterns(personResults, common);
  }

  // 節約提案
  const savingTips = mergeAllTips(persons);

  // 警告
  const globalWarnings: string[] = [];
  if (personResults.some((r) => r.rankedPlans.length === 0)) {
    globalWarnings.push(
      '条件に合うプランが見つからない方がいます。条件を緩めることをおすすめします。'
    );
  }

  return {
    summary: {
      totalPersons: personCount,
      currentTotalMonthlyFee,
      recommendedTotalMonthlyFee,
      estimatedYearlySavings,
    },
    savingTips,
    personResults,
    familyPatterns,
    globalWarnings,
    diagnosedAt: new Date().toISOString(),
  };
}

/**
 * 家族パターン比較を計算
 */
function calculateFamilyPatterns(
  personResults: PersonResult[],
  _common: DiagnosisInput['common']
): FamilyPattern[] {
  const patterns: FamilyPattern[] = [];

  // パターン1: 各自最適なプラン（別々キャリア）
  const separatePattern: FamilyPattern = {
    type: 'separate',
    totalMonthlyPrice: personResults.reduce(
      (total, r) => total + (r.rankedPlans[0]?.monthlyPrice || 0),
      0
    ),
    totalYearlyPrice: 0,
    personPlans: personResults.map((r) => ({
      personIndex: r.personIndex,
      plan: r.rankedPlans[0]?.plan,
      monthlyPrice: r.rankedPlans[0]?.monthlyPrice || 0,
    })),
    pros: ['各自に最適なプランを選択可能', '柔軟な乗り換えが可能'],
    cons: ['家族割引が使えない場合がある', '管理が複雑になる可能性'],
  };
  separatePattern.totalYearlyPrice = separatePattern.totalMonthlyPrice * 12;
  patterns.push(separatePattern);

  // パターン2: 同一キャリア（家族割適用）
  // 各人のトッププランのキャリアを集計
  const carrierCounts = new Map<string, number>();
  personResults.forEach((r) => {
    const topPlans = r.rankedPlans.slice(0, 3);
    topPlans.forEach((p) => {
      const carrierId = p.plan.carrierId;
      carrierCounts.set(carrierId, (carrierCounts.get(carrierId) || 0) + 1);
    });
  });

  // 最も多く登場するキャリアで統一パターンを作成
  const topCarrier = Array.from(carrierCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];

  if (topCarrier) {
    const carrierId = topCarrier[0];
    const sameCarrierPlans = personResults.map((r) => {
      const matchingPlan = r.rankedPlans.find(
        (p) => p.plan.carrierId === carrierId
      );
      return {
        personIndex: r.personIndex,
        plan: matchingPlan?.plan || r.rankedPlans[0]?.plan,
        monthlyPrice: matchingPlan?.monthlyPrice || r.rankedPlans[0]?.monthlyPrice || 0,
      };
    });

    // 家族割引を適用（簡易計算）
    let familyDiscount = 0;
    const firstPlan = sameCarrierPlans[0]?.plan;
    if (firstPlan?.familyDiscount.available && firstPlan.familyDiscount.discountPerLine) {
      familyDiscount =
        firstPlan.familyDiscount.discountPerLine *
        Math.min(personResults.length, firstPlan.familyDiscount.maxLines || 10);
    }

    const totalMonthlyWithDiscount =
      sameCarrierPlans.reduce((total, p) => total + p.monthlyPrice, 0) -
      familyDiscount;

    const samePattern: FamilyPattern = {
      type: 'same_carrier',
      carrierId,
      totalMonthlyPrice: Math.max(0, totalMonthlyWithDiscount),
      totalYearlyPrice: Math.max(0, totalMonthlyWithDiscount) * 12,
      personPlans: sameCarrierPlans,
      pros: ['家族割引が適用される', '請求をまとめられる', 'サポートが一本化'],
      cons: [
        '個人の最適プランとは異なる場合がある',
        '乗り換え時に全員の調整が必要',
      ],
    };
    patterns.push(samePattern);
  }

  return patterns;
}

// Re-export for convenience
export { estimateDataUsage, recommendVoiceOption } from './filter';
