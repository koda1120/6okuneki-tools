import type { PropertyInfo, AdProbability, ScoreFactor } from '../types';

interface AdProbabilityResult {
  score: number;
  probability: AdProbability;
  factors: ScoreFactor[];
}

export function calculateAdProbability(info: PropertyInfo): AdProbabilityResult {
  const factors: ScoreFactor[] = [];
  let baseScore = 50; // 基準スコア

  // 築年数
  if (info.buildingAge !== null) {
    if (info.buildingAge >= 20) {
      factors.push({
        name: '築年数',
        score: 20,
        impact: 'positive',
        description: '築20年以上の物件はAD付きの可能性が高いです'
      });
    } else if (info.buildingAge >= 10) {
      factors.push({
        name: '築年数',
        score: 10,
        impact: 'positive',
        description: '築10年以上でADが付いている可能性があります'
      });
    } else if (info.buildingAge < 5 && info.buildingAge > 0) {
      factors.push({
        name: '築年数',
        score: -10,
        impact: 'negative',
        description: '築浅物件はADが付きにくい傾向があります'
      });
    }
  }

  // 新築フラグ
  if (info.isNewConstruction === true) {
    factors.push({
      name: '新築',
      score: -15,
      impact: 'negative',
      description: '新築物件はADが付きにくいです'
    });
  }

  // 空室期間
  if (info.vacancyPeriod !== null && info.vacancyPeriod !== 'unknown') {
    const vacancyScores: Record<string, number> = {
      'under_1month': -5,
      '1_2months': 5,
      '2_3months': 15,
      'over_3months': 20,
    };
    const score = vacancyScores[info.vacancyPeriod] ?? 0;
    if (score !== 0) {
      factors.push({
        name: '空室期間',
        score,
        impact: score > 0 ? 'positive' : 'negative',
        description: score > 0
          ? '空室期間が長いほどADが付いている可能性が高いです'
          : '空室期間が短い物件は人気があり、ADが付きにくい傾向があります'
      });
    }
  }

  // 入居時期
  if (info.moveInMonth !== null) {
    const isPeakSeason = [1, 2, 3].includes(info.moveInMonth);
    if (isPeakSeason) {
      factors.push({
        name: '入居時期',
        score: -10,
        impact: 'negative',
        description: '1〜3月は繁忙期のため、交渉が難しい時期です'
      });
    } else {
      factors.push({
        name: '入居時期',
        score: 10,
        impact: 'positive',
        description: '閑散期（4〜12月）はADが付きやすく、交渉もしやすい時期です'
      });
    }
  }

  // エリア
  if (info.area !== null) {
    const areaScores: Record<string, number> = {
      'tokyo_23': -5,
      'tokyo_other': 5,
      'kanagawa': 5,
      'saitama': 10,
      'chiba': 10,
      'osaka': 0,
      'nagoya': 5,
      'fukuoka': 5,
      'other': 10,
    };
    const score = areaScores[info.area] ?? 0;
    if (score !== 0) {
      factors.push({
        name: 'エリア',
        score,
        impact: score > 0 ? 'positive' : 'negative',
        description: score > 0
          ? 'このエリアはADが付きやすい傾向があります'
          : '人気エリアはADが付きにくい傾向がありますが、物件によります'
      });
    }
  }

  // 物件種別
  if (info.propertyType !== null) {
    const typeScores: Record<string, number> = {
      'mansion': 0,
      'apartment': 10,
      'detached': 15,
      'other': 5
    };
    const score = typeScores[info.propertyType] ?? 0;
    if (score !== 0) {
      factors.push({
        name: '物件種別',
        score,
        impact: 'positive',
        description: 'この物件種別はADが付きやすい傾向があります'
      });
    }
  }

  // フリーレント
  if (info.hasFreebies === true) {
    factors.push({
      name: 'フリーレント・割引あり',
      score: 15,
      impact: 'positive',
      description: 'フリーレントや家賃割引の提示がある場合、ADが付いている可能性が非常に高いです'
    });
  }

  // スコア計算
  const totalScore = factors.reduce((sum, f) => sum + f.score, baseScore);
  const clampedScore = Math.max(0, Math.min(100, totalScore));

  // 確率判定
  let probability: AdProbability;
  if (clampedScore >= 80) probability = 'very_high';
  else if (clampedScore >= 60) probability = 'high';
  else if (clampedScore >= 40) probability = 'medium';
  else if (clampedScore >= 20) probability = 'low';
  else probability = 'very_low';

  return { score: clampedScore, probability, factors };
}

export function getProbabilityLabel(probability: AdProbability): string {
  const labels: Record<AdProbability, string> = {
    'very_high': '非常に高い',
    'high': '高い',
    'medium': '中程度',
    'low': '低い',
    'very_low': '低い',
  };
  return labels[probability];
}

export function getProbabilityDescription(probability: AdProbability): string {
  const descriptions: Record<AdProbability, string> = {
    'very_high': 'AD（広告料）が付いている可能性が非常に高いです',
    'high': 'AD（広告料）が付いている可能性が高いです',
    'medium': 'AD（広告料）が付いている可能性があります',
    'low': 'AD（広告料）が付いている可能性は低めです',
    'very_low': 'AD（広告料）が付いている可能性は低いです',
  };
  return descriptions[probability];
}
