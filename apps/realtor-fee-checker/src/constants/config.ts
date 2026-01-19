export const config = {
  // LINE公式アカウントURL（後で差し替え）
  lineOfficialUrl: 'https://line.me/R/ti/p/@xxxxx',

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

// エリアオプション（地方ブロック方式）
export const AREA_OPTIONS = [
  { value: 'hokkaido_tohoku', label: '北海道・東北' },
  { value: 'kanto', label: '関東' },
  { value: 'chubu', label: '中部' },
  { value: 'kinki', label: '近畿' },
  { value: 'chugoku_shikoku', label: '中国・四国' },
  { value: 'kyushu_okinawa', label: '九州・沖縄' },
] as const;

// 駅徒歩オプション
export const STATION_DISTANCE_OPTIONS = [
  { value: 'under_5', label: '5分以内' },
  { value: '5_10', label: '6〜10分' },
  { value: '10_15', label: '11〜15分' },
  { value: 'over_15', label: '16分以上' },
] as const;

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

// 築年数オプション
export const BUILDING_AGE_OPTIONS = [
  { value: 0, label: '新築' },
  { value: 3, label: '1〜3年' },
  { value: 5, label: '4〜5年' },
  { value: 10, label: '6〜10年' },
  { value: 15, label: '11〜15年' },
  { value: 20, label: '16〜20年' },
  { value: 25, label: '21〜25年' },
  { value: 30, label: '26〜30年' },
  { value: 35, label: '31年以上' },
] as const;
