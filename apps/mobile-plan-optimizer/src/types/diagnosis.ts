// データ使用量（プラン容量に合わせた選択肢）
export type DataUsage =
  | '1gb'
  | '3gb'
  | '5gb'
  | '10gb'
  | '15gb'
  | '20gb'
  | '30gb'
  | '50gb'
  | 'unlimited';

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

// クレジットカード
export type CreditCard = 'd_card' | 'au_pay' | 'paypay' | 'rakuten';

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
  creditCards: CreditCard[];  // 複数選択可能

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
  dataUsage: '3gb',
  callFrequency: 'rarely',
  currentCarrier: 'unknown',
});

export const createEmptyCommonSettings = (): CommonSettings => ({
  homeInternet: 'none',
  creditCards: [],
  familyMembers: 1,
  priority: 'price',
  supportNeed: 'online_ok',
});
