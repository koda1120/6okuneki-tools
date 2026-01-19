import type { UserUsage } from '../types/diagnosis';
import type { SavingTip } from '../types/result';

/**
 * 節約提案を生成
 */
export function generateSavingsTips(user: UserUsage): SavingTip[] {
  const tips: SavingTip[] = [];

  // データ使用量が多い場合（30GB以上）
  if (user.dataUsage === '30gb' || user.dataUsage === '50gb' || user.dataUsage === 'unlimited') {
    tips.push({
      id: 'heavy_usage',
      title: '大容量・無制限プランがおすすめ',
      description:
        'データ使用量が多い場合、中途半端な容量のプランより大容量・無制限プランの方がコスパが良い場合があります。',
    });
  }

  // データ使用量が少ない場合（3GB以下）
  if (user.dataUsage === '1gb' || user.dataUsage === '3gb') {
    tips.push({
      id: 'light_usage',
      title: '低容量プランで十分かも',
      description:
        'データ使用量が少ない場合、格安SIMの低容量プランがおすすめです。月額1,000円以下でも快適に使えます。',
      estimatedSaving: '月3,000〜5,000円の節約可能性',
    });
  }

  // 通話が多い場合
  if (user.callFrequency === 'long') {
    tips.push({
      id: 'call_option',
      title: 'かけ放題オプションを検討',
      description:
        '長電話が多い場合、かけ放題オプションに加入した方がお得です。診断結果では最適なオプションを提案しています。',
    });
  }

  // 通話が少ない場合
  if (user.callFrequency === 'rarely' || user.callFrequency === 'sometimes') {
    tips.push({
      id: 'line_call',
      title: 'LINE通話を活用しましょう',
      description:
        '通話が少ない場合、LINEやその他の無料通話アプリを活用することで、通話オプションなしでも問題ありません。',
    });
  }

  // 中程度のデータ使用（5〜20GB）
  if (user.dataUsage === '5gb' || user.dataUsage === '10gb' || user.dataUsage === '15gb' || user.dataUsage === '20gb') {
    tips.push({
      id: 'wifi_tip',
      title: 'Wi-Fiを活用しましょう',
      description:
        '自宅や職場でWi-Fiを使うことで、モバイルデータの使用量を抑えられます。より安い低容量プランに乗り換えられる可能性があります。',
      estimatedSaving: '月500〜1,500円の節約可能性',
    });
  }

  // 大手キャリアからの乗り換え
  if (user.currentCarrier === 'docomo' || user.currentCarrier === 'au' || user.currentCarrier === 'softbank') {
    tips.push({
      id: 'carrier_switch',
      title: '格安SIM・サブブランドへの乗り換え',
      description:
        '大手キャリアから格安SIMやサブブランドに乗り換えると、同じ使い方でも大幅に節約できる場合があります。',
      estimatedSaving: '月2,000〜5,000円の節約可能性',
    });
  }

  return tips;
}
