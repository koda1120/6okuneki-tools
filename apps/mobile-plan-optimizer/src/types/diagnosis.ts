// データ使用量
export type DataUsage =
  | 'under_1gb'      // 1GB未満
  | '1_3gb'          // 1〜3GB
  | '3_10gb'         // 3〜10GB
  | '10_20gb'        // 10〜20GB
  | '20_50gb'        // 20〜50GB
  | 'over_50gb'      // 50GB以上
  | 'unlimited';     // 無制限がいい

// 通話頻度
export type CallFrequency =
  | 'rarely'         // ほぼしない
  | 'sometimes'      // たまに（短い通話）
  | 'often'          // よくする（5分以内が多い）
  | 'long';          // 長電話が多い（かけ放題希望）

// 現在のキャリア
export type CurrentCarrier =
  | 'docomo' | 'au' | 'softbank' | 'rakuten'
  | 'ymobile' | 'uq' | 'mvno' | 'unknown';

// 重視ポイント
export type Priority =
  | 'price'          // 料金の安さ
  | 'quality'        // 通信速度・品質
  | 'support'        // サポート体制
  | 'balance';       // バランス重視

// サポート必要度
export type SupportNeed =
  | 'shop_required'     // 店舗サポート必須
  | 'shop_preferred'    // あると安心
  | 'online_ok';        // オンラインでOK

// ユーザーの利用状況
export interface UserUsage {
  dataUsage: DataUsage;
  callFrequency: CallFrequency;
  currentCarrier: CurrentCarrier;
  currentMonthlyFee?: number;  // 現在の月額料金（任意）
}

// 共通設定（割引条件等）
export interface CommonSettings {
  // 割引条件
  homeInternet: 'docomo_hikari' | 'au_hikari' | 'softbank_hikari' | 'nuro' | 'other' | 'none';
  creditCard: 'd_card' | 'au_pay' | 'paypay' | 'rakuten' | 'other' | 'none';

  // 家族割引用（同一キャリアで契約する家族の人数、本人含む）
  familyMembers: 1 | 2 | 3 | 4 | 5;

  // 希望条件
  priority: Priority;
  supportNeed: SupportNeed;
}

// 診断入力
export interface DiagnosisInput {
  user: UserUsage;
  common: CommonSettings;
}

// 初期値
export const createEmptyUserUsage = (): UserUsage => ({
  dataUsage: 'under_1gb',
  callFrequency: 'rarely',
  currentCarrier: 'unknown',
});

export const createEmptyCommonSettings = (): CommonSettings => ({
  homeInternet: 'none',
  creditCard: 'none',
  familyMembers: 1,
  priority: 'price',
  supportNeed: 'online_ok',
});
