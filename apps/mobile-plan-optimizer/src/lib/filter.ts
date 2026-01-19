import type { Plan } from '../types/plan';
import type { UserUsage, CommonSettings, DataUsage, CallFrequency } from '../types/diagnosis';

/**
 * データ使用量を推定する（GB）
 */
export function estimateDataUsage(user: UserUsage): number {
  const dataUsageMap: Record<DataUsage, number> = {
    '1gb': 1,
    '3gb': 3,
    '5gb': 5,
    '10gb': 10,
    '15gb': 15,
    '20gb': 20,
    '30gb': 30,
    '50gb': 50,
    unlimited: 100,
  };

  return dataUsageMap[user.dataUsage];
}

/**
 * プランをフィルタリングする
 */
export function filterPlans(
  plans: Plan[],
  user: UserUsage,
  common: CommonSettings
): Plan[] {
  const estimatedUsage = estimateDataUsage(user);

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

    return true;
  });
}

/**
 * 推奨通話オプションを判定
 */
export function recommendVoiceOption(
  user: UserUsage
): 'none' | '5min' | 'unlimited' {
  const callMap: Record<CallFrequency, 'none' | '5min' | 'unlimited'> = {
    rarely: 'none',
    sometimes: 'none',
    often: '5min',
    long: 'unlimited',
  };

  return callMap[user.callFrequency];
}
