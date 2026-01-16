# CLAUDE.md - 6億ニキ ツール群 プロジェクト記憶ファイル

このファイルはClaude Codeがプロジェクトの重要な情報を記憶するためのファイルです。

---

## プロジェクト概要

- **プロジェクト名**: 6億ニキ ツール群（6okuneki-tools）
- **構成**: モノレポ（pnpm workspace）
- **目的**: TikTokアカウント『6億ニキ』で紹介する各種診断ツール

---

## 重要な注意事項

### 1. 実装前の必須確認

**ユーザー登録画面を実装する際は、必ず最初に以下を確認すること：**

1. **ツール名（siteName）** - GAS送信に使用する識別名
2. **localStorageキー** - ツールごとに異なるキーを使用

ユーザーがツール名を伝えずに実装を依頼してきた場合は、**実装を始める前に必ず聞き返すこと**。

### 2. 要件定義書の読み方

各ツールの実装時は、以下の2つのドキュメントを**必ず両方読むこと**：

1. **共通仕様書** (`docs/01-shared-registration.md`, `docs/02-shared-design-system.md`)
2. **ツール個別仕様書** (`docs/10-*.md`, `docs/20-*.md`, `docs/30-*.md`)

**重要**: 2つのファイルの内容が矛盾・衝突する場合は、**勝手に判断せず必ずユーザーに確認**してから進めること。

### 3. GAS（スプレッドシート連携）について

- **GAS URL**: `https://script.google.com/macros/s/AKfycbxpH8mJWk57MDoO5Q0rUdGzQ2GytKhKqjNm1i35j_sQaAFkky6Toi9WmQhG1DcIxWFmVA/exec`
- **全ツール共通**で同じスプレッドシートに送信
- **GAS側のコード変更は厳禁**（全ツールに影響する）
- `registeredAt`はGAS側で記録するため、フロントからは送信不要

---

## ディレクトリ構成

```
6okuneki-tools/
├── docs/                           # 要件定義書
│   ├── 00-monorepo-overview.md     # 全体概要
│   ├── 01-shared-registration.md   # 共通ユーザー登録仕様
│   ├── 02-shared-design-system.md  # 共通デザインシステム
│   ├── 10-mobile-plan-optimizer.md # 携帯プラン最適化
│   ├── 20-credit-checker.md        # クレカ明細チェッカー
│   └── 30-realtor-fee-checker.md   # 不動産仲介手数料
│
├── packages/
│   └── shared/                     # 共通パッケージ
│
└── apps/
    ├── mobile-plan-optimizer/      # 携帯プラン最適化
    ├── credit-checker/             # クレカ明細チェッカー
    └── realtor-fee-checker/        # 不動産仲介手数料
```

---

## 各ツールの識別情報

| ツール | siteName | localStorageキー |
|--------|----------|------------------|
| 携帯プラン最適化 | `携帯料金プラン最適化診断` | `6okuniki_mobile_registered` |
| クレカ明細チェッカー | `生活コスト見直し診断 クレカ明細チェッカー` | `6okuniki_credit_registered` |
| 不動産仲介手数料 | `不動産仲介手数料適性チェック` | `6okuniki_realtor_registered` |

---

## 実装時の必須チェックリスト

### ユーザー登録画面

- [ ] `siteName`が正しく設定されているか
- [ ] GAS URLへのPOST送信が実装されているか（JSON.stringify必須）
- [ ] エラー時もツール利用が継続可能か
- [ ] localStorageのキー名がツールごとに異なるか
- [ ] 入力バリデーション（メールアドレス形式）が実装されているか
- [ ] HTMLサニタイズが実装されているか
- [ ] 同意チェックなしでボタンが無効化されているか

### デザイン

- [ ] 絵文字を使用していないか（100%禁止）
- [ ] アイコンはLucide React等のSVGを使用しているか
- [ ] モバイルファースト（スマホ優先）で設計されているか
- [ ] タップ領域は最小44px × 44pxあるか
- [ ] iPhone各サイズ（375px〜430px）で表示崩れがないか

### セキュリティ

- [ ] 入力値のサニタイズが実装されているか
- [ ] `innerHTML`を使わず`textContent`を使用しているか
- [ ] `console.log`にセンシティブな情報を出力していないか
- [ ] エラーメッセージに内部情報を含めていないか

---

## 技術スタック

### 全ツール共通

| 項目 | 選択 |
|------|------|
| フレームワーク | React + Vite |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| アイコン | Lucide React |
| ホスティング | Netlify / Vercel |

### ツール固有

| ツール | 追加技術 |
|--------|---------|
| クレカ明細チェッカー | PapaParse, Chart.js, Cloudflare Workers AI |

---

## コマンド

```bash
# 開発サーバー起動
pnpm --filter mobile-plan-optimizer dev
pnpm --filter credit-checker dev
pnpm --filter realtor-fee-checker dev

# 全ツールビルド
pnpm -r build

# Lint
pnpm -r lint
```

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
| 2025-01-16 | packages/shared 共通コンポーネント実装完了 |

---

## 次回やること

- 各ツール（apps/配下）の個別実装
  - 携帯プラン最適化（docs/10-mobile-plan-optimizer.md）
  - クレカ明細チェッカー（docs/20-credit-checker.md）
  - 不動産仲介手数料チェッカー（docs/30-realtor-fee-checker.md）

---

## 実装済み共通コンポーネント（packages/shared）

### コンポーネント
- `RegistrationForm` - メインの登録フォーム
- `AgeSelect` - 年齢選択
- `GenderSelect` - 性別選択
- `EmailInput` - メールアドレス入力
- `TermsCheckbox` - 同意チェックボックス
- `TermsScrollBox` - 利用規約スクロールボックス
- `Button` - 共通ボタン
- `Card` - 共通カード

### Hooks
- `useRegistration` - 登録フロー管理
- `useLocalStorage` - localStorage操作

### Lib
- `sendRegistration` - GAS送信処理
- `validateEmail` - メールアドレスバリデーション
- `sanitize` - HTMLサニタイズ

### Constants
- `DISCLAIMER_TEXT` - 免責事項
- `TERMS_TEXT` - 利用規約全文
- `GAS_URL` - GAS送信先URL
- `AGE_OPTIONS` - 年齢選択肢
- `GENDER_OPTIONS` - 性別選択肢
