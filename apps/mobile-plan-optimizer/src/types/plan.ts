// キャリアカテゴリ
export type CarrierCategory =
  | 'mno'           // 大手キャリア
  | 'sub_brand'     // サブブランド
  | 'online'        // オンライン専用
  | 'mvno';         // 格安SIM

// 回線種別
export type NetworkType = 'docomo' | 'au' | 'softbank' | 'rakuten';

// データ容量タイプ
export type DataCapacityType =
  | 'fixed'                    // 固定容量
  | 'tiered'                   // 段階制
  | 'unlimited'                // 使い放題（高速）
  | 'unlimited_speed_limited'; // 使い放題（速度制限あり）

// 通話オプション
export interface VoiceOption {
  id: string;
  name: string;
  price: number;
  freeMinutes?: number;
  unlimited?: boolean;
}

// 家族割引
export interface FamilyDiscount {
  available: boolean;
  discountPerLine?: number;
  maxLines?: number;
}

// 光回線割引
export interface HomeInternetDiscount {
  available: boolean;
  targetServices?: string[];
  discountAmount?: number;
}

// カード割引
export interface CardDiscount {
  available: boolean;
  targetCards?: string[];
  discountAmount?: number;
}

// 店舗サポート
export interface ShopSupport {
  available: boolean;
  shopCount?: number;
}

// リモートサポート
export interface RemoteSupport {
  phone?: { available: boolean };
  chat?: { available: boolean };
}

// MNP転出
export interface MnpOut {
  instant: boolean;
  methods: string[];
}

// プラン情報（メイン）
export interface Plan {
  id: string;
  carrierId: string;
  name: string;

  // 料金
  dataCapacityGb: number | null;  // nullは無制限
  dataCapacityType: DataCapacityType;
  monthlyPrice: number;
  priceTiers?: { upToGb: number; price: number }[];

  // 通話
  voiceBaseRate: number;          // 30秒あたり
  voiceFreeMinutes: number;
  voiceOptions: VoiceOption[];

  // ネットワーク
  networkType: NetworkType;
  has5g: boolean;
  maxSpeed?: number | null;      // 常時の最大速度（Mbps）、nullまたは未定義は制限なし
  speedLimitAfterCap?: string;   // 容量超過後の速度制限
  tetheringAvailable: boolean;
  overseasRoaming: boolean;

  // 割引
  familyDiscount: FamilyDiscount;
  homeInternetDiscount: HomeInternetDiscount;
  cardDiscount: CardDiscount;

  // サポート
  shopSupport: ShopSupport;
  remoteSupport: RemoteSupport;
  mnpOut: MnpOut;

  // 特徴・注意点
  features: string[];
  cautions: string[];

  updatedAt: string;
}

// キャリア情報
export interface Carrier {
  id: string;
  name: string;
  category: CarrierCategory;
  networkType: NetworkType;
  logoUrl?: string;
  websiteUrl?: string;
}

// プランデータのメタ情報
export interface PlanDataMeta {
  version: string;
  updatedAt: string;
  totalPlans: number;
  totalCarriers: number;
}

// プランデータ全体
export interface PlanData {
  meta: PlanDataMeta;
  plans: Plan[];
}

// キャリアデータ全体
export interface CarrierData {
  carriers: Carrier[];
}
