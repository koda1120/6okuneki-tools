# 不動産仲介手数料適性チェック 個別仕様書

## 1. 基本情報

| 項目 | 値 |
|------|-----|
| ツール名 | 不動産仲介手数料適性チェック |
| siteName（GAS送信用） | `不動産仲介手数料適性チェック` |
| 目的 | 賃貸物件の仲介手数料が交渉で安くなる可能性を診断 |
| 最終ゴール | 知り合いの不動産業者LINE公式アカウントへの誘導 |
| localStorageキー | `6okuniki_realtor_registered` |
| ディレクトリ | `apps/realtor-fee-checker` |

---

## 2. ビジネスモデル

```
TikTok動画
  ↓
「仲介手数料1ヶ月払ってる人、損してます」
  ↓
無料診断ツール
  ↓
「AD付き物件なら手数料0円にできるかも」と教育
  ↓
「プロに相談したい方はこちら」
  ↓
知り合いの不動産業者LINE
```

---

## 3. ADとは（背景知識）

```
AD（Advertisement fee / 広告料）とは：

- 大家が不動産業者に支払う「入居者を見つけてくれたお礼」
- 家賃の1〜3ヶ月分が相場
- 業者専用サイト（レインズ等）でのみ確認可能
- 一般消費者には見えない

AD付き物件の場合：
- 業者はADだけで利益が出る
- よって、仲介手数料0円でも対応してくれる業者が多い
- しかし、知らない客からは仲介手数料も取る（二重取り）

このツールの目的：
- 「あなたの物件、AD付いてるかも？」と気づかせる
- 「交渉すれば手数料0円になるかも」と教育
- 「交渉が面倒ならプロに任せて」と誘導
```

---

## 4. 技術スタック（ツール固有）

| 項目 | 選択 |
|------|------|
| フレームワーク | React + Vite |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| バックエンド | 不要（全てフロントエンドで完結） |

---

## 5. ディレクトリ構成

```
apps/realtor-fee-checker/
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
    ├── components/
    │   ├── diagnosis/               # 診断入力
    │   │   ├── DiagnosisPage.tsx
    │   │   ├── PropertyInfoStep.tsx
    │   │   ├── FeeInfoStep.tsx
    │   │   ├── DetailInfoStep.tsx
    │   │   └── ProgressIndicator.tsx
    │   └── result/                  # 結果表示
    │       ├── ResultPage.tsx
    │       ├── AdProbabilityCard.tsx
    │       ├── SavingsCard.tsx
    │       ├── NegotiationTips.tsx
    │       ├── NegotiationDifficultyCard.tsx
    │       ├── AdExplanation.tsx
    │       └── LineCtaCard.tsx
    ├── hooks/
    │   ├── useDiagnosis.ts
    │   └── useAdCalculator.ts
    ├── lib/
    │   ├── adCalculator.ts          # AD可能性計算
    │   ├── savingsCalculator.ts     # 節約額計算
    │   └── analytics.ts             # アナリティクス
    ├── data/
    │   ├── areas.json
    │   ├── propertyTypes.json
    │   └── tips.json
    ├── types/
    │   └── index.ts
    └── constants/
        ├── colors.ts
        ├── messages.ts
        └── config.ts
```

---

## 6. 画面フロー

```
1. ユーザー登録画面（共通コンポーネント使用）
   ↓
2. 物件情報入力（Step 1/3）
   - 家賃（必須）
   - 物件種別
   - エリア
   ↓
3. 手数料情報入力（Step 2/3）
   - 請求された仲介手数料（必須）
   - 入居予定月
   ↓
4. 詳細情報入力（Step 3/3）※任意
   - 築年数
   - 空室期間
   - 新築かどうか
   - フリーレント提示の有無
   [スキップして診断] [入力して診断]
   ↓
5. 診断結果画面
   - AD可能性メーター
   - 節約可能額
   - 判定理由（簡潔に）
   - シンプルなアドバイス
   - 「でも交渉って難しい…」
   - 【目立つ】LINE誘導カード
   - ADとは？（折りたたみ）
```

---

## 7. 共通コンポーネントの使用

```tsx
// src/App.tsx
import { RegistrationForm } from '@6okuneki/shared';

function App() {
  const [step, setStep] = useState<'registration' | 'diagnosis' | 'result'>('registration');

  return (
    <>
      {step === 'registration' && (
        <RegistrationForm
          siteName="不動産仲介手数料適性チェック"
          title="仲介手数料をチェック"
          description="その手数料、払いすぎていませんか？"
          accentColor="#2C4A7C"
          submitButtonText="診断スタート"
          localStorageKey="6okuniki_realtor_registered"
          onComplete={() => setStep('diagnosis')}
        />
      )}
      {step === 'diagnosis' && <DiagnosisPage onComplete={handleDiagnosisComplete} />}
      {step === 'result' && <ResultPage result={result} onRestart={handleRestart} />}
    </>
  );
}
```

---

## 8. 型定義

```typescript
// src/types/index.ts

// ========== 物件情報 ==========

type PropertyType = 
  | 'mansion'      // マンション
  | 'apartment'    // アパート
  | 'detached'     // 戸建て
  | 'other';       // その他

type AreaType =
  | 'tokyo_23'     // 東京23区
  | 'tokyo_other'  // 東京23区外
  | 'kanagawa'     // 神奈川
  | 'saitama'      // 埼玉
  | 'chiba'        // 千葉
  | 'osaka'        // 大阪
  | 'nagoya'       // 名古屋
  | 'fukuoka'      // 福岡
  | 'other';       // その他

type VacancyPeriod =
  | 'unknown'      // わからない
  | 'under_1month' // 1ヶ月未満
  | '1_2months'    // 1〜2ヶ月
  | '2_3months'    // 2〜3ヶ月
  | 'over_3months';// 3ヶ月以上

interface PropertyInfo {
  // 必須項目
  rent: number | null;                    // 家賃（万円）
  brokerageFee: number | null;            // 請求された仲介手数料（万円）
  
  // 任意項目（精度向上用）
  propertyType: PropertyType | null;
  area: AreaType | null;
  buildingAge: number | null;
  vacancyPeriod: VacancyPeriod | null;
  moveInMonth: number | null;             // 入居予定月（1〜12）
  isNewConstruction: boolean | null;
  hasFreebies: boolean | null;            // フリーレント/家賃割引の提示があるか
}

// ========== 診断結果 ==========

type AdProbability = 
  | 'very_high'    // 非常に高い（80%以上）
  | 'high'         // 高い（60-79%）
  | 'medium'       // 中程度（40-59%）
  | 'low'          // 低い（20-39%）
  | 'very_low';    // 低い（20%未満）

interface DiagnosisResult {
  // AD可能性
  adProbability: AdProbability;
  adProbabilityScore: number;           // 0-100のスコア
  adProbabilityFactors: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  
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

interface SimpleTip {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
```

---

## 9. AD可能性スコア計算ロジック

### 9.1 スコアリング要素

| 要素 | スコア範囲 | 説明 |
|------|-----------|------|
| 築年数 | -10〜+20 | 築古ほどAD付きやすい |
| 新築フラグ | -15 | 新築はAD付きにくい |
| 空室期間 | -5〜+20 | 長いほどAD付きやすい |
| 入居時期 | -10〜+10 | 閑散期はAD付きやすい |
| エリア | -5〜+10 | 地方ほどAD付きやすい |
| 物件種別 | 0〜+15 | アパート・戸建てはAD付きやすい |
| フリーレント | +15 | 提示があればAD高確率 |

### 9.2 計算ロジック

```typescript
// src/lib/adCalculator.ts

function calculateAdProbability(info: PropertyInfo): {
  score: number;
  probability: AdProbability;
  factors: ScoreFactor[];
} {
  const factors: ScoreFactor[] = [];
  let baseScore = 50; // 基準スコア
  
  // 築年数
  if (info.buildingAge !== null) {
    if (info.buildingAge >= 20) {
      factors.push({ name: '築年数', score: 20, impact: 'positive',
        description: '築20年以上の物件はAD付きの可能性が高いです' });
    } else if (info.buildingAge >= 10) {
      factors.push({ name: '築年数', score: 10, impact: 'positive',
        description: '築10年以上でADが付いている可能性があります' });
    } else if (info.buildingAge < 5) {
      factors.push({ name: '築年数', score: -10, impact: 'negative',
        description: '築浅物件はADが付きにくい傾向があります' });
    }
  }
  
  // 新築フラグ
  if (info.isNewConstruction === true) {
    factors.push({ name: '新築', score: -15, impact: 'negative',
      description: '新築物件はADが付きにくいです' });
  }
  
  // 空室期間
  if (info.vacancyPeriod !== null && info.vacancyPeriod !== 'unknown') {
    const vacancyScores = {
      'under_1month': -5,
      '1_2months': 5,
      '2_3months': 15,
      'over_3months': 20,
    };
    const score = vacancyScores[info.vacancyPeriod];
    factors.push({ name: '空室期間', score, 
      impact: score > 0 ? 'positive' : 'negative',
      description: score > 0 
        ? '空室期間が長いほどADが付いている可能性が高いです'
        : '空室期間が短い物件は人気があり、ADが付きにくい傾向があります' });
  }
  
  // 入居時期
  if (info.moveInMonth !== null) {
    const isPeakSeason = [1, 2, 3].includes(info.moveInMonth);
    if (isPeakSeason) {
      factors.push({ name: '入居時期', score: -10, impact: 'negative',
        description: '1〜3月は繁忙期のため、交渉が難しい時期です' });
    } else {
      factors.push({ name: '入居時期', score: 10, impact: 'positive',
        description: '閑散期（4〜12月）はADが付きやすく、交渉もしやすい時期です' });
    }
  }
  
  // エリア
  if (info.area !== null) {
    const areaScores = {
      'tokyo_23': -5, 'tokyo_other': 5, 'kanagawa': 5,
      'saitama': 10, 'chiba': 10, 'osaka': 0,
      'nagoya': 5, 'fukuoka': 5, 'other': 10,
    };
    const score = areaScores[info.area];
    factors.push({ name: 'エリア', score,
      impact: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
      description: score > 0 
        ? 'このエリアはADが付きやすい傾向があります'
        : '人気エリアはADが付きにくい傾向がありますが、物件によります' });
  }
  
  // 物件種別
  if (info.propertyType !== null) {
    const typeScores = { 'mansion': 0, 'apartment': 10, 'detached': 15, 'other': 5 };
    const score = typeScores[info.propertyType];
    if (score !== 0) {
      factors.push({ name: '物件種別', score, impact: 'positive',
        description: 'この物件種別はADが付きやすい傾向があります' });
    }
  }
  
  // フリーレント
  if (info.hasFreebies === true) {
    factors.push({ name: 'フリーレント・割引あり', score: 15, impact: 'positive',
      description: 'フリーレントや家賃割引の提示がある場合、ADが付いている可能性が非常に高いです' });
  }
  
  // スコア計算
  const totalScore = factors.reduce((sum, f) => sum + f.score, baseScore);
  const clampedScore = Math.max(0, Math.min(100, totalScore));
  
  // 確率判定
  let probability: AdProbability;
  if (clampedScore >= 80) probability = 'very_high';
  else if (clampedScore >= 60) probability = 'high';
  else if (clampedScore >= 40) probability = 'medium';
  else if (clampedScore >= 20) probability = 'low';
  else probability = 'very_low';
  
  return { score: clampedScore, probability, factors };
}
```

### 9.3 節約可能額計算

```typescript
// src/lib/savingsCalculator.ts

function calculateSavings(rent: number, brokerageFee: number): {
  currentFee: number;
  legalMaxFee: number;
  isOvercharged: boolean;
  potentialSavings: number;
} {
  // 法定上限は家賃の1.1ヶ月分（税込）
  const legalMaxFee = rent * 1.1;
  
  // 法定上限を超えているか
  const isOvercharged = brokerageFee > legalMaxFee * 1.01; // 1%の誤差許容
  
  // 節約可能額（手数料0円になった場合）
  const potentialSavings = brokerageFee;
  
  return { currentFee: brokerageFee, legalMaxFee, isOvercharged, potentialSavings };
}
```

---

## 10. 交渉アドバイス（軽めに）

### 10.1 設計方針

```
【重要】交渉アドバイスは「軽め」にする

理由:
- 詳しく教えすぎると「自分でできそう」となる
- LINE誘導につながらない
- ゴールは知り合いの不動産業者への送客

方針:
- 交渉の「可能性」だけ伝える
- 具体的なセリフ例は出さない
- 「でも交渉って難しいですよね」→ LINE誘導
```

### 10.2 アドバイスデータ

```json
// src/data/tips.json
{
  "tips": [
    {
      "id": "ad_exists",
      "title": "AD（広告料）が付いている可能性があります",
      "description": "ADが付いている物件なら、仲介手数料を下げてもらえる可能性があります。",
      "priority": "high",
      "conditions": { "adProbability": ["very_high", "high"] }
    },
    {
      "id": "ad_maybe",
      "title": "ADが付いているかもしれません",
      "description": "条件によってはADが付いている可能性があります。確認してみる価値はあります。",
      "priority": "medium",
      "conditions": { "adProbability": ["medium"] }
    },
    {
      "id": "overcharge_warning",
      "title": "【注意】法定上限を超えている可能性",
      "description": "仲介手数料の上限は家賃の1.1ヶ月分（税込）です。この金額は上限を超えているかもしれません。",
      "priority": "high",
      "conditions": { "isOvercharged": true }
    }
  ],
  "negotiationNote": {
    "title": "交渉って、実は難しい…",
    "points": [
      "ADが付いているか確認する方法がわからない",
      "交渉したら嫌な顔をされそう",
      "そもそも何て言えばいいかわからない",
      "契約を断られたらどうしよう"
    ],
    "conclusion": "そんな方は、プロに任せるのが一番確実です"
  }
}
```

---

## 11. カラーパレット（ツール固有）

```typescript
// src/constants/colors.ts

export const colors = {
  bgBase: '#F5F7FA',      // 薄いグレーブルー
  bgCard: '#FFFFFF',
  textMain: '#1E2A3B',    // ダークネイビー
  textSub: '#5A6978',     // ミディアムグレー
  accent: '#2C4A7C',      // ネイビー（通常UI）
  lineGreen: '#06C755',   // LINEグリーン（最重要CTA）
  border: '#D8DEE6',
  warning: '#E5A73B',     // アンバー（法定上限超過など）
} as const;

// AD可能性メーターの色分け
export const meterColors = {
  low: '#8B9DB5',         // 0-39: 薄いネイビー
  medium: '#5A7A9E',      // 40-59: ミディアム
  high: '#2C4A7C',        // 60-79: ネイビー
  veryHigh: '#1E3A5F',    // 80-100: ダークネイビー
};
```

---

## 12. 設定値

```typescript
// src/constants/config.ts

export const config = {
  // LINE公式アカウントURL（後で差し替え）
  lineOfficialUrl: 'https://line.me/R/ti/p/@xxxxx',
  
  // 法定上限
  legalMaxRate: 1.1,  // 家賃の1.1ヶ月分（税込）
  
  // 繁忙期（交渉が難しい時期）
  peakSeasonMonths: [1, 2, 3],
};
```

---

## 13. LINE誘導文言

```typescript
// src/constants/messages.ts

export const lineCtaMessages = {
  title: '交渉が面倒な方へ',
  subtitle: 'プロに任せてみませんか？',
  
  benefits: [
    'AD付き物件を探してもらえる',
    '仲介手数料0円で契約できる',
    '無料で相談できる',
    '面倒な交渉はすべてお任せ',
  ],
  
  buttonText: 'LINEで無料相談する',
  
  note: '※ 相談は無料です。契約の強制はありません。',
};
```

---

## 14. 免責事項（ツール固有）

```
■ 診断結果について
本診断は入力された情報をもとにAD（広告料）の可能性を推測するものであり、
実際にADが付いているかどうかを保証するものではありません。

■ 交渉アドバイスについて
表示される交渉のコツは一般的な情報であり、
すべてのケースで有効であることを保証するものではありません。
実際の交渉は自己責任で行ってください。

■ 法的アドバイスについて
本ツールは法的アドバイスを提供するものではありません。
仲介手数料に関する法的な問題については、
専門家（弁護士・行政書士等）にご相談ください。

■ 免責
本ツールの利用により生じたいかなる損害についても、
当方は一切の責任を負いません。
```

---

## 15. 実装順序

### Phase 1: 基盤
1. プロジェクト初期化（Vite + React + TypeScript + Tailwind）
2. 型定義ファイル作成
3. カラー・定数ファイル
4. 共通パッケージの依存追加

### Phase 2: ユーザー登録
5. 共通RegistrationFormの組み込み

### Phase 3: 診断入力
6. DiagnosisPage（ステップ管理）
7. PropertyInfoStep
8. FeeInfoStep
9. DetailInfoStep
10. ProgressIndicator

### Phase 4: 計算ロジック
11. AD可能性スコア計算
12. 入力充実度計算
13. 節約可能額計算
14. アドバイス選択ロジック

### Phase 5: 結果表示
15. ResultPage
16. AdProbabilityCard（メーター）
17. SavingsCard
18. NegotiationTips
19. NegotiationDifficultyCard
20. AdExplanation（折りたたみ）
21. LineCtaCard

### Phase 6: 仕上げ
22. レスポンシブ対応
23. アニメーション
24. デプロイ設定

---

## 16. TikTokフック案

```
1. 「仲介手数料1ヶ月払ってる人、損してます」
   → ADの仕組みを軽く説明 → ツール誘導

2. 「不動産屋が絶対教えない"AD"の秘密」
   → 業者視点の裏話風 → ツール誘導

3. 「その仲介手数料、本当は0円にできたかも」
   → 実例っぽく見せる → ツール誘導

4. 「引っ越し初期費用、◯万円安くなる裏技」
   → 交渉術を軽く紹介 → ツール誘導

5. 「この質問するだけで仲介手数料が下がる」
   → 「AD付いてますか？」の話 → ツール誘導
```

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
