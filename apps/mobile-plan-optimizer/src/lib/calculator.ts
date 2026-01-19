import type { DiagnosisInput } from '../types/diagnosis';
import type { DiagnosisResult } from '../types/result';
import type { Plan } from '../types/plan';
import { filterPlans, estimateDataUsage, recommendVoiceOption } from './filter';
import { scorePlan } from './scorer';
import { generateSavingsTips } from './savingsTips';
import plansData from '../data/plans.json';

/**
 * 診断を実行してメイン結果を返す
 */
export function calculateDiagnosis(input: DiagnosisInput): DiagnosisResult {
  const { user, common } = input;
  const plans = plansData.plans as Plan[];

  // フィルタリング
  const filteredPlans = filterPlans(plans, user, common);

  // スコアリング
  const scoredPlans = filteredPlans
    .map((plan) => scorePlan(plan, user, common, plans))
    .sort((a, b) => b.totalScore - a.totalScore);

  // 上位10件を取得
  const rankedPlans = scoredPlans.slice(0, 10);

  // 推定データ使用量と推奨通話オプション
  const estimatedDataUsage = estimateDataUsage(user);
  const recommendedVoice = recommendVoiceOption(user);

  // 推奨プランの月額
  const recommendedMonthlyFee = rankedPlans[0]?.monthlyPrice || 0;

  // 現在の月額料金を計算（設定されている場合）
  const currentMonthlyFee = user.currentMonthlyFee || null;

  // 年間節約額を計算
  const estimatedYearlySavings = currentMonthlyFee
    ? (currentMonthlyFee - recommendedMonthlyFee) * 12
    : null;

  // 節約提案
  const savingTips = generateSavingsTips(user);

  // 警告
  const globalWarnings: string[] = [];
  if (rankedPlans.length === 0) {
    globalWarnings.push(
      '条件に合うプランが見つかりませんでした。条件を緩めることをおすすめします。'
    );
  }

  return {
    summary: {
      currentMonthlyFee,
      recommendedMonthlyFee,
      estimatedYearlySavings,
      estimatedDataUsage,
      recommendedVoiceOption: recommendedVoice,
    },
    rankedPlans,
    savingTips,
    globalWarnings,
    diagnosedAt: new Date().toISOString(),
  };
}

// Re-export for convenience
export { estimateDataUsage, recommendVoiceOption } from './filter';
