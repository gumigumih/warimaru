# デザインシステム・UI/UXガイドライン（わりまる）

## 🎨 デザインシステム概要

わりまるアプリは、シンプルで直感的なUIと、誰でも使いやすいアクセシビリティを重視したデザインシステムを採用しています。

### デザイン原則
- **ブランド一貫性**: わりまるのロゴ・カラー・雰囲気を統一
- **ユーザビリティ**: 迷わず使えるシンプルなインターフェース
- **アクセシビリティ**: 色コントラスト・キーボード操作・スクリーンリーダー対応
- **レスポンシブ**: モバイル・PC両対応

## 🎨 カラーパレット

### ブランドカラー（わりまる）
```typescript
export const COLORS = {
  primary: {
    main: '#3B82F6', // わりまるブルー
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  secondary: {
    main: '#6B7280', // グレー
    light: '#F3F4F6',
    dark: '#374151',
  },
  accent: {
    main: '#10B981', // アクセントグリーン
    red: '#EF4444', // アクセントレッド
    orange: '#F59E0B', // アクセントオレンジ
  },
  background: {
    white: '#FFFFFF',
    light: '#F9FAFB',
    gray: '#E5E7EB',
    dark: '#111827',
  },
  text: {
    main: '#111827',
    sub: '#6B7280',
    placeholder: '#D1D5DB',
    white: '#FFFFFF',
  },
  border: {
    main: '#E5E7EB',
    accent: '#3B82F6',
  },
};
```

## 📝 タイポグラフィ

### フォントファミリー・サイズ
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
```

### フォントウェイト・行間
```css
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
.font-normal { font-weight: 400; }
.leading-tight { line-height: 1.2; }
.leading-normal { line-height: 1.5; }
```

## 📏 スペーシング・レイアウト

### 基本スペーシング
```css
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-full { border-radius: 9999px; }
.shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
```

### レイアウト例
- **コンテナ**: `max-w-md mx-auto p-4 bg-white rounded-md shadow-md`
- **ボタン**: `px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700`
- **入力欄**: `w-full p-2 border border-gray-300 rounded focus:border-blue-500`

## 🧩 コンポーネント設計（Atomic Design推奨）
- **atoms**: Button, Input, Icon, Label
- **molecules**: InputForm, PaymentRow, CalculatorModal
- **organisms**: PersonPaymentForm, ResultScreen
- **templates/pages**: App, 各画面

## 🪄 UI/UXガイドライン
- **ボタン**: 主要操作はprimary色、危険操作はaccent.red、無効時はopacity-50
- **フォーム**: プレースホルダーは薄いグレー、必須項目は*印や色で明示
- **モーダル**: 背景オーバーレイ（`bg-gray-800/20`）、右上に丸い閉じるボタン
- **リスト**: 余白・区切り線で見やすく
- **レスポンシブ**: モバイル・PC両対応（`max-w-md mx-auto`等）
- **アニメーション**: 過度な動きは避け、操作感を補助する範囲で

## ♿️ アクセシビリティ
- **色コントラスト**: WCAG基準を意識（例：青背景×白文字）
- **キーボード操作**: Tab移動・Enter/Spaceでの操作対応
- **スクリーンリーダー**: aria-label, role属性の活用
- **フォーカス可視化**: `focus:ring`等で明示

## 🖼️ アイコン・画像利用ルール
- **FontAwesome**: アイコンは統一してFontAwesomeを使用
- **SVG**: ロゴや装飾はSVG推奨
- **画像最適化**: サイズ圧縮・alt属性必須

## 📝 デザイン管理・更新手順
- デザイン変更時は必ずPull Requestでレビュー
- FigmaやデザインツールのURL・バージョンをイシューやREADMEに記載
- 主要UI変更時はスクリーンショットをPRに添付

## 💡 サンプルコード
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
  登録
</button>

<input className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500" placeholder="金額" />
```

## 📚 参考
- [Tailwind CSS カラーパレット](https://tailwindcss.com/docs/customizing-colors)
- [WCAG コントラスト基準](https://webaim.org/resources/contrastchecker/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [FontAwesome](https://fontawesome.com/) 