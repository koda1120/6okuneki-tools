import type { AdProbability, SimpleTip } from '../types';

interface TipCondition {
  adProbability?: AdProbability[];
  isOvercharged?: boolean;
}

interface TipData {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  conditions: TipCondition;
}

export const tipsData: TipData[] = [
  {
    id: 'ad_exists',
    title: 'AD（広告料）が付いている可能性があります',
    description: 'ADが付いている物件なら、仲介手数料を下げてもらえる可能性があります。',
    priority: 'high',
    conditions: { adProbability: ['very_high', 'high'] }
  },
  {
    id: 'ad_maybe',
    title: 'ADが付いているかもしれません',
    description: '条件によってはADが付いている可能性があります。確認してみる価値はあります。',
    priority: 'medium',
    conditions: { adProbability: ['medium'] }
  },
  {
    id: 'overcharge_warning',
    title: '【注意】法定上限を超えている可能性',
    description: '仲介手数料の上限は家賃の1.1ヶ月分（税込）です。この金額は上限を超えているかもしれません。',
    priority: 'high',
    conditions: { isOvercharged: true }
  }
];

export function getApplicableTips(
  adProbability: AdProbability,
  isOvercharged: boolean
): SimpleTip[] {
  return tipsData
    .filter(tip => {
      const { conditions } = tip;

      // AD可能性条件チェック
      if (conditions.adProbability && !conditions.adProbability.includes(adProbability)) {
        return false;
      }

      // 過請求条件チェック
      if (conditions.isOvercharged !== undefined && conditions.isOvercharged !== isOvercharged) {
        return false;
      }

      return true;
    })
    .map(tip => ({
      id: tip.id,
      title: tip.title,
      description: tip.description,
      priority: tip.priority,
    }));
}
