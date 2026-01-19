import type { Plan } from './plan';

// 節約提案
export interface SavingTip {
  id: string;
  title: string;
  description: string;
  estimatedSaving?: string;
}

// スコア内訳
export interface ScoreBreakdown {
  priceScore: number;
  qualityScore: number;
  dataScore: number;
  voiceScore: number;
  discountScore: number;
  supportScore: number;
}

// プランスコア
export interface PlanScore {
  plan: Plan;
  totalScore: number;
  breakdown: ScoreBreakdown;
  monthlyPrice: number;
  yearlyPrice: number;
  savingsPerYear?: number;
  appliedDiscounts: string[];
  warnings: string[];
  recommendedVoiceOption: 'none' | '5min' | 'unlimited';
}

// 診断結果サマリー
export interface DiagnosisSummary {
  currentMonthlyFee: number | null;
  recommendedMonthlyFee: number;
  estimatedYearlySavings: number | null;
  estimatedDataUsage: number;
  recommendedVoiceOption: 'none' | '5min' | 'unlimited';
}

// 診断結果全体
export interface DiagnosisResult {
  summary: DiagnosisSummary;
  rankedPlans: PlanScore[];
  savingTips: SavingTip[];
  globalWarnings: string[];
  diagnosedAt: string;
}
