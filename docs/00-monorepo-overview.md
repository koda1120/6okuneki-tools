# 6億ニキ ツール群 モノレポ構成 要件定義書

## 1. 概要

### 1.1 プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | 6億ニキ ツール群（6okuneki-tools） |
| 目的 | TikTokアカウント『6億ニキ』で紹介する各種診断ツールの開発・管理 |
| TikTokアカウント | [@hensaikitsui](https://www.tiktok.com/@hensaikitsui) |
| 構成 | モノレポ（1つのリポジトリで複数ツールを管理） |

### 1.2 収録ツール一覧

| ツール | ディレクトリ | 概要 |
|--------|------------|------|
| 携帯料金プラン最適化診断 | `apps/mobile-plan-optimizer` | 100社以上のプランから最適なものを診断 |
| 生活コスト見直し診断 クレカ明細チェッカー | `apps/credit-checker` | クレカ明細から支出をカテゴリ分け・見直し提案 |
| 不動産仲介手数料適性チェック | `apps/realtor-fee-checker` | AD可能性を診断し、LINE誘導 |

※ 今後もツールは随時追加予定

---

## 2. モノレポ構成

### 2.1 ディレクトリ構造

```
6okuneki-tools/
├── README.md                       # プロジェクト概要
├── package.json                    # ルートpackage.json（ワークスペース定義）
├── pnpm-workspace.yaml             # pnpmワークスペース設定
├── turbo.json                      # Turborepo設定（オプション）
│
├── docs/                           # 要件定義書・設計ドキュメント
│   ├── 00-monorepo-overview.md     # 本ファイル（全体概要）
│   ├── 01-shared-registration.md   # 共通ユーザー登録仕様
│   ├── 02-shared-design-system.md  # 共通デザインシステム
│   ├── 10-mobile-plan-optimizer.md # 携帯プラン最適化（個別仕様）
│   ├── 20-credit-checker.md        # クレカ明細チェッカー（個別仕様）
│   └── 30-realtor-fee-checker.md   # 不動産仲介手数料チェック（個別仕様）
│
├── packages/                       # 共通パッケージ
│   └── shared/                     # 共通コンポーネント・ロジック
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── components/         # 共通UIコンポーネント
│           │   ├── registration/   # ユーザー登録関連
│           │   │   ├── RegistrationForm.tsx
│           │   │   ├── AgeSelect.tsx
│           │   │   ├── GenderSelect.tsx
│           │   │   ├── EmailInput.tsx
│           │   │   ├── TermsCheckbox.tsx
│           │   │   └── TermsScrollBox.tsx
│           │   └── common/         # 汎用UIコンポーネント
│           │       ├── Button.tsx
│           │       └── Card.tsx
│           ├── hooks/              # 共通フック
│           │   ├── useRegistration.ts
│           │   └── useLocalStorage.ts
│           ├── lib/                # 共通ロジック
│           │   ├── api.ts          # GAS送信
│           │   └── validation.ts   # バリデーション
│           ├── constants/          # 共通定数
│           │   ├── terms.ts        # 利用規約・免責事項
│           │   └── config.ts       # 共通設定
│           ├── types/              # 共通型定義
│           │   └── registration.ts
│           └── index.ts            # エクスポート
│
└── apps/                           # 各ツール（アプリケーション）
    ├── mobile-plan-optimizer/      # 携帯プラン最適化
    │   ├── package.json
    │   ├── vite.config.ts
    │   ├── tailwind.config.js
    │   └── src/
    │       ├── App.tsx
    │       ├── main.tsx
    │       ├── components/         # ツール固有コンポーネント
    │       ├── hooks/              # ツール固有フック
    │       ├── lib/                # ツール固有ロジック
    │       ├── data/               # ツール固有データ（JSON）
    │       ├── types/              # ツール固有型定義
    │       └── constants/          # ツール固有定数（カラー等）
    │
    ├── credit-checker/             # クレカ明細チェッカー
    │   └── （同様の構成）
    │
    └── realtor-fee-checker/        # 不動産仲介手数料チェック
        └── （同様の構成）
```

### 2.2 パッケージマネージャー

| 項目 | 選択 | 理由 |
|------|------|------|
| パッケージマネージャー | pnpm | ワークスペース機能、ディスク効率 |
| ビルドツール | Turborepo（オプション） | 並列ビルド、キャッシュ |

### 2.3 ワークスペース設定

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// package.json（ルート）
{
  "name": "6okuneki-tools",
  "private": true,
  "scripts": {
    "dev:mobile": "pnpm --filter mobile-plan-optimizer dev",
    "dev:credit": "pnpm --filter credit-checker dev",
    "dev:realtor": "pnpm --filter realtor-fee-checker dev",
    "build:all": "pnpm -r build",
    "lint": "pnpm -r lint"
  }
}
```

---

## 3. 共通パッケージ（shared）の使い方

### 3.1 各ツールからのインポート

```typescript
// apps/mobile-plan-optimizer/src/App.tsx
import { 
  RegistrationForm,
  useRegistration,
  TERMS_TEXT,
  GAS_URL 
} from '@6okuneki/shared';
```

### 3.2 ツールごとのカスタマイズ

共通コンポーネントはPropsでカスタマイズ可能：

```typescript
// 携帯プラン最適化での使用例
<RegistrationForm
  siteName="携帯料金プラン最適化診断"
  title="あなたに最適なプランを診断"
  description="100社以上のプランから最適なものを見つけます"
  accentColor="#D94343"
  submitButtonText="診断を始める"
  onComplete={(data) => setStep('diagnosis')}
/>

// 不動産仲介手数料チェックでの使用例
<RegistrationForm
  siteName="不動産仲介手数料適性チェック"
  title="仲介手数料をチェック"
  description="その手数料、払いすぎていませんか？"
  accentColor="#2C4A7C"
  submitButtonText="診断スタート"
  onComplete={(data) => setStep('property_info')}
/>
```

### 3.3 カスタマイズ可能な項目

| Props | 説明 | デフォルト値 |
|-------|------|------------|
| `siteName` | GASに送信するツール識別名（**必須**） | - |
| `title` | 画面タイトル | "ユーザー登録" |
| `description` | 説明文 | "" |
| `accentColor` | アクセントカラー | "#D94343" |
| `submitButtonText` | 送信ボタンのテキスト | "同意して始める" |
| `showGender` | 性別選択を表示するか | true |
| `onComplete` | 登録完了時のコールバック | - |

---

## 4. 技術スタック（全ツール共通）

| 項目 | 選択 | 理由 |
|------|------|------|
| フレームワーク | React + Vite | 軽量SPA、高速 |
| 言語 | TypeScript | 型安全 |
| スタイリング | Tailwind CSS | 高速開発、一貫性 |
| アイコン | Lucide React | 軽量、豊富 |
| ホスティング | Netlify / Vercel | 無料枠、簡単デプロイ |

### 4.1 各ツールで追加可能な技術

| ツール | 追加技術 | 用途 |
|--------|---------|------|
| クレカ明細チェッカー | PapaParse | CSV解析 |
| クレカ明細チェッカー | Chart.js | グラフ描画 |
| クレカ明細チェッカー | Cloudflare Workers AI | AI分類 |

---

## 5. デプロイ

### 5.1 各ツールの独立デプロイ

各ツールは独立してデプロイ可能：

```bash
# 携帯プラン最適化のみビルド・デプロイ
cd apps/mobile-plan-optimizer
pnpm build
# → dist/ をNetlify/Vercelにデプロイ
```

### 5.2 デプロイ先（例）

| ツール | URL（例） |
|--------|----------|
| 携帯プラン最適化 | `https://mobile-plan.6okuneki.com` |
| クレカ明細チェッカー | `https://credit-checker.6okuneki.com` |
| 不動産仲介手数料 | `https://realtor-fee.6okuneki.com` |

---

## 6. 開発フロー

### 6.1 新規ツール追加時

1. `apps/` に新規ディレクトリ作成
2. `docs/` に個別仕様書を追加
3. `@6okuneki/shared` をdependenciesに追加
4. 共通コンポーネントをインポートして使用
5. ツール固有の機能を実装

### 6.2 共通コンポーネント修正時

1. `packages/shared/` を修正
2. 全ツールで動作確認
3. 必要に応じて各ツールの個別調整

---

## 7. 関連ドキュメント

| ファイル | 内容 |
|---------|------|
| [01-shared-registration.md](./01-shared-registration.md) | 共通ユーザー登録仕様 |
| [02-shared-design-system.md](./02-shared-design-system.md) | 共通デザインシステム |
| [10-mobile-plan-optimizer.md](./10-mobile-plan-optimizer.md) | 携帯プラン最適化（個別仕様） |
| [20-credit-checker.md](./20-credit-checker.md) | クレカ明細チェッカー（個別仕様） |
| [30-realtor-fee-checker.md](./30-realtor-fee-checker.md) | 不動産仲介手数料チェック（個別仕様） |

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
