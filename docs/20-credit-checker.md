# 生活コスト見直し診断 クレカ明細チェッカー 個別仕様書

## 1. 基本情報

| 項目 | 値 |
|------|-----|
| ツール名 | 生活コスト見直し診断 クレカ明細チェッカー |
| siteName（GAS送信用） | `生活コスト見直し診断 クレカ明細チェッカー` |
| 目的 | クレカ明細から支出をカテゴリ分け、家計簿グラフ化、見直しポイント提案 |
| localStorageキー | `6okuniki_credit_registered` |
| ディレクトリ | `apps/credit-checker` |

---

## 2. 技術スタック（ツール固有）

| 項目 | 選択 | 理由 |
|------|------|------|
| フレームワーク | React + Vite | 軽量SPA |
| 言語 | TypeScript | 型安全 |
| スタイリング | Tailwind CSS | 高速開発 |
| CSV解析 | PapaParse | 軽量、高速、ブラウザ内処理 |
| グラフ | Chart.js | 軽量、十分な機能 |
| AI分類 | Cloudflare Workers AI | 無料枠10,000/日 |

---

## 3. アーキテクチャ

```
┌─────────────────────────────────────────┐
│  ユーザーのブラウザ                       │
│                                         │
│  1. CSVアップロード                       │
│  2. PapaParseでCSV解析                   │
│  3. 店名マッチング（静的JSON）            │
│  4. キーワードマッチング（静的JSON）       │
│  5. 分類できないもの → AI（無料枠内）      │
│  6. グラフ描画（Chart.js）               │
│  7. 見直し提案表示                        │
│                                         │
│  ※ CSVデータはサーバーに送信しない        │
└─────────────────────────────────────────┘
         │
         ↓ 静的ファイルのみ
┌─────────────────────────────────────────┐
│  Netlify / Vercel（無料）                 │
│  - HTML / JS / CSS                       │
│  - 店名マッチングJSON（3,000〜5,000件）    │
└─────────────────────────────────────────┘
         │
         ↓ 分類できないもののみ（店名のみ送信）
┌─────────────────────────────────────────┐
│  Cloudflare Workers AI（無料枠）          │
│  - 無料枠: 10,000リクエスト/日            │
│  - 超過時: 「確認できませんでした」表示     │
└─────────────────────────────────────────┘
```

---

## 4. ディレクトリ構成

```
apps/credit-checker/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── wrangler.toml                   # Cloudflare Workers設定
├── public/
│   └── favicon.ico
├── functions/                       # Cloudflare Workers（AI分類用）
│   └── api/
│       └── classify.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── upload/                  # CSV アップロード
    │   │   ├── CsvUploadPage.tsx
    │   │   ├── CsvDropzone.tsx
    │   │   ├── FormatSelector.tsx
    │   │   └── PreviewTable.tsx
    │   └── result/                  # 結果表示
    │       ├── ResultPage.tsx
    │       ├── SummaryCard.tsx
    │       ├── CategoryChart.tsx
    │       ├── MonthlyChart.tsx
    │       ├── SubscriptionList.tsx
    │       ├── ReviewTips.tsx
    │       ├── UnclassifiedList.tsx
    │       └── ExportButtons.tsx
    ├── hooks/
    │   ├── useCsvParser.ts
    │   └── useCategorizer.ts
    ├── lib/
    │   ├── csvParser.ts
    │   ├── categorizer.ts
    │   ├── merchantMatcher.ts
    │   ├── keywordMatcher.ts
    │   ├── aiClassifier.ts
    │   ├── subscriptionDetector.ts
    │   └── reviewTips.ts
    ├── data/
    │   ├── merchants.json
    │   ├── keywords.json
    │   ├── categories.json
    │   └── csvFormats.json
    ├── types/
    │   ├── transaction.ts
    │   ├── category.ts
    │   ├── merchant.ts
    │   └── result.ts
    └── constants/
        └── colors.ts
```

---

## 5. 画面フロー

```
1. ユーザー登録画面（共通コンポーネント使用）
   ↓
2. CSVアップロード画面
   - ファイルドラッグ＆ドロップ
   - フォーマット選択（自動検出 or 手動）
   - プレビュー表示
   ↓
3. 分類処理中（ローディング）
   ↓
4. 診断結果画面
   - サマリー
   - カテゴリ別円グラフ
   - 月別棒グラフ
   - サブスク一覧
   - 見直し提案
   - 分類できなかった項目
```

---

## 6. 共通コンポーネントの使用

```tsx
// src/App.tsx
import { RegistrationForm } from '@6okuneki/shared';

function App() {
  const [step, setStep] = useState<'registration' | 'upload' | 'result'>('registration');

  return (
    <>
      {step === 'registration' && (
        <RegistrationForm
          siteName="生活コスト見直し診断 クレカ明細チェッカー"
          title="クレカ明細をチェック"
          description="支出をカテゴリ分けして、見直しポイントを診断します"
          accentColor="#C67B4E"
          submitButtonText="診断を始める"
          localStorageKey="6okuniki_credit_registered"
          onComplete={() => setStep('upload')}
        />
      )}
      {step === 'upload' && <CsvUploadPage onComplete={handleUploadComplete} />}
      {step === 'result' && <ResultPage result={result} onRestart={handleRestart} />}
    </>
  );
}
```

---

## 7. 型定義

### 7.1 トランザクション

```typescript
// src/types/transaction.ts

interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  memo?: string;
}

type MatchMethod = 
  | 'merchant_exact'
  | 'merchant_partial'
  | 'keyword'
  | 'ai'
  | 'unclassified';

interface CategorizedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  memo?: string;
  category: Category | null;
  subcategory?: string;
  matchMethod: MatchMethod;
  confidence: number;
  isSubscription: boolean;
  subscriptionInfo?: {
    serviceName: string;
    frequency: 'monthly' | 'yearly' | 'unknown';
    cancelUrl?: string;
  };
}
```

### 7.2 カテゴリ

```typescript
// src/types/category.ts

type Category = 
  | 'food'           // 食費
  | 'convenience'    // コンビニ
  | 'cafe'           // カフェ
  | 'daily'          // 日用品
  | 'transport'      // 交通費
  | 'telecom'        // 通信費
  | 'subscription'   // サブスク
  | 'shopping'       // ショッピング
  | 'entertainment'  // 娯楽
  | 'health'         // 医療・健康
  | 'insurance'      // 保険
  | 'utility'        // 公共料金
  | 'other';         // その他

interface CategoryDefinition {
  id: Category;
  label: string;
  labelEn: string;
  color: string;
  description: string;
  examples: string[];
}
```

### 7.3 店名データベース

```typescript
// src/types/merchant.ts

interface MerchantEntry {
  name: string;
  category: Category;
  subcategory?: string;
  aliases: string[];
  country: 'jp' | 'global';
  isSubscription?: boolean;
  cancelUrl?: string;
}

interface KeywordEntry {
  keyword: string;
  category: Category;
  subcategory?: string;
  priority: number;
  language: 'ja' | 'en' | 'both';
}
```

### 7.4 診断結果

```typescript
// src/types/result.ts

interface CategorySummary {
  category: Category;
  label: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

interface MonthlySummary {
  month: string;
  totalAmount: number;
  byCategory: Record<Category, number>;
}

interface SubscriptionDetection {
  serviceName: string;
  category: string;
  monthlyAmount: number;
  yearlyAmount: number;
  frequency: 'monthly' | 'yearly';
  cancelUrl?: string;
  transactions: CategorizedTransaction[];
}

interface ReviewTip {
  id: string;
  title: string;
  description: string;
  category?: Category;
  amount?: number;
  severity: 'info' | 'warning' | 'suggestion';
}

interface DiagnosisResult {
  summary: {
    totalAmount: number;
    transactionCount: number;
    periodStart: string;
    periodEnd: string;
    classifiedCount: number;
    unclassifiedCount: number;
  };
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  subscriptions: SubscriptionDetection[];
  subscriptionMonthlyTotal: number;
  subscriptionYearlyTotal: number;
  reviewTips: ReviewTip[];
  unclassified: { transaction: CategorizedTransaction; reason: string }[];
  transactions: CategorizedTransaction[];
  analyzedAt: string;
}
```

---

## 8. カテゴリ分類ロジック

### 8.1 分類の優先順位

```
1. 店名完全一致（confidence: 100）
2. 店名部分一致（confidence: 90）
3. キーワードマッチング（confidence: 70）
4. AI分類（confidence: 60）
5. 分類不能（unclassified）
```

### 8.2 メイン処理

```typescript
// src/lib/categorizer.ts

async function categorizeTransactions(
  transactions: RawTransaction[]
): Promise<CategorizedTransaction[]> {
  const results: CategorizedTransaction[] = [];
  const needsAi: RawTransaction[] = [];
  
  for (const tx of transactions) {
    // Step 1: 店名完全一致
    let result = matchMerchantExact(tx.description);
    if (result) {
      results.push(createResult(tx, result, 'merchant_exact', 100));
      continue;
    }
    
    // Step 2: 店名部分一致
    result = matchMerchantPartial(tx.description);
    if (result) {
      results.push(createResult(tx, result, 'merchant_partial', 90));
      continue;
    }
    
    // Step 3: キーワードマッチング
    result = matchKeyword(tx.description);
    if (result) {
      results.push(createResult(tx, result, 'keyword', 70));
      continue;
    }
    
    // Step 4: AI分類が必要
    needsAi.push(tx);
  }
  
  // AI分類（まとめて処理）
  if (needsAi.length > 0) {
    const aiResults = await classifyWithAi(needsAi);
    results.push(...aiResults);
  }
  
  return results;
}
```

### 8.3 店名マッチング

```typescript
// src/lib/merchantMatcher.ts

import merchantsData from '../data/merchants.json';

const exactIndex = new Map<string, MerchantEntry>();
const aliasIndex = new Map<string, MerchantEntry>();

function buildIndex() {
  for (const merchant of merchantsData.merchants) {
    exactIndex.set(merchant.name.toUpperCase(), merchant);
    for (const alias of merchant.aliases) {
      aliasIndex.set(alias.toUpperCase(), merchant);
    }
  }
}

function matchMerchantExact(description: string): MerchantEntry | null {
  const normalized = description.toUpperCase().trim();
  return exactIndex.get(normalized) || aliasIndex.get(normalized) || null;
}

function matchMerchantPartial(description: string): MerchantEntry | null {
  const normalized = description.toUpperCase();
  
  for (const [name, merchant] of exactIndex) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return merchant;
    }
  }
  
  for (const [alias, merchant] of aliasIndex) {
    if (normalized.includes(alias)) {
      return merchant;
    }
  }
  
  return null;
}
```

### 8.4 AI分類（Cloudflare Workers）

```typescript
// src/lib/aiClassifier.ts

const AI_ENDPOINT = '/api/classify';
const FREE_TIER_LIMIT = 50;  // 1回のリクエストあたりの上限

async function classifyWithAi(
  transactions: RawTransaction[]
): Promise<CategorizedTransaction[]> {
  const results: CategorizedTransaction[] = [];
  
  const toClassify = transactions.slice(0, FREE_TIER_LIMIT);
  const overflow = transactions.slice(FREE_TIER_LIMIT);
  
  if (toClassify.length > 0) {
    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descriptions: toClassify.map(tx => tx.description),  // 店名のみ送信
        }),
      });
      
      if (response.ok) {
        const aiResults = await response.json();
        // 結果をマッピング
      }
    } catch (error) {
      // エラー時は分類不能として処理
    }
  }
  
  // 無料枠超過分は分類不能
  for (const tx of overflow) {
    results.push(createUnclassified(tx, '分類上限を超えました'));
  }
  
  return results;
}
```

### 8.5 Workers AI実装

```typescript
// functions/api/classify.ts

interface Env {
  AI: Ai;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { descriptions } = await context.request.json();
  
  const categories = [
    '食費', 'コンビニ', 'カフェ', '日用品', '交通費',
    '通信費', 'サブスク', 'ショッピング', '娯楽',
    '医療・健康', '保険', '公共料金', 'その他'
  ];
  
  const prompt = `
クレジットカード明細のカテゴリ分類をしてください。

カテゴリ一覧: ${categories.join(', ')}

店名リスト:
${descriptions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}

JSON形式で回答:
[{ "index": 1, "category": "カテゴリ名", "confidence": 80 }, ...]
`;

  try {
    const response = await context.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt,
      max_tokens: 1000,
    });
    
    // 結果をパースして返却
  } catch (error) {
    // エラー時は空の結果を返却
  }
};
```

---

## 9. CSV解析

### 9.1 対応フォーマット

```json
// src/data/csvFormats.json
{
  "formats": [
    {
      "id": "rakuten",
      "name": "楽天カード",
      "columns": { "date": "利用日", "description": "利用店名・商品名", "amount": "利用金額" },
      "encoding": "Shift_JIS"
    },
    {
      "id": "smbc",
      "name": "三井住友カード",
      "columns": { "date": "ご利用日", "description": "ご利用先など", "amount": "ご利用金額" },
      "encoding": "Shift_JIS"
    },
    {
      "id": "jcb",
      "name": "JCBカード",
      "columns": { "date": "利用日", "description": "利用店名", "amount": "利用金額" },
      "encoding": "Shift_JIS"
    },
    {
      "id": "amex",
      "name": "アメリカン・エキスプレス",
      "columns": { "date": "日付", "description": "説明", "amount": "金額" },
      "encoding": "UTF-8"
    }
  ]
}
```

### 9.2 解析処理

```typescript
// src/lib/csvParser.ts

import Papa from 'papaparse';

async function parseCsv(file: File, formatId: string = 'auto'): Promise<{
  success: boolean;
  transactions: RawTransaction[];
  format: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'Shift_JIS',
      complete: (results) => {
        const format = formatId === 'auto' 
          ? detectFormat(results.meta.fields || [])
          : csvFormats.formats.find(f => f.id === formatId);
        
        if (!format) {
          resolve({ success: false, transactions: [], format: 'unknown', error: 'フォーマット検出失敗' });
          return;
        }
        
        const transactions = results.data.map((row: any) => ({
          date: row[format.columns.date],
          description: row[format.columns.description],
          amount: parseAmount(row[format.columns.amount]),
        })).filter(tx => tx.date && tx.description && tx.amount > 0);
        
        resolve({ success: true, transactions, format: format.name });
      },
    });
  });
}

function parseAmount(value: string): number {
  if (!value) return 0;
  const num = parseInt(value.replace(/[,，円¥]/g, ''), 10);
  return isNaN(num) ? 0 : Math.abs(num);
}
```

---

## 10. 店名データベース

### 10.1 構造

```json
// src/data/merchants.json
{
  "meta": {
    "version": "1.0.0",
    "updatedAt": "2025-01-16",
    "totalEntries": 3500
  },
  "merchants": [
    {
      "name": "セブン-イレブン",
      "category": "convenience",
      "aliases": ["セブンイレブン", "7-ELEVEN", "7-11", "711", "SEVEN ELEVEN"],
      "country": "jp"
    },
    {
      "name": "Netflix",
      "category": "subscription",
      "subcategory": "streaming",
      "aliases": ["NETFLIX.COM", "NETFLIX", "ネットフリックス"],
      "country": "global",
      "isSubscription": true,
      "cancelUrl": "https://www.netflix.com/cancelplan"
    }
  ]
}
```

### 10.2 収集目標

| カテゴリ | 目標件数 |
|---------|---------|
| 日本・コンビニ | 50+ |
| 日本・スーパー | 200+ |
| 日本・飲食チェーン | 500+ |
| 日本・サブスク | 300+ |
| グローバル・サブスク | 500+ |
| グローバル・ショッピング | 300+ |
| MCCコード | 400+ |
| キーワード | 500+ |
| **合計** | **3,000〜5,000** |

---

## 11. 見直し提案

```typescript
// src/lib/reviewTips.ts

function generateReviewTips(result: DiagnosisResult): ReviewTip[] {
  const tips: ReviewTip[] = [];
  
  // コンビニ利用が多い（10%以上）
  const convenience = result.byCategory.find(c => c.category === 'convenience');
  if (convenience && convenience.percentage > 10) {
    tips.push({
      id: 'convenience_high',
      title: 'コンビニ出費が多めです',
      description: `コンビニでの支出が月${convenience.totalAmount.toLocaleString()}円。スーパー活用で節約できるかも。`,
      category: 'convenience',
      amount: convenience.totalAmount,
      severity: 'suggestion',
    });
  }
  
  // サブスクが5件以上
  if (result.subscriptions.length > 5) {
    tips.push({
      id: 'subscription_many',
      title: 'サブスクが複数あります',
      description: `${result.subscriptions.length}件のサブスク（月額${result.subscriptionMonthlyTotal.toLocaleString()}円）。使っていないものがないか確認を。`,
      category: 'subscription',
      amount: result.subscriptionMonthlyTotal,
      severity: 'warning',
    });
  }
  
  // 分類できなかった項目
  if (result.unclassified.length > 0) {
    tips.push({
      id: 'unclassified',
      title: '確認が必要な項目があります',
      description: `${result.unclassified.length}件が自動分類できませんでした。内容をご確認ください。`,
      severity: 'info',
    });
  }
  
  return tips;
}
```

---

## 12. カラーパレット（ツール固有）

```typescript
// src/constants/colors.ts

export const colors = {
  bgBase: '#FBF8F4',      // クリームベージュ（温かみ）
  bgCard: '#FFFFFF',
  textMain: '#3D3229',    // ダークブラウン
  textSub: '#7A6F64',     // ミディアムブラウン
  accent: '#C67B4E',      // テラコッタ
  border: '#E8E0D5',      // ライトベージュ
  success: '#5A8F6A',     // モスグリーン
  warning: '#D98F4E',     // オレンジブラウン
} as const;

// グラフ用カラー（円グラフ・棒グラフ専用）
export const chartColors = [
  '#C67B4E',  // テラコッタ（メインアクセントと統一）
  '#5A8F6A',  // モスグリーン
  '#6B8CAE',  // ダスティブルー
  '#D4A574',  // サンド
  '#8B7B6B',  // トープ
  '#A4C4B5',  // セージ
  '#C9B8A8',  // ベージュ
  '#7A9E7E',  // オリーブ
  '#B8956B',  // キャメル
  '#9E8B7D',  // ウォームグレー
  '#6D8B74',  // フォレスト
  '#C4A77D',  // ゴールドベージュ
  '#8C8C8C',  // グレー（その他）
];
```

---

## 13. セキュリティ（ツール固有）

```
- CSVデータはサーバーに送信しない
- ブラウザ内で全て処理
- sessionStorage/localStorageにCSVを保存しない
- AI APIには店名のみ送信（金額・日付は送信しない）
- ページ離脱時にメモリから破棄
```

---

## 14. 免責事項（ツール固有）

```
■ データの取り扱い
CSVデータはサーバーに送信されません。
すべてブラウザ内で処理され、ページを閉じると破棄されます。

■ 分類精度
自動分類は100%の精度を保証しません。
分類できなかった項目はご自身で確認してください。

■ 見直し提案
表示される提案は参考情報です。
具体的な行動はご自身の判断で行ってください。

■ 免責
本ツールの利用により生じた損害について、
当方は一切の責任を負いません。
```

---

## 15. Cloudflare Workers設定

```toml
# wrangler.toml
name = "credit-checker-ai"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"
```

---

## 16. 実装順序

### Phase 1: 基盤
1. プロジェクト初期化（Vite + React + TypeScript + Tailwind）
2. 型定義
3. 共通パッケージの依存追加

### Phase 2: ユーザー登録
4. 共通RegistrationFormの組み込み

### Phase 3: CSV解析
5. CsvUploadPage
6. PapaParse処理
7. フォーマット自動検出

### Phase 4: カテゴリ分類
8. 店名データベースJSON（主要500件）
9. 店名マッチング
10. キーワードマッチング
11. Cloudflare Workers AI

### Phase 5: 結果表示
12. ResultPage
13. CategoryChart（Chart.js）
14. SubscriptionList
15. ReviewTips
16. UnclassifiedList

### Phase 6: 仕上げ
17. エクスポート機能
18. レスポンシブ対応
19. 店名データベース拡充（3,000〜5,000件）
20. デプロイ

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
