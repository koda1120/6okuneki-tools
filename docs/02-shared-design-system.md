# 6億ニキ ツール群 共通デザインシステム

## 1. 概要

本ドキュメントは、6億ニキツール群で適用する共通デザイン方針を定義する。

---

## 2. デザイン基本方針

### 2.1 AIっぽくならないデザイン

```
【重要】以下の方針は全ツールに適用

- 過度にミニマル・クリーンすぎない
- 人間味のある温かみのあるデザイン
- ありきたりなグラデーションやAI生成風の装飾を避ける
```

### 2.2 絵文字は100%使用禁止

```
- すべてのアイコンはSVGまたはアイコンライブラリで実装
- Lucide React等のアイコンライブラリを活用
- カスタムSVGが必要な場合は作成
- 絶対に絵文字（😀等）をUI上で使用しない
```

### 2.3 レスポンシブ最適化（スマホ優先）

```
- モバイルファーストで設計
- TikTokからの流入 = スマホからの利用が大半
- タップしやすいボタンサイズ（最小44px）
- 片手操作を考慮したUI配置
```

### 2.4 iPhone各サイズでの最適化確認必須

| デバイス | 幅 |
|----------|-----|
| iPhone SE | 375px |
| iPhone 12/13/14 | 390px |
| iPhone 12/13/14 Pro Max | 428px |
| iPhone 15 Pro Max | 430px |

確認事項：
- 各サイズで表示崩れがないこと
- Safe Area対応（ノッチ、Dynamic Island）

### 2.5 タッチ操作の最適化

```
- ボタン間の適切な余白
- スクロール領域の明確化
- 誤タップ防止の配慮
- タップ領域最小44px × 44px
```

---

## 3. カラー設計

### 3.1 共通ルール

各ツールで独自のカラーパレットを持つが、以下のルールは共通：

| 役割 | 説明 |
|------|------|
| `bgBase` | ページ背景（オフホワイト系） |
| `bgCard` | カード背景（白） |
| `textMain` | メインテキスト（濃い色） |
| `textSub` | サブテキスト（やや薄い色） |
| `accent` | アクセントカラー（CTA、強調） |
| `border` | ボーダー（薄いグレー系） |
| `success` | ポジティブ（緑系） |
| `warning` | 注意（オレンジ系） |

### 3.2 各ツールのカラーパレット

#### 携帯料金プラン最適化診断

```typescript
// apps/mobile-plan-optimizer/src/constants/colors.ts

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

#### 生活コスト見直し診断 クレカ明細チェッカー

```typescript
// apps/credit-checker/src/constants/colors.ts

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
  '#C67B4E', '#5A8F6A', '#6B8CAE', '#D4A574',
  '#8B7B6B', '#A4C4B5', '#C9B8A8', '#7A9E7E',
  '#B8956B', '#9E8B7D', '#6D8B74', '#C4A77D',
  '#8C8C8C'
];
```

#### 不動産仲介手数料適性チェック

```typescript
// apps/realtor-fee-checker/src/constants/colors.ts

export const colors = {
  bgBase: '#F5F7FA',      // 薄いグレーブルー
  bgCard: '#FFFFFF',
  textMain: '#1E2A3B',    // ダークネイビー
  textSub: '#5A6978',     // ミディアムグレー
  accent: '#2C4A7C',      // ネイビー（通常UI）
  lineGreen: '#06C755',   // LINEグリーン（最重要CTA）
  border: '#D8DEE6',
  warning: '#E5A73B',     // アンバー
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

## 4. タイポグラフィ

### 4.1 フォントファミリー

```typescript
fontFamily: {
  sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
}
```

### 4.2 フォントサイズ（推奨）

| 用途 | サイズ |
|------|--------|
| 大見出し | 24-28px |
| 中見出し | 18-20px |
| 本文 | 14-16px |
| 注釈 | 12px |

---

## 5. コンポーネントスタイル

### 5.1 ボタン

```typescript
// packages/shared/src/components/common/Button.tsx

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'line';  // line は不動産用
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

/**
 * サイズ:
 * - sm: 高さ 36px
 * - md: 高さ 44px
 * - lg: 高さ 52px
 * 
 * タップ領域:
 * - 最小 44px × 44px
 * 
 * primary:
 * - 背景: accent色
 * - 文字: 白
 * - 角丸: 8px
 * 
 * secondary:
 * - 背景: 白
 * - 枠線: accent色
 * - 文字: accent色
 */
```

### 5.2 カード

```css
.card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### 5.3 入力フォーム

```css
.input {
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 16px;  /* iOS zoom防止 */
}

.input:focus {
  border-color: var(--accent);
  outline: none;
}
```

### 5.4 セレクトボックス

```css
.select {
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 12px;
  font-size: 16px;  /* iOS zoom防止 */
  appearance: none;
  background-image: url("data:image/svg+xml,...");  /* 矢印アイコン */
  background-position: right 12px center;
  background-repeat: no-repeat;
}
```

---

## 6. Tailwind設定

### 6.1 共通設定（各ツールで継承）

```javascript
// apps/*/tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 各ツールで上書き
        'bg-base': '#FAF9F7',
        'bg-card': '#FFFFFF',
        'text-main': '#333333',
        'text-sub': '#666666',
        'accent': '#D94343',
        'border': '#E5E2DC',
        'success': '#3B7A57',
        'warning': '#C27A3A',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 7. アイコン

### 7.1 使用ライブラリ

```bash
npm install lucide-react
```

### 7.2 使用例

```tsx
import { ChevronRight, Check, AlertTriangle } from 'lucide-react';

<ChevronRight className="w-5 h-5 text-text-sub" />
<Check className="w-5 h-5 text-success" />
<AlertTriangle className="w-5 h-5 text-warning" />
```

### 7.3 カスタムSVGが必要な場合

```tsx
// src/components/icons/CustomIcon.tsx
export function CustomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* SVGパス */}
    </svg>
  );
}
```

---

## 8. レスポンシブ設計

### 8.1 ブレークポイント

| サイズ | 幅 | 用途 |
|--------|-----|------|
| sm | 375px〜 | スマホ（メイン） |
| md | 768px〜 | タブレット |
| lg | 1024px〜 | PC |

### 8.2 コンテナ

```css
.container {
  max-width: 480px;  /* スマホ最適化 */
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container {
    max-width: 640px;
  }
}
```

---

## 9. ページ遷移

### 9.1 スクロール位置

ページ遷移時は常にページ最上部から表示：

```javascript
// ページ遷移時に最上部へスクロール
window.scrollTo(0, 0);

// React Router例
useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]);
```

### 9.2 ローディング状態

```tsx
// ローディング中の表示
{isLoading && (
  <div className="flex justify-center py-8">
    <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
  </div>
)}
```

---

## 10. アクセシビリティ

### 10.1 基本要件

- コントラスト比 4.5:1 以上（テキスト）
- フォーカス状態の明確な表示
- タップ領域 44px × 44px 以上
- スクリーンリーダー対応（aria-label等）

### 10.2 フォーカス状態

```css
.interactive:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## 11. HTTPヘッダー（セキュリティ）

```javascript
// netlify.toml または vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-16 | モノレポ構成として初版作成 |
