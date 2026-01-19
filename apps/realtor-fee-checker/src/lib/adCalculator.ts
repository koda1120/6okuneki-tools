import type { PropertyInfo, AdProbability, ScoreFactor } from '../types';

interface AdProbabilityResult {
  score: number;
  probability: AdProbability;
  factors: ScoreFactor[];
}

export function calculateAdProbability(info: PropertyInfo): AdProbabilityResult {
  const factors: ScoreFactor[] = [];
  let baseScore = 50; // 基準スコア

  // 築年数（1年単位）
  if (info.buildingAge !== null) {
    let score = 0;
    const age = info.buildingAge;
    let description = '';

    if (age === 0) {
      score = -15;
      description = '新築物件はADが付きにくいです';
    } else if (age <= 3) {
      score = -10;
      description = `築${age}年は築浅で、ADが付きにくい傾向があります`;
    } else if (age <= 5) {
      score = -5;
      description = `築${age}年はまだ築浅で、ADが付きにくい傾向があります`;
    } else if (age <= 10) {
      score = 5;
      description = `築${age}年でADが付いている可能性があります`;
    } else if (age <= 20) {
      score = 10;
      description = `築${age}年でADが付いている可能性が高いです`;
    } else if (age <= 30) {
      score = 15;
      description = `築${age}年以上の物件はAD付きの可能性がかなり高いです`;
    } else {
      score = 20;
      description = '築30年以上の物件はAD付きの可能性が非常に高いです';
    }

    if (score !== 0) {
      factors.push({
        name: '築年数',
        score,
        impact: score > 0 ? 'positive' : 'negative',
        description
      });
    }
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

  // エリア（47都道府県）
  if (info.area !== null) {
    // 都市部: 0, 準都市部: 5, 地方: 10
    const areaScores: Record<string, number> = {
      // 北海道・東北（地方）
      'hokkaido': 5, 'aomori': 10, 'iwate': 10, 'miyagi': 5, 'akita': 10, 'yamagata': 10, 'fukushima': 10,
      // 関東
      'ibaraki': 10, 'tochigi': 10, 'gunma': 10, 'saitama': 5, 'chiba': 5, 'tokyo': -5, 'kanagawa': 0,
      // 中部
      'niigata': 10, 'toyama': 10, 'ishikawa': 10, 'fukui': 10, 'yamanashi': 10, 'nagano': 10,
      'gifu': 10, 'shizuoka': 5, 'aichi': 0,
      // 近畿
      'mie': 10, 'shiga': 10, 'kyoto': 0, 'osaka': -5, 'hyogo': 5, 'nara': 10, 'wakayama': 10,
      // 中国
      'tottori': 10, 'shimane': 10, 'okayama': 10, 'hiroshima': 5, 'yamaguchi': 10,
      // 四国
      'tokushima': 10, 'kagawa': 10, 'ehime': 10, 'kochi': 10,
      // 九州・沖縄
      'fukuoka': 0, 'saga': 10, 'nagasaki': 10, 'kumamoto': 10, 'oita': 10, 'miyazaki': 10, 'kagoshima': 10, 'okinawa': 5,
    };
    const score = areaScores[info.area] ?? 5;
    if (score !== 0) {
      factors.push({
        name: 'エリア',
        score,
        impact: score > 0 ? 'positive' : 'negative',
        description: score > 0
          ? 'このエリアはADが付きやすい傾向があります'
          : '都市部は需要が高く、ADが付きにくい傾向があります'
      });
    }
  }

  // 駅徒歩（1分単位）
  if (info.stationDistance !== null) {
    let score = 0;
    const distance = info.stationDistance;

    if (distance <= 3) {
      score = -15;  // 3分以内（超人気）
    } else if (distance <= 5) {
      score = -10;  // 4〜5分（人気）
    } else if (distance <= 7) {
      score = -5;   // 6〜7分（やや人気）
    } else if (distance <= 10) {
      score = 0;    // 8〜10分（標準）
    } else if (distance <= 15) {
      score = 10;   // 11〜15分（やや遠い）
    } else {
      score = 15;   // 16分以上（遠い）
    }

    if (score !== 0) {
      factors.push({
        name: '駅徒歩',
        score,
        impact: score > 0 ? 'positive' : 'negative',
        description: score > 0
          ? `駅から${distance}分は遠めで、ADが付きやすい傾向があります`
          : `駅から${distance}分は近く、人気が高いためADが付きにくい傾向があります`
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

// 診断理由の詳細説明を生成
export function generateExplanation(
  probability: AdProbability,
  factors: ScoreFactor[]
): string {
  const positiveFactors = factors.filter(f => f.impact === 'positive');
  const negativeFactors = factors.filter(f => f.impact === 'negative');

  // 要因の文章パーツを生成
  const buildFactorSentences = (fs: ScoreFactor[]): string[] => {
    return fs.map(f => {
      switch (f.name) {
        case '築年数':
          if (f.score >= 15) return '築年数が経過した物件';
          if (f.score >= 5) return '築10年以上の物件';
          if (f.score <= -10) return '新築・築浅物件';
          return '築浅の物件';
        case '駅徒歩':
          if (f.score >= 10) return '駅から遠い立地';
          if (f.score <= -10) return '駅近の好立地';
          return '駅からやや近い立地';
        case 'エリア':
          if (f.score >= 10) return '地方エリア';
          if (f.score >= 5) return '郊外エリア';
          return '都市部';
        case '空室期間':
          if (f.score >= 15) return '空室期間が長い';
          if (f.score >= 5) return '空室期間がやや長め';
          return '空室期間が短い';
        case '入居時期':
          if (f.score > 0) return '閑散期（4〜12月）の入居';
          return '繁忙期（1〜3月）の入居';
        case '物件種別':
          if (f.score >= 15) return '戸建て物件';
          if (f.score >= 10) return 'アパート物件';
          return '';
        case 'フリーレント・割引あり':
          return 'フリーレント・家賃割引の提示あり';
        default:
          return '';
      }
    }).filter(s => s !== '');
  };

  const positiveSentences = buildFactorSentences(positiveFactors);
  const negativeSentences = buildFactorSentences(negativeFactors);

  // 確率レベルに応じた導入文
  let intro = '';
  let conclusion = '';

  switch (probability) {
    case 'very_high':
      intro = 'この物件は複数の条件から、ADが付いている可能性が非常に高いと判断しました。';
      conclusion = 'このような物件では、大家さんが不動産会社に広告料（AD）を支払って募集を強化していることがほぼ確実と考えられます。仲介手数料の値下げ交渉を強くおすすめします。';
      break;
    case 'high':
      intro = 'この物件の条件から、ADが付いている可能性が高いと判断しました。';
      conclusion = 'このような物件では、大家さんが不動産会社に広告料（AD）を支払っているケースが多いです。仲介手数料について相談してみる価値があります。';
      break;
    case 'medium':
      intro = 'この物件の条件から、ADが付いている可能性があります。';
      conclusion = 'ADの有無は物件によりますが、交渉次第で仲介手数料が下がる可能性があります。';
      break;
    case 'low':
      intro = 'この物件の条件から、ADが付いている可能性は低めです。';
      conclusion = '人気の条件が揃っているため、ADなしでも入居者が集まりやすい物件です。ただし、交渉自体は可能なので、ダメ元で相談してみても良いでしょう。';
      break;
    case 'very_low':
      intro = 'この物件の条件から、ADが付いている可能性は低いと考えられます。';
      conclusion = '非常に人気の高い条件の物件のため、ADを設定しなくてもすぐに入居者が決まるタイプです。仲介手数料の交渉は難しいかもしれません。';
      break;
  }

  // 中間の説明文を生成
  let middle = '';

  if (positiveSentences.length > 0 && negativeSentences.length > 0) {
    // 両方ある場合
    middle = `「${positiveSentences.join('」「')}」という条件はADが付きやすい要因ですが、「${negativeSentences.join('」「')}」という条件はADが付きにくい要因です。`;
  } else if (positiveSentences.length > 0) {
    // ADが付きやすい要因のみ
    if (positiveSentences.length === 1) {
      middle = `「${positiveSentences[0]}」という条件から、入居者が集まりにくい傾向があります。`;
    } else {
      middle = `「${positiveSentences.join('」「')}」という条件から、一般的に入居者が集まりにくい傾向があります。`;
    }
  } else if (negativeSentences.length > 0) {
    // ADが付きにくい要因のみ
    if (negativeSentences.length === 1) {
      middle = `「${negativeSentences[0]}」という条件は非常に人気が高いです。`;
    } else {
      middle = `「${negativeSentences.join('」「')}」という条件は非常に人気が高いです。`;
    }
  }

  // 文章を組み立て
  if (middle) {
    return `${intro}\n\n${middle}\n\n${conclusion}`;
  }
  return `${intro}\n\n${conclusion}`;
}
