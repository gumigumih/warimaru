# 技術スタック・アーキテクチャ

## フロントエンド・外部サービス・開発ツール

### 1. フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: ビルドツール
- **Tailwind CSS**: スタイリング
- **Redux Toolkit**: 状態管理

### 2. 外部サービス
- **GitHub**: ソースコード管理
- **GitHub Pages**: ホスティング
- **FontAwesome**: アイコンライブラリ
- **html2canvas**: 画像生成

### 3. 開発ツール
- **ESLint**: コード品質管理
- **Prettier**: コードフォーマット
- **GitHub CLI**: GitHub操作
- **Cursor**: AIペアプログラミング

## アプリケーション構成

### 1. ディレクトリ構造
```
src/
├── domain/              # 計算や集計など、UIに依存しない純粋なロジック
├── infrastructure/      # API通信やlocalStorageなど
├── store/               # Reduxストア
├── components/          # Reactコンポーネント
├── assets/              # 静的ファイル
├── main.tsx            # エントリーポイント
└── index.css           # グローバルスタイル
```

### 2. コンポーネント階層
```
App
├── InputForm
│   ├── PersonNameEditor
│   └── PersonPaymentForm
│       ├── SimplePaymentInput
│       └── PaymentRow
├── ResultScreen
│   ├── PaymentStatus
│   ├── PaymentDetails
│   └── TransferList
└── Calculator (モーダル)
```

### 3. 状態管理
- **Redux Toolkit**: グローバル状態管理
- **useState**: ローカル状態管理
- **useEffect**: 副作用管理

## デザインシステム

### 1. カラーパレット
```css
/* プライマリカラー */
--primary: #3B82F6;      /* 青 */
--primary-dark: #1D4ED8; /* 濃い青 */

/* セカンダリカラー */
--secondary: #6B7280;    /* グレー */
--secondary-light: #F3F4F6; /* 薄いグレー */

/* アクセントカラー */
--accent: #10B981;       /* 緑 */
--accent-red: #EF4444;   /* 赤 */
--accent-orange: #F59E0B; /* オレンジ */
```

### 2. タイポグラフィ
```css
/* フォントファミリー */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* フォントサイズ */
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
text-2xl: 1.5rem;    /* 24px */
```

### 3. スペーシング
```css
/* マージン・パディング */
space-1: 0.25rem;    /* 4px */
space-2: 0.5rem;     /* 8px */
space-3: 0.75rem;    /* 12px */
space-4: 1rem;       /* 16px */
space-6: 1.5rem;     /* 24px */
space-8: 2rem;       /* 32px */
```

## データ管理

### 1. データ構造
```typescript
// domain/entities/ 配下で定義
interface Person {
  id: string;
  name: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  description: string;
}

// store/ 配下で定義
interface AppState {
  people: Person[];
  nonPayingCount: number;
  isDetailMode: boolean;
}
```

### 2. 状態更新パターン
- **Immutable Update**: Redux Toolkitのimmer使用
- **Normalized State**: 正規化された状態管理
- **Optimistic Updates**: 楽観的更新

### 3. データ永続化
- **LocalStorage**: ユーザー設定の保存（infrastructure/配下で実装）
- **SessionStorage**: 一時的なデータ保存（infrastructure/配下で実装）
- **IndexedDB**: 大量データの保存（将来対応、infrastructure/配下で実装）

## 外部API統合

### 1. 現在の統合
- **FontAwesome**: アイコン表示（components/配下で使用）
- **html2canvas**: 画像生成（infrastructure/配下で実装）
- **GitHub API**: イシュー管理（infrastructure/配下で実装）

### 2. 将来の統合予定
- **Analytics**: ユーザー行動分析（infrastructure/配下で実装）
- **Error Tracking**: エラー監視（infrastructure/配下で実装）
- **Performance Monitoring**: パフォーマンス監視（infrastructure/配下で実装）

### 3. API設計原則
- **RESTful**: RESTful API設計
- **Type Safety**: 型安全なAPI呼び出し
- **Error Handling**: 適切なエラーハンドリング

## ビルド・デプロイ

### 1. ビルド設定
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
});
```

### 2. デプロイパイプライン
- **GitHub Actions**: CI/CD自動化
- **GitHub Pages**: 静的サイトホスティング
- **自動デプロイ**: mainブランチマージ時

### 3. 環境設定
```bash
# 開発環境
npm run dev

# 本番ビルド
npm run build

# プレビュー
npm run preview
```

## パフォーマンス・セキュリティ

### 1. パフォーマンス最適化
- **Code Splitting**: 動的インポート
- **Lazy Loading**: 遅延読み込み
- **Memoization**: React.memo, useMemo, useCallback
- **Bundle Optimization**: バンドルサイズ最適化

### 2. セキュリティ対策
- **Content Security Policy**: CSP設定
- **XSS Prevention**: クロスサイトスクリプティング対策
- **Input Validation**: 入力値検証
- **HTTPS**: 暗号化通信

### 3. アクセシビリティ
- **ARIA**: アクセシビリティ属性
- **Keyboard Navigation**: キーボード操作対応
- **Screen Reader**: スクリーンリーダー対応
- **Color Contrast**: 色のコントラスト確保

## 開発環境設定

### 1. 必須ツール
```bash
# Node.js (v18以上)
node --version

# npm (v9以上)
npm --version

# Git
git --version

# GitHub CLI
gh --version
```

### 2. 推奨エディタ設定
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 3. 開発用スクリプト
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext ts,tsx --fix"
  }
}
``` 