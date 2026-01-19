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

// 1人分の診断結果
export interface PersonResult {
  personIndex: number;
  recommendedVoiceOption: 'none' | '5min' | 'unlimited';
  estimatedDataUsage: number;
  rankedPlans: PlanScore[];
}

// 家族パターンの1人分のプラン割り当て
export interface PersonPlanAssignment {
  personIndex: number;
  plan: Plan;
  monthlyPrice: number;
}

// 家族パターン比較
export interface FamilyPattern {
  type: 'same_carrier' | 'separate';
  carrierId?: string;
  totalMonthlyPrice: number;
  totalYearlyPrice: number;
  savingsPerYear?: number;
  personPlans: PersonPlanAssignment[];
  pros: string[];
  cons: string[];
}

// 診断結果サマリー
export interface DiagnosisSummary {
  totalPersons: number;
  currentTotalMonthlyFee: number | null;
  recommendedTotalMonthlyFee: number;
  estimatedYearlySavings: number | null;
}

// 診断結果全体
export interface DiagnosisResult {
  summary: DiagnosisSummary;
  savingTips: SavingTip[];
  personResults: PersonResult[];
  familyPatterns?: FamilyPattern[];
  globalWarnings: string[];
  diagnosedAt: string;
}
