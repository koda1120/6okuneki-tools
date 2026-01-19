// 続柄
export type Relationship =
  | 'spouse'           // 配偶者
  | 'child'            // 子供
  | 'parent'           // 親
  | 'grandparent'      // 祖父母
  | 'sibling'          // 兄弟姉妹
  | 'partner'          // 同性パートナー・事実婚
  | 'other_relative'   // その他の親族
  | 'roommate';        // 同居人（親族ではない）

// データ使用量
export type DataUsage =
  | 'under_1gb'      // 1GB未満
  | '1_3gb'          // 1〜3GB
  | '3_10gb'         // 3〜10GB
  | '10_20gb'        // 10〜20GB
  | '20_50gb'        // 20〜50GB
  | 'over_50gb'      // 50GB以上
  | 'unlimited'      // 無制限
  | 'unknown';       // わからない

// 通話時間
export type CallDuration =
  | 'under_1min'     // 1分未満
  | '1_5min'         // 1〜5分
  | '5_10min'        // 5〜10分
  | 'over_10min'     // 10分以上
  | 'unknown';       // わからない

// 通話頻度
export type CallFrequency =
  | 'rarely'         // ほぼしない（月2〜3回以下）
  | 'sometimes'      // たまに（週1〜2回）
  | 'often'          // よく（週3回以上）
  | 'daily'          // 毎日
  | 'unknown';       // わからない

// 現在のキャリア
export type CurrentCarrier =
  | 'docomo' | 'au' | 'softbank' | 'rakuten'
  | 'mvno' | 'none' | 'unknown';

// 重視ポイント
export type Priority =
  | 'price'          // 料金の安さ
  | 'quality'        // 通信速度・品質
  | 'support'        // サポート体制
  | 'data'           // データ量
  | 'points';        // 特典・ポイント

// サポート必要度
export type SupportNeed =
  | 'shop_required'     // 店舗で対面サポート必須
  | 'shop_preferred'    // 店舗があると安心
  | 'phone_ok'          // 電話サポートがあればOK
  | 'chat_ok'           // チャットやWebで解決できればOK
  | 'none';             // サポート不要

// 1人分の診断データ
export interface PersonDiagnosis {
  // 基本情報（2人目以降のみ）
  relationship?: Relationship;
  livingTogether?: boolean;
  sameFamilyName?: 'same' | 'different' | 'unknown';

  // データ通信
  dataUsage: DataUsage;
  hasWifi: 'yes' | 'no' | 'unused';
  wifiConnection?: 'always' | 'mostly' | 'rarely' | 'never' | 'unknown';
  mainUsageLocation: 'home' | 'half' | 'outside' | 'unknown';
  homeActivities: ('video' | 'sns' | 'game' | 'browse' | 'rarely' | 'unknown')[];
  outsideActivities: ('sns' | 'video' | 'music' | 'game' | 'work' | 'rarely' | 'unknown')[];

  // 通話
  callDuration: CallDuration;
  callFrequency: CallFrequency;
  callTarget: 'family' | 'work' | 'friends' | 'landline' | 'unknown';
  lineCallOk: 'yes' | 'no' | 'unknown';

  // 現在の契約
  currentCarrier: CurrentCarrier;
  currentMonthlyFee: string;  // '1000-2000' のような形式
}

// 共通設定
export interface CommonSettings {
  // 割引条件
  homeInternet: 'docomo_hikari' | 'au_hikari' | 'softbank_hikari' | 'rakuten_hikari' | 'nuro' | 'other' | 'none' | 'unknown';
  creditCard: 'd_card' | 'au_pay' | 'paypay' | 'rakuten' | 'other' | 'none';

  // 重視ポイント
  priority: Priority;
  overseasUsage: 'often' | 'sometimes' | 'rarely';
  tetheringUsage: 'often' | 'sometimes' | 'never';
  familyCarrierPreference: 'same' | 'separate' | 'both';

  // サポート
  supportNeed: SupportNeed;
  concerns: ('sim_setup' | 'data_transfer' | 'contacts' | 'mnp' | 'none')[];

  // 端末
  deviceType: 'iphone' | 'android' | 'other';
  devicePurchase: 'keep' | 'new';
  has5gDevice: 'yes' | 'no' | 'unknown';
}

// 診断全体
export interface DiagnosisInput {
  personCount: number;  // 1〜10
  persons: PersonDiagnosis[];
  common: CommonSettings;
}

// 初期値
export const createEmptyPersonDiagnosis = (): PersonDiagnosis => ({
  dataUsage: 'unknown',
  hasWifi: 'yes',
  mainUsageLocation: 'unknown',
  homeActivities: [],
  outsideActivities: [],
  callDuration: 'unknown',
  callFrequency: 'unknown',
  callTarget: 'unknown',
  lineCallOk: 'unknown',
  currentCarrier: 'unknown',
  currentMonthlyFee: '',
});

export const createEmptyCommonSettings = (): CommonSettings => ({
  homeInternet: 'unknown',
  creditCard: 'none',
  priority: 'price',
  overseasUsage: 'rarely',
  tetheringUsage: 'never',
  familyCarrierPreference: 'both',
  supportNeed: 'chat_ok',
  concerns: [],
  deviceType: 'iphone',
  devicePurchase: 'keep',
  has5gDevice: 'unknown',
});
