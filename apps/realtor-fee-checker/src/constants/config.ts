export const config = {
  // LINE公式アカウントURL
  lineOfficialUrl: 'https://lin.ee/bJiU5bq',

  // 法定上限
  legalMaxRate: 1.1,  // 家賃の1.1ヶ月分（税込）

  // 繁忙期（交渉が難しい時期）
  peakSeasonMonths: [1, 2, 3],

  // siteName（GAS送信用）
  siteName: '不動産仲介手数料適性チェック',

  // localStorageキー
  localStorageKey: '6okuniki_realtor_registered',
} as const;

// 物件種別オプション
export const PROPERTY_TYPE_OPTIONS = [
  { value: 'mansion', label: 'マンション' },
  { value: 'apartment', label: 'アパート' },
  { value: 'detached', label: '戸建て' },
  { value: 'other', label: 'その他' },
] as const;

// エリアオプション（47都道府県）
export const AREA_OPTIONS = [
  // 北海道・東北
  { value: 'hokkaido', label: '北海道' },
  { value: 'aomori', label: '青森県' },
  { value: 'iwate', label: '岩手県' },
  { value: 'miyagi', label: '宮城県' },
  { value: 'akita', label: '秋田県' },
  { value: 'yamagata', label: '山形県' },
  { value: 'fukushima', label: '福島県' },
  // 関東
  { value: 'ibaraki', label: '茨城県' },
  { value: 'tochigi', label: '栃木県' },
  { value: 'gunma', label: '群馬県' },
  { value: 'saitama', label: '埼玉県' },
  { value: 'chiba', label: '千葉県' },
  { value: 'tokyo', label: '東京都' },
  { value: 'kanagawa', label: '神奈川県' },
  // 中部
  { value: 'niigata', label: '新潟県' },
  { value: 'toyama', label: '富山県' },
  { value: 'ishikawa', label: '石川県' },
  { value: 'fukui', label: '福井県' },
  { value: 'yamanashi', label: '山梨県' },
  { value: 'nagano', label: '長野県' },
  { value: 'gifu', label: '岐阜県' },
  { value: 'shizuoka', label: '静岡県' },
  { value: 'aichi', label: '愛知県' },
  // 近畿
  { value: 'mie', label: '三重県' },
  { value: 'shiga', label: '滋賀県' },
  { value: 'kyoto', label: '京都府' },
  { value: 'osaka', label: '大阪府' },
  { value: 'hyogo', label: '兵庫県' },
  { value: 'nara', label: '奈良県' },
  { value: 'wakayama', label: '和歌山県' },
  // 中国
  { value: 'tottori', label: '鳥取県' },
  { value: 'shimane', label: '島根県' },
  { value: 'okayama', label: '岡山県' },
  { value: 'hiroshima', label: '広島県' },
  { value: 'yamaguchi', label: '山口県' },
  // 四国
  { value: 'tokushima', label: '徳島県' },
  { value: 'kagawa', label: '香川県' },
  { value: 'ehime', label: '愛媛県' },
  { value: 'kochi', label: '高知県' },
  // 九州・沖縄
  { value: 'fukuoka', label: '福岡県' },
  { value: 'saga', label: '佐賀県' },
  { value: 'nagasaki', label: '長崎県' },
  { value: 'kumamoto', label: '熊本県' },
  { value: 'oita', label: '大分県' },
  { value: 'miyazaki', label: '宮崎県' },
  { value: 'kagoshima', label: '鹿児島県' },
  { value: 'okinawa', label: '沖縄県' },
] as const;

// 駅徒歩オプション（1分単位）
export const STATION_DISTANCE_OPTIONS = [
  ...Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}分`,
  })),
  { value: 21, label: '20分以上' },
];

// 空室期間オプション
export const VACANCY_PERIOD_OPTIONS = [
  { value: 'unknown', label: 'わからない' },
  { value: 'under_1month', label: '1ヶ月未満' },
  { value: '1_2months', label: '1〜2ヶ月' },
  { value: '2_3months', label: '2〜3ヶ月' },
  { value: 'over_3months', label: '3ヶ月以上' },
] as const;

// 入居月オプション
export const MOVE_IN_MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}月`,
}));

// 築年数オプション（1年単位）
export const BUILDING_AGE_OPTIONS = [
  { value: 0, label: '新築' },
  ...Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}年`,
  })),
  { value: 31, label: '30年以上' },
];
