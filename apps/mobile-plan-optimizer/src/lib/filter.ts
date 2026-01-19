import type { Plan } from '../types/plan';
import type { PersonDiagnosis, CommonSettings, DataUsage } from '../types/diagnosis';

/**
 * データ使用量を推定する（GB）
 */
export function estimateDataUsage(person: PersonDiagnosis): number {
  // 直接入力されている場合
  const dataUsageMap: Record<DataUsage, number> = {
    under_1gb: 0.5,
    '1_3gb': 2,
    '3_10gb': 6,
    '10_20gb': 15,
    '20_50gb': 35,
    over_50gb: 70,
    unlimited: 100,
    unknown: 0,
  };

  if (person.dataUsage !== 'unknown') {
    return dataUsageMap[person.dataUsage];
  }

  // 利用状況から推定
  let estimated = 0;

  // 自宅でのWi-Fi利用を考慮
  const wifiReduction =
    person.hasWifi === 'yes' && person.wifiConnection !== 'never'
      ? person.wifiConnection === 'always'
        ? 0.3
        : person.wifiConnection === 'mostly'
          ? 0.5
          : 0.8
      : 1;

  // 主な利用場所
  const locationMultiplier =
    person.mainUsageLocation === 'home'
      ? 0.5
      : person.mainUsageLocation === 'outside'
        ? 1.5
        : 1;

  // 外出先での利用
  person.outsideActivities.forEach((activity) => {
    switch (activity) {
      case 'video':
        estimated += 15;
        break;
      case 'sns':
        estimated += 3;
        break;
      case 'music':
        estimated += 2;
        break;
      case 'game':
        estimated += 5;
        break;
      case 'work':
        estimated += 5;
        break;
      case 'rarely':
        estimated += 0.5;
        break;
    }
  });

  // デフォルト（活動が選択されていない場合）
  if (estimated === 0) {
    estimated = 5;
  }

  return Math.round(estimated * wifiReduction * locationMultiplier);
}

/**
 * プランをフィルタリングする
 */
export function filterPlans(
  plans: Plan[],
  person: PersonDiagnosis,
  common: CommonSettings
): Plan[] {
  const estimatedUsage = estimateDataUsage(person);

  return plans.filter((plan) => {
    // 1. データ量チェック
    if (plan.dataCapacityGb !== null && plan.dataCapacityGb < estimatedUsage * 0.8) {
      // 段階制の場合は最大容量で判定
      if (plan.dataCapacityType !== 'tiered') {
        return false;
      }
    }

    // 2. サポート条件チェック
    if (common.supportNeed === 'shop_required' && !plan.shopSupport.available) {
      return false;
    }

    // 3. 海外利用チェック
    if (common.overseasUsage !== 'rarely' && !plan.overseasRoaming) {
      return false;
    }

    // 4. テザリングチェック
    if (common.tetheringUsage !== 'never' && !plan.tetheringAvailable) {
      return false;
    }

    return true;
  });
}

/**
 * 推奨通話オプションを判定
 */
export function recommendVoiceOption(
  person: PersonDiagnosis
): 'none' | '5min' | 'unlimited' {
  const monthlyMinutes = estimateMonthlyCallMinutes(person);

  if (monthlyMinutes < 15) {
    return 'none';
  } else if (monthlyMinutes < 45) {
    return '5min';
  } else {
    return 'unlimited';
  }
}

/**
 * 月間通話時間を推定（分）
 */
export function estimateMonthlyCallMinutes(person: PersonDiagnosis): number {
  // 通話頻度を月間回数に変換
  const frequencyMap: Record<string, number> = {
    rarely: 3,
    sometimes: 6,
    often: 15,
    daily: 30,
    unknown: 5,
  };

  // 1回の通話時間（分）
  const durationMap: Record<string, number> = {
    under_1min: 0.5,
    '1_5min': 3,
    '5_10min': 7,
    over_10min: 15,
    unknown: 3,
  };

  const callsPerMonth = frequencyMap[person.callFrequency] || 5;
  const minutesPerCall = durationMap[person.callDuration] || 3;

  // LINE通話で代替可能な場合は減少
  const lineReduction = person.lineCallOk === 'yes' ? 0.3 : 1;

  return Math.round(callsPerMonth * minutesPerCall * lineReduction);
}
