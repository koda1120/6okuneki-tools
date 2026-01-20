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
| 2025-01-17 | 携帯プラン最適化ツール実装完了・Netlifyデプロイ |
| 2025-01-17 | クレカ明細チェッカー実装完了・Cloudflare Pagesデプロイ |
| 2026-01-16 | 不動産仲介手数料チェッカー実装完了・Vercelデプロイ |
| 2026-01-19 | 携帯プラン最適化ツール デザイン刷新（テック・比較・スマート） |
| 2026-01-19 | 携帯プラン最適化ツール プランデータ拡充完了（20→157プラン、50キャリア） |
| 2026-01-20 | 不動産仲介手数料チェッカー UX改善・診断理由機能追加 |

---

## 次回やること

### 不動産仲介手数料チェッカー
- [x] LINE公式アカウントURLの差し替え → 完了（`https://lin.ee/bJiU5bq`）
- [ ] 診断理由テキストの文言チューニング（様々なケースでテストして改善）
- [ ] モバイルでの表示確認・レスポンシブ調整
- [ ] 各スコアパターンでの診断理由表示テスト

### クレカ明細チェッカー
- [ ] テストCSVで動作確認（https://credit-checker.pages.dev）
- [ ] AI分類が正常動作するか確認
- [ ] 各カード会社フォーマットでのパース確認

### 携帯プラン最適化
- [x] プランデータ拡充完了（157プラン・50キャリア）
  - 大手MNO、サブブランド、MVNO、地域系を網羅
  - 「国内50社以上のプランから最適を診断」と銘打てる状態

---

## 不動産仲介手数料チェッカー（2026-01-16 実装完了）

### デプロイ情報

| 項目 | 値 |
|------|-----|
| ホスティング | Vercel |
| Project Name | `6niki-fudosan-chukai-checker` |
| URL | https://6niki-fudosan-chukai-checker.vercel.app/ |
| Root Directory | **空欄**（モノレポのルート） |
| Build Command | `pnpm --filter realtor-fee-checker build` |
| Output Directory | `apps/realtor-fee-checker/dist` |
| Install Command | `pnpm install` |

### 設計方針

1. **AD可能性スコアリング** (`src/lib/adCalculator.ts`)
   - 築年数、空室期間、エリア、物件種別、入居時期などから推測
   - 0-100のスコアで5段階評価（very_high, high, medium, low, very_low）

2. **築年数入力** - 2つの入力方法を用意
   - 「年数で選ぶ」：従来のドロップダウン選択
   - 「建築年で入力」：西暦入力 → 自動計算（例: 2016年 → 築約10年）

3. **LINE誘導** - 結果画面で交渉の難しさを説明し、LINE相談へ誘導

4. **診断理由の表示**（2026-01-20追加）
   - パターン3（文章まとめ形式）を採用
   - 確率レベル（very_high〜very_low）に応じた導入文・結論文
   - 要因（築年数、駅徒歩、エリア等）を自然な文章に変換
   - `src/lib/adCalculator.ts` の `generateExplanation()` 関数で生成

5. **結果画面の表示順序**（2026-01-20決定）
   ```
   1. ゲージメーター（AD可能性スコア）
   2. 手数料分析（節約可能額）← ユーザーが最も知りたい情報を上に
   3. 診断理由
   4. 診断からのアドバイス
   5. 交渉について
   6. AD（広告料）とは
   ```

6. **入力UIの改善**（2026-01-20）
   - 家賃入力: デュアルドロップダウン `[X] 万 [Y] 千円` 形式
   - 駅徒歩: 1分単位（1〜21、21は「20分以上」）
   - 築年数: 1年単位（新築〜30年以上）
   - 都道府県: 47都道府県から選択（全国対応）
   - 仲介手数料: 月数選択（0.5/1/1.1ヶ月分 or その他）

### 解決した問題（2026-01-20追加）

| 問題 | 原因 | 解決方法 |
|------|------|---------|
| Chromeでドロップダウンがスクロールできない | `appearance-none` CSSがネイティブスクロールを阻害 | 全selectから`appearance-none`を削除 |
| 千円ドロップダウンがクリックできない | `disabled={manYen === null}` の制約 | disabled制約を削除、どちらからでも選択可能に |
| 診断理由が表示されない | 未使用の`AdProbabilityCard`を修正していた | 実際に使用されている`ResultPage`に追加 |
| Vercel自動デプロイが失敗 | Root Directoryが`apps/realtor-fee-checker`で、shared packageが見つからない | Root Directoryを空欄に変更し、Build Commandで`--filter`指定 |
| ビルド時間が0ms（キャッシュ問題） | Vercelがビルドをスキップしていた | `vercel --prod --force` でキャッシュクリア |

### 解決した問題（初期）

| 問題 | 原因 | 解決方法 |
|------|------|---------|
| Vercelでビルド失敗・フォームが表示されない | デフォルトのBuild Commandでは`@6okuneki/shared`が読み込めない | Build Commandを`cd ../.. && pnpm install && pnpm --filter realtor-fee-checker build`に変更 |

### 重要な学び

**モノレポでのVercelデプロイ**: sharedパッケージを「変更」するわけではなく「参照」するだけなので、Build Commandでルートから実行しても各ツール個別のディレクトリのみ触る制約には違反しない

---

## クレカ明細チェッカー（2025-01-17 実装完了）

### デプロイ情報

- **URL**: https://6niki-credit-checker.pages.dev
- **ホスティング**: Cloudflare Pages
- **AI分類**: Cloudflare Workers AI（@cf/meta/llama-3-8b-instruct）

### 重要な設計方針

1. **AI分類はベストエフォート方式**
   - ユーザーの選択式ではなく、**自動的に実行**する
   - 無料枠超過・エラー時は**サイレントに「分類不能」扱い**（エラー表示なし）
   - ユーザーに課金が発生することは100%ない

2. **分類の優先順位**
   ```
   加盟店完全一致 → 部分一致 → キーワードマッチ → AI分類 → 分類不能
   ```

3. **Cloudflare無料枠の安全性**
   - Workers AI無料枠: 10,000リクエスト/日
   - 超過時は429エラーが返る → catchして空配列を返す
   - 有料プランに加入しない限り課金は発生しない

### 解決した問題

| 問題 | 解決方法 |
|------|----------|
| csvParser.tsの型エラー | `results.data as Record<string, string>[]` でキャスト |
| 未使用import/変数によるビルドエラー | 該当コードを削除 |
| CSS @import順序の警告 | Google Fontsのimportを@tailwindより前に移動 |
| AI分類をユーザー選択式で実装してしまった | 要件定義書を再確認し、自動実行（ベストエフォート）に修正 |
| wrangler loginタイムアウト | 再試行で成功 |
| デプロイ時プロジェクト未作成エラー | `wrangler pages project create`で事前作成 |

### ファイル構成

```
apps/credit-checker/
├── functions/api/classify.ts    # Workers AI分類API
├── src/
│   ├── types/                   # 型定義
│   ├── data/                    # マスタデータ（JSON）
│   │   ├── csvFormats.json      # 8社のCSVフォーマット
│   │   ├── categories.json      # 13カテゴリ
│   │   ├── merchants.json       # 約200加盟店
│   │   └── keywords.json        # 約100キーワード
│   ├── lib/                     # ロジック
│   ├── hooks/                   # カスタムフック
│   └── components/              # UIコンポーネント
├── test-data/                   # テストCSV
│   └── 楽天カード_テスト明細.csv
└── wrangler.toml                # Cloudflare設定
```

---

## 携帯プラン最適化ツール（2025-01-17 実装完了）

### デプロイ情報

- **URL**: https://6niki-keitai-shindan.netlify.app
- **Netlify Project**: `6niki-keitai-shindan`
- **ビルドコマンド**: `pnpm --filter mobile-plan-optimizer build`
- **公開ディレクトリ**: `apps/mobile-plan-optimizer/dist`

### 設計方針

1. **スコアリングロジック** (`src/lib/scorer.ts`)
   - 6つの評価軸: 料金・品質・データ量・通話・割引・サポート
   - ユーザーの重視ポイントに応じて重みを2倍に調整
   - 正規化して合計100点満点

2. **割引適用ロジック**
   - カード割引: ユーザーのカードとプランの`targetCards`をキーワードマッチング
   - 光回線割引: `homeInternet`と`targetServices`をマッチング
   - **重要**: 空の`targetCards`配列は「割引なし」として扱う（全カード対象ではない）

3. **家族パターン比較** (`src/lib/calculator.ts`)
   - パターン1: 各自最適プラン（別キャリア可）
   - パターン2: 同一キャリア統一（家族割適用）

### 解決した問題

| 問題 | 原因 | 解決方法 |
|------|------|---------|
| ahamoが3,883円と表示（本来は4,950円） | `targetCards`が空配列のとき全カード対象として割引適用していた | `matchesTargetCard()`関数で空配列は割引なしと判定するよう修正 |
| WSLからGitHub pushできない | Windows側のcredential helperがWSLから呼び出せない | GitHub CLI (gh) をWindows側にインストールし、`~/.local/bin/git-credential-gh`ラッパースクリプトを作成 |
| Netlifyビルド失敗 | ビルドコマンドが`build`だけだった | `pnpm --filter mobile-plan-optimizer build`に修正 |

### 現在のプランデータ（157プラン・50キャリア）

**大手MNO**: docomo(5), au(2), softbank(4)
**サブブランド**: Y!mobile(4), UQ mobile(4), povo(4)
**オンライン専用**: LINEMO(2), ahamo(2)
**楽天**: 楽天モバイル(1)
**主要MVNO**: 日本通信(4), イオンモバイル(9), HISモバイル(5), LIBMO(4), LinksMate(4), J:COM(4), y.u mobile(3), QTモバイル(6), IIJmio(7), mineo(4), nuroモバイル(3), BIGLOBE(3), excite(3), DTI(2), b-mobile(3), トーンモバイル(2), OCN(1)
**追加MVNO**: NifMo(3), ロケットモバイル(3), ヤマダニューモバイル(3), hi-ho(2), ASAHIネット(2), ワイヤレスゲート(2), BIC SIM(3), スマモバ(2), Fiimo(2), X-mobile(3), インターリンク(2), TikimoSIM(2), ペンギンモバイル(2), Wonderlink(2), G-Call(2), So-net(2)
**地域系**: ピカラモバイル(2), eoモバイル(3), TOKAIモバイル(2), BBIQ(2), コミュファモバイル(2), RepairSIM(2), @モバイルくん(2)

### デザイン刷新（2026-01-19）

**コンセプト**: 「テック・比較・スマート」

| 変更点 | Before | After |
|--------|--------|-------|
| アクセント色 | 赤 `#D94343` | シアン `#0891B2` |
| 背景色 | オフホワイト `#FAF9F7` | 純白に近い `#FAFAFA` |
| テキスト色 | `#333333` | ほぼ黒 `#111827` |
| 角丸 | 12px (rounded-xl) | 8px (rounded-lg) |
| カードシャドウ | あり | なし（ボーダーのみ） |
| アイコン背景 | 丸 (rounded-full) | 角丸 (rounded-lg) |

**特徴**:
- 金額を大きく目立たせる（price-large クラス）
- 節約額は緑でハイライト
- 比較テーブル用の横スクロールUI（compare-scroll クラス）

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
