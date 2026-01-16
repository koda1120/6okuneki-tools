import type { PropertyInfo, DiagnosisResult } from '../types';
import { calculateAdProbability } from './adCalculator';
import { calculateSavings, getNegotiationRecommendation } from './savingsCalculator';
import { getApplicableTips } from '../data/tips';

interface InputCompletenessResult {
  completeness: number;
  missingFields: string[];
}

function calculateInputCompleteness(info: PropertyInfo): InputCompletenessResult {
  const fieldLabels: Record<keyof PropertyInfo, string> = {
    rent: '家賃',
    brokerageFee: '仲介手数料',
    propertyType: '物件種別',
    area: 'エリア',
    buildingAge: '築年数',
    vacancyPeriod: '空室期間',
    moveInMonth: '入居予定月',
    isNewConstruction: '新築かどうか',
    hasFreebies: 'フリーレントの有無',
  };

  const optionalFields: (keyof PropertyInfo)[] = [
    'propertyType',
    'area',
    'buildingAge',
    'vacancyPeriod',
    'moveInMonth',
    'isNewConstruction',
    'hasFreebies',
  ];

  const missingFields: string[] = [];
  let filledCount = 0;

  for (const field of optionalFields) {
    const value = info[field];
    if (value !== null && value !== undefined) {
      // vacancyPeriodが'unknown'の場合は未入力扱い
      if (field === 'vacancyPeriod' && value === 'unknown') {
        missingFields.push(fieldLabels[field]);
      } else {
        filledCount++;
      }
    } else {
      missingFields.push(fieldLabels[field]);
    }
  }

  const completeness = Math.round((filledCount / optionalFields.length) * 100);

  return { completeness, missingFields };
}

export function runDiagnosis(info: PropertyInfo): DiagnosisResult {
  // 必須項目のバリデーション
  if (info.rent === null || info.brokerageFee === null) {
    throw new Error('家賃と仲介手数料は必須です');
  }

  // AD可能性計算
  const adResult = calculateAdProbability(info);

  // 節約可能額計算
  const savingsResult = calculateSavings(info.rent, info.brokerageFee);

  // 交渉推奨度
  const negotiationRecommendation = getNegotiationRecommendation(
    adResult.score,
    savingsResult.isOvercharged
  );

  // アドバイス取得
  const tips = getApplicableTips(adResult.probability, savingsResult.isOvercharged);

  // 入力充実度計算
  const { completeness, missingFields } = calculateInputCompleteness(info);

  return {
    adProbability: adResult.probability,
    adProbabilityScore: adResult.score,
    adProbabilityFactors: adResult.factors,
    currentFee: savingsResult.currentFee,
    legalMaxFee: savingsResult.legalMaxFee,
    potentialSavings: savingsResult.potentialSavings,
    isOvercharged: savingsResult.isOvercharged,
    negotiationRecommendation,
    tips,
    inputCompleteness: completeness,
    missingImportantFields: missingFields,
    analyzedAt: new Date().toISOString(),
  };
}
