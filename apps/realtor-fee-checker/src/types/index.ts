// ========== 物件情報 ==========

export type PropertyType =
  | 'mansion'      // マンション
  | 'apartment'    // アパート
  | 'detached'     // 戸建て
  | 'other';       // その他

export type AreaType =
  | 'hokkaido_tohoku'  // 北海道・東北
  | 'kanto'            // 関東
  | 'chubu'            // 中部
  | 'kinki'            // 近畿
  | 'chugoku_shikoku'  // 中国・四国
  | 'kyushu_okinawa';  // 九州・沖縄

export type StationDistance =
  | 'under_5'    // 5分以内
  | '5_10'       // 6〜10分
  | '10_15'      // 11〜15分
  | 'over_15';   // 16分以上

export type VacancyPeriod =
  | 'unknown'      // わからない
  | 'under_1month' // 1ヶ月未満
  | '1_2months'    // 1〜2ヶ月
  | '2_3months'    // 2〜3ヶ月
  | 'over_3months';// 3ヶ月以上

export interface PropertyInfo {
  // 必須項目
  rent: number | null;                    // 家賃（万円）
  brokerageFee: number | null;            // 請求された仲介手数料（万円）

  // 任意項目（精度向上用）
  propertyType: PropertyType | null;
  area: AreaType | null;
  stationDistance: StationDistance | null; // 駅徒歩
  buildingAge: number | null;
  vacancyPeriod: VacancyPeriod | null;
  moveInMonth: number | null;             // 入居予定月（1〜12）
  isNewConstruction: boolean | null;
  hasFreebies: boolean | null;            // フリーレント/家賃割引の提示があるか
}

// ========== 診断結果 ==========

export type AdProbability =
  | 'very_high'    // 非常に高い（80%以上）
  | 'high'         // 高い（60-79%）
  | 'medium'       // 中程度（40-59%）
  | 'low'          // 低い（20-39%）
  | 'very_low';    // 低い（20%未満）

export interface ScoreFactor {
  name: string;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface SimpleTip {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DiagnosisResult {
  // AD可能性
  adProbability: AdProbability;
  adProbabilityScore: number;           // 0-100のスコア
  adProbabilityFactors: ScoreFactor[];

  // 節約可能額
  currentFee: number;
  legalMaxFee: number;                  // 法定上限（家賃1.1ヶ月）
  potentialSavings: number;

  // 判定
  isOvercharged: boolean;
  negotiationRecommendation: 'strong' | 'moderate' | 'weak';

  // アドバイス
  tips: SimpleTip[];

  // 入力情報の充実度
  inputCompleteness: number;
  missingImportantFields: string[];

  analyzedAt: string;
}

// ========== ステップ管理 ==========

export type AppStep = 'registration' | 'diagnosis' | 'result';
export type DiagnosisStep = 1 | 2 | 3;
