import type { PersonDiagnosis } from '../types/diagnosis';
import type { SavingTip } from '../types/result';

/**
 * 節約提案を生成
 */
export function generateSavingsTips(person: PersonDiagnosis): SavingTip[] {
  const tips: SavingTip[] = [];

  // Wi-Fiあるけど使っていない
  if (person.hasWifi === 'unused') {
    tips.push({
      id: 'wifi_unused',
      title: 'Wi-Fiを活用しましょう',
      description:
        '自宅にWi-Fiがあるのに使っていないとのこと。自宅ではWi-Fiに接続することで、モバイルデータの使用量を大幅に削減できます。',
      estimatedSaving: '月1,000〜3,000円の節約可能性',
    });
  }

  // Wi-Fiあるが接続頻度が低い
  if (
    person.hasWifi === 'yes' &&
    (person.wifiConnection === 'rarely' || person.wifiConnection === 'never')
  ) {
    tips.push({
      id: 'wifi_connection',
      title: 'Wi-Fi接続を増やしましょう',
      description:
        '自宅にいる時はWi-Fiに自動接続する設定にしておくと、データ使用量を抑えられます。iPhoneの場合は設定からWi-Fiを常にオンにしましょう。',
      estimatedSaving: '月500〜1,500円の節約可能性',
    });
  }

  // 自宅で動画視聴が多い
  if (
    person.homeActivities.includes('video') &&
    person.hasWifi === 'yes' &&
    person.wifiConnection !== 'always'
  ) {
    tips.push({
      id: 'video_at_home',
      title: '動画はWi-Fi環境で視聴',
      description:
        '動画視聴はデータ消費が大きいです。自宅で見る動画はWi-Fiに接続してから視聴しましょう。事前にダウンロードしておくのも効果的です。',
      estimatedSaving: '月1,000〜2,000円の節約可能性',
    });
  }

  // 外出先で動画視聴
  if (person.outsideActivities.includes('video')) {
    tips.push({
      id: 'video_outside',
      title: '外出先での動画視聴を控える',
      description:
        '外出先での動画視聴は大量のデータを消費します。事前にWi-Fi環境でダウンロードしておくか、音楽などに切り替えることで節約できます。',
      estimatedSaving: '月1,500〜3,000円の節約可能性',
    });
  }

  // LINE通話で代替可能
  if (
    person.lineCallOk === 'unknown' &&
    (person.callFrequency === 'often' || person.callFrequency === 'daily')
  ) {
    tips.push({
      id: 'line_call',
      title: 'LINE通話を活用しましょう',
      description:
        '相手がLINEを使っている場合、LINE通話を使えば通話料が無料になります。特に家族や友人との通話はLINEへ切り替えを検討してみてください。',
      estimatedSaving: '月500〜1,000円の節約可能性',
    });
  }

  // 通話が多いがかけ放題未使用の可能性
  if (
    (person.callFrequency === 'often' || person.callFrequency === 'daily') &&
    (person.callDuration === '5_10min' || person.callDuration === 'over_10min')
  ) {
    tips.push({
      id: 'call_option',
      title: 'かけ放題オプションを検討',
      description:
        '通話頻度が高い場合、かけ放題オプションに加入した方がお得な場合があります。診断結果では最適なオプションを提案しています。',
    });
  }

  // データ使用量が多い
  if (
    person.dataUsage === 'over_50gb' ||
    person.dataUsage === 'unlimited'
  ) {
    tips.push({
      id: 'heavy_usage',
      title: '大容量・無制限プランを検討',
      description:
        'データ使用量が多い場合、中途半端な容量のプランより大容量・無制限プランの方がコスパが良い場合があります。',
    });
  }

  // データ使用量が少ない
  if (person.dataUsage === 'under_1gb' || person.dataUsage === '1_3gb') {
    tips.push({
      id: 'light_usage',
      title: '低容量プランで十分かも',
      description:
        'データ使用量が少ない場合、格安SIMの低容量プランがおすすめです。月額1,000円以下でも快適に使えます。',
      estimatedSaving: '月3,000〜5,000円の節約可能性',
    });
  }

  return tips;
}

/**
 * 全員分の節約提案をマージ
 */
export function mergeAllTips(persons: PersonDiagnosis[]): SavingTip[] {
  const allTips = persons.flatMap((person) => generateSavingsTips(person));

  // 重複を除去
  const uniqueTips = new Map<string, SavingTip>();
  allTips.forEach((tip) => {
    if (!uniqueTips.has(tip.id)) {
      uniqueTips.set(tip.id, tip);
    }
  });

  return Array.from(uniqueTips.values());
}
