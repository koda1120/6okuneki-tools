import { config } from '../constants/config';

interface SavingsResult {
  currentFee: number;
  legalMaxFee: number;
  isOvercharged: boolean;
  potentialSavings: number;
}

export function calculateSavings(rent: number, brokerageFee: number): SavingsResult {
  // 法定上限は家賃の1.1ヶ月分（税込）
  const legalMaxFee = rent * config.legalMaxRate;

  // 法定上限を超えているか（1%の誤差許容）
  const isOvercharged = brokerageFee > legalMaxFee * 1.01;

  // 節約可能額（手数料0円になった場合）
  const potentialSavings = brokerageFee;

  return { currentFee: brokerageFee, legalMaxFee, isOvercharged, potentialSavings };
}

export function getNegotiationRecommendation(
  adProbabilityScore: number,
  isOvercharged: boolean
): 'strong' | 'moderate' | 'weak' {
  if (isOvercharged || adProbabilityScore >= 70) {
    return 'strong';
  }
  if (adProbabilityScore >= 50) {
    return 'moderate';
  }
  return 'weak';
}

export function formatCurrency(value: number): string {
  return `${value.toFixed(1)}万円`;
}
