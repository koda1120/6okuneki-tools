# 携帯料金プラン最適化診断 個別仕様書

## 1. 基本情報

| 項目 | 値 |
|------|-----|
| ツール名 | 携帯料金プラン最適化診断 |
| siteName（GAS送信用） | `携帯料金プラン最適化診断` |
| 目的 | 100社以上の携帯プランから最適なプランを診断 |
| localStorageキー | `6okuniki_mobile_registered` |
| ディレクトリ | `apps/mobile-plan-optimizer` |

---

## 2. 技術スタック（ツール固有）

| 項目 | 選択 |
|------|------|
| フレームワーク | React + Vite |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データ | 静的JSON（プランデータ） |

---

## 3. ディレクトリ構成

```
apps/mobile-plan-optimizer/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── components/
    │   ├── diagnosis/              # 診断入力
    │   │   ├── DiagnosisWizard.tsx
    │   │   ├── PersonCountStep.tsx
    │   │   ├── PersonInfoStep.tsx
    │   │   ├── DataUsageStep.tsx
    │   │   ├── CallUsageStep.tsx
    │   │   ├── CurrentPlanStep.tsx
    │   │   ├── CommonSettingsStep.tsx
    │   │   └── ConfirmStep.tsx
    │   │
    │   └── result/                 # 結果表示
    │       ├── ResultPage.tsx
    │       ├── SavingsTips.tsx
    │       ├── PlanRanking.tsx
    │       ├── PlanCard.tsx
    │       ├── ComparisonTable.tsx
    │       ├── FamilyPatternComparison.tsx
    │       └── ExportButtons.tsx
    │
    ├── hooks/
    │   ├── useDiagnosis.ts
    │   └── usePlanCalculation.ts
    │
    ├── lib/
    │   ├── calculator.ts           # 料金計算ロジック
    │   ├── filter.ts               # フィルタリングロジック
    │   ├── scorer.ts               # スコアリングロジック
    │   └── savingsTips.ts          # 節約提案ロジック
    │
    ├── data/
    │   ├── plans.json              # プランデータ（メイン）
    │   ├── carriers.json           # キャリア情報
    │   ├── discounts.json          # 割引条件
    │   └── questions.json          # 質問定義
    │
    ├── types/
    │   ├── plan.ts
    │   ├── diagnosis.ts
    │   └── result.ts
    │
    └── constants/
        └── colors.ts               # ツール固有カラー
```

---

## 4. 画面フロー

```
1. ユーザー登録画面（共通コンポーネント使用）
   ↓
2. 診断人数選択（1〜10人）
   ↓
3. 各人の情報入力（人数分ループ）
   - 2人目以降: 続柄、同居、苗字
   - データ通信
   - 通話
   - 現在の契約
   ↓
4. 共通設定
   - 割引条件
   - 重視ポイント
   - サポート
   - 端末
   ↓
5. 確認画面
   ↓
6. 診断結果表示
```

---

## 5. 共通コンポーネントの使用

```tsx
// src/App.tsx
import { RegistrationForm } from '@6okuneki/shared';

function App() {
  const [step, setStep] = useState<'registration' | 'diagnosis' | 'result'>('registration');

  return (
    <>
      {step === 'registration' && (
        <RegistrationForm
          siteName="携帯料金プラン最適化診断"
          title="あなたに最適なプランを診断"
          description="100社以上のプランからあなたにぴったりのものを見つけます"
          accentColor="#D94343"
          submitButtonText="診断を始める"
          localStorageKey="6okuniki_mobile_registered"
          onComplete={() => setStep('diagnosis')}
        />
      )}
      {step === 'diagnosis' && <DiagnosisWizard onComplete={handleDiagnosisComplete} />}
      {step === 'result' && <ResultPage result={result} onRestart={handleRestart} />}
    </>
  );
}
```

---

## 6. 型定義

### 6.1 診断入力

```typescript
// src/types/diagnosis.ts

// 続柄
type Relationship = 
  | 'spouse'           // 配偶者
  | 'child'            // 子供
  | 'parent'           // 親
  | 'grandparent'      // 祖父母
  | 'sibling'          // 兄弟姉妹
  | 'partner'          // 同性パートナー・事実婚
  | 'other_relative'   // その他の親族
  | 'roommate';        // 同居人（親族ではない）

// データ使用量
type DataUsage = 
  | 'under_1gb'      // 1GB未満
  | '1_3gb'          // 1〜3GB
  | '3_10gb'         // 3〜10GB
  | '10_20gb'        // 10〜20GB
  | '20_50gb'        // 20〜50GB
  | 'over_50gb'      // 50GB以上
  | 'unlimited'      // 無制限
  | 'unknown';       // わからない

// 通話時間
type CallDuration = 
  | 'under_1min'     // 1分未満
  | '1_5min'         // 1〜5分
  | '5_10min'        // 5〜10分
  | 'over_10min'     // 10分以上
  | 'unknown';       // わからない

// 通話頻度
type CallFrequency = 
  | 'rarely'         // ほぼしない（月2〜3回以下）
  | 'sometimes'      // たまに（週1〜2回）
  | 'often'          // よく（週3回以上）
  | 'daily'          // 毎日
  | 'unknown';       // わからない

// 現在のキャリア
type CurrentCarrier = 
  | 'docomo' | 'au' | 'softbank' | 'rakuten' 
  | 'mvno' | 'none' | 'unknown';

// 重視ポイント
type Priority = 
  | 'price'          // 料金の安さ
  | 'quality'        // 通信速度・品質
  | 'support'        // サポート体制
  | 'data'           // データ量
  | 'points';        // 特典・ポイント

// サポート必要度
type SupportNeed = 
  | 'shop_required'     // 店舗で対面サポート必須
  | 'shop_preferred'    // 店舗があると安心
  | 'phone_ok'          // 電話サポートがあればOK
  | 'chat_ok'           // チャットやWebで解決できればOK
  | 'none';             // サポート不要

// 1人分の診断データ
interface PersonDiagnosis {
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
interface CommonSettings {
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
interface DiagnosisInput {
  personCount: number;  // 1〜10
  persons: PersonDiagnosis[];
  common: CommonSettings;
}
```

### 6.2 プランデータ

```typescript
// src/types/plan.ts

// キャリアカテゴリ
type CarrierCategory = 
  | 'mno'           // 大手キャリア
  | 'sub_brand'     // サブブランド
  | 'online'        // オンライン専用
  | 'mvno';         // 格安SIM

// 回線種別
type NetworkType = 'docomo' | 'au' | 'softbank' | 'rakuten';

// データ容量タイプ
type DataCapacityType = 
  | 'fixed'         // 固定容量
  | 'tiered'        // 段階制
  | 'unlimited';    // 使い放題

// プラン情報（メイン）
interface Plan {
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
  voiceOptions: {
    id: string;
    name: string;
    price: number;
    freeMinutes?: number;
    unlimited?: boolean;
  }[];
  
  // ネットワーク
  networkType: NetworkType;
  has5g: boolean;
  speedLimitAfterCap?: string;
  tetheringAvailable: boolean;
  overseasRoaming: boolean;
  
  // 割引
  familyDiscount: { available: boolean; discountPerLine?: number; maxLines?: number };
  homeInternetDiscount: { available: boolean; targetServices?: string[]; discountAmount?: number };
  cardDiscount: { available: boolean; targetCards?: string[]; discountAmount?: number };
  
  // サポート
  shopSupport: { available: boolean; shopCount?: number };
  remoteSupport: { phone?: { available: boolean }; chat?: { available: boolean } };
  mnpOut: { instant: boolean; methods: string[] };
  
  // 特徴・注意点
  features: string[];
  cautions: string[];
  
  updatedAt: string;
}
```

### 6.3 診断結果

```typescript
// src/types/result.ts

// 節約提案
interface SavingTip {
  id: string;
  title: string;
  description: string;
  estimatedSaving?: string;
}

// プランスコア
interface PlanScore {
  plan: Plan;
  totalScore: number;
  breakdown: {
    priceScore: number;
    qualityScore: number;
    dataScore: number;
    voiceScore: number;
    discountScore: number;
    supportScore: number;
  };
  monthlyPrice: number;
  yearlyPrice: number;
  savingsPerYear?: number;
  appliedDiscounts: string[];
  warnings: string[];
}

// 1人分の診断結果
interface PersonResult {
  personIndex: number;
  recommendedVoiceOption: 'none' | '5min' | 'unlimited';
  estimatedDataUsage: number;
  rankedPlans: PlanScore[];
}

// 家族パターン比較
interface FamilyPattern {
  type: 'same_carrier' | 'separate';
  carrierId?: string;
  totalMonthlyPrice: number;
  totalYearlyPrice: number;
  savingsPerYear?: number;
  personPlans: { personIndex: number; plan: Plan; monthlyPrice: number }[];
  pros: string[];
  cons: string[];
}

// 診断結果全体
interface DiagnosisResult {
  summary: {
    totalPersons: number;
    currentTotalMonthlyFee: number | null;
    recommendedTotalMonthlyFee: number;
    estimatedYearlySavings: number | null;
  };
  savingTips: SavingTip[];
  personResults: PersonResult[];
  familyPatterns?: FamilyPattern[];
  globalWarnings: string[];
  diagnosedAt: string;
}
```

---

## 7. ロジック仕様

### 7.1 フィルタリング

```typescript
// src/lib/filter.ts

/**
 * プランをフィルタリングする
 * 
 * 除外条件:
 * 1. データ量不足
 * 2. サポート条件不一致
 * 3. 海外利用不可
 * 4. テザリング不可
 */
function filterPlans(
  plans: Plan[],
  person: PersonDiagnosis,
  common: CommonSettings
): Plan[];

/**
 * データ使用量を推定する（GB）
 */
function estimateDataUsage(person: PersonDiagnosis): number;
```

### 7.2 スコアリング

```typescript
// src/lib/scorer.ts

/**
 * プランをスコアリングする
 * 
 * 評価軸（各100点満点）:
 * - priceScore: 料金の安さ
 * - qualityScore: 通信品質（MNO > サブブランド > MVNO）
 * - dataScore: データ量マッチ度
 * - voiceScore: 通話オプションマッチ度
 * - discountScore: 割引適用可否
 * - supportScore: サポート充実度
 * 
 * 重み付け:
 * - priority に応じて該当スコアを 2.0倍
 */
function scorePlan(
  plan: Plan,
  person: PersonDiagnosis,
  common: CommonSettings,
  carrier: Carrier
): PlanScore;
```

### 7.3 通話オプション判定

```typescript
// src/lib/calculator.ts

/**
 * 推奨通話オプションを判定
 * 
 * 基準:
 * - 月15分未満 → オプション不要
 * - 月15分〜45分 → 5分かけ放題がお得
 * - 月45分以上 → 完全かけ放題がお得
 */
function recommendVoiceOption(person: PersonDiagnosis): 'none' | '5min' | 'unlimited';

/**
 * 月間通話時間を推定（分）
 */
function estimateMonthlyCallMinutes(person: PersonDiagnosis): number;
```

### 7.4 節約提案

```typescript
// src/lib/savingsTips.ts

/**
 * 節約提案を生成
 * 
 * 提案パターン:
 * - Wi-Fiあるけど使っていない
 * - 自宅でデータ大量消費
 * - 外出先で動画視聴
 * - LINE通話で代替可能
 */
function generateSavingsTips(person: PersonDiagnosis): SavingTip[];
```

---

## 8. カラーパレット（ツール固有）

```typescript
// src/constants/colors.ts

export const colors = {
  bgBase: '#FAF9F7',      // オフホワイト（温かみ）
  bgCard: '#FFFFFF',
  textMain: '#333333',
  textSub: '#666666',
  accent: '#D94343',      // 赤（CTA、強調）
  border: '#E5E2DC',
  success: '#3B7A57',     // 緑（おすすめ、節約）
  warning: '#C27A3A',     // オレンジ（注意）
} as const;
```

---

## 9. プランデータ

### 9.1 データ構造

```json
// src/data/plans.json
{
  "meta": {
    "version": "1.0.0",
    "updatedAt": "2025-01-15",
    "totalPlans": 100,
    "totalCarriers": 50
  },
  "plans": [
    {
      "id": "linemo_best_plan",
      "carrierId": "linemo",
      "name": "ベストプラン",
      "dataCapacityGb": 10,
      "dataCapacityType": "tiered",
      "monthlyPrice": 2090,
      "priceTiers": [
        { "upToGb": 3, "price": 990 },
        { "upToGb": 10, "price": 2090 }
      ],
      "voiceBaseRate": 22,
      "voiceFreeMinutes": 0,
      "voiceOptions": [
        { "id": "5min", "name": "5分かけ放題", "price": 550, "freeMinutes": 5 },
        { "id": "unlimited", "name": "完全かけ放題", "price": 1650, "unlimited": true }
      ],
      "networkType": "softbank",
      "has5g": true,
      "speedLimitAfterCap": "300kbps",
      "tetheringAvailable": true,
      "overseasRoaming": true,
      "familyDiscount": { "available": false },
      "homeInternetDiscount": { "available": false },
      "cardDiscount": { "available": false },
      "shopSupport": { "available": false },
      "remoteSupport": {
        "chat": { "available": true, "type": "有人+AI", "hours": "24時間" }
      },
      "mnpOut": { "instant": true, "methods": ["web"] },
      "features": ["LINEギガフリー", "ソフトバンク回線"],
      "cautions": ["店舗サポートなし", "キャリアメールなし"],
      "updatedAt": "2025-01-15"
    }
  ]
}
```

### 9.2 収集目標

| カテゴリ | 目標件数 |
|---------|---------|
| 大手キャリア（MNO） | 20+ |
| サブブランド | 10+ |
| オンライン専用 | 10+ |
| MVNO | 60+ |
| **合計** | **100+** |

---

## 10. 免責事項（ツール固有）

結果画面の前に表示：

```
本ツールの利用にあたり、以下の点をご了承ください。

■ 情報の正確性について
本ツールで表示される料金・プラン情報は、作成時点の情報に基づいています。
料金・プラン内容は予告なく変更される場合があります。
最新かつ正確な情報は、各キャリアの公式サイトでご確認ください。

■ 診断結果について
診断結果は参考情報であり、最適なプランを保証するものではありません。
実際の料金・節約額は、ご利用状況により異なります。
最終的なプラン選択・契約判断は、ご自身の責任で行ってください。

■ 免責
本ツールの利用により生じたいかなる損害についても、
当方は一切の責任を負いません。
```

---

## 11. 実装順序

### Phase 1: 基盤
1. プロジェクト初期化（Vite + React + TypeScript + Tailwind）
2. 型定義ファイル作成
3. カラー・定数ファイル
4. 共通パッケージ（@6okuneki/shared）の依存追加

### Phase 2: ユーザー登録
5. 共通RegistrationFormの組み込み
6. localStorage処理確認

### Phase 3: 診断入力
7. DiagnosisWizardコンポーネント
8. 各ステップコンポーネント
9. 入力バリデーション

### Phase 4: ロジック
10. プランデータJSON作成（まずは10社程度）
11. フィルタリング処理
12. スコアリング処理
13. 通話オプション判定
14. 節約提案生成

### Phase 5: 結果表示
15. ResultPageコンポーネント
16. PlanRankingコンポーネント
17. FamilyPatternComparisonコンポーネント
18. エクスポート機能

### Phase 6: 仕上げ
19. レスポンシブ対応
20. エラーハンドリング
21. プランデータ拡充（100社目標）
22. デプロイ設定

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
