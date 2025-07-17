# コーディング規約

## TypeScript・React規約

### 1. 基本原則
- **型安全性を最優先**: 全ての変数・関数・コンポーネントに型を明示
- **関数型プログラミング**: 可能な限り純粋関数を使用
- **コンポーネントの単一責任**: 1つのコンポーネントは1つの責任のみ

### 2. コンポーネント規約
```typescript
// 良い例
interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (result: string) => void;
  initialValue?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({
  isOpen,
  onClose,
  onCalculate,
  initialValue = '',
}) => {
  // 実装
};
```

### 3. フック使用規約
- カスタムフックは `use` プレフィックスを使用
- フックはコンポーネントの最上位で呼び出す
- 依存配列は必ず指定する

```typescript
// 良い例
const useCalculator = (initialValue: string) => {
  const [display, setDisplay] = useState(initialValue);
  
  useEffect(() => {
    setDisplay(initialValue);
  }, [initialValue]);
  
  return { display, setDisplay };
};
```

## 命名規則

### 1. 変数・関数
- **camelCase**: 変数、関数、メソッド
- **PascalCase**: コンポーネント、型、インターフェース
- **UPPER_SNAKE_CASE**: 定数

```typescript
// 良い例
const handleCalculatorResult = (result: string) => {
  // 実装
};

const MAX_PAYMENT_AMOUNT = 1000000;
```

### 2. ファイル・フォルダ
- **kebab-case**: ファイル名、フォルダ名
- **PascalCase**: コンポーネントファイル

```
src/
├── components/
│   ├── calculator/
│   │   ├── Calculator.tsx
│   │   └── calculator-utils.ts
│   └── payment-input/
│       ├── PaymentInput.tsx
│       └── payment-input-types.ts
```

### 3. 型定義
- **PascalCase**: 型名、インターフェース名
- **Iプレフィックス**: インターフェース（オプション）

```typescript
interface PaymentData {
  amount: number;
  description: string;
}

type PaymentStatus = 'pending' | 'completed' | 'failed';
```

## テスト方針

### 1. テスト対象
- **ユニットテスト**: ユーティリティ関数、カスタムフック
- **コンポーネントテスト**: 重要なUIコンポーネント
- **統合テスト**: ユーザーフロー全体

### 2. テスト命名
```typescript
describe('Calculator', () => {
  it('should display initial value correctly', () => {
    // テスト実装
  });
  
  it('should calculate addition correctly', () => {
    // テスト実装
  });
});
```

### 3. テスト実行
```bash
# テスト実行
npm test

# カバレッジ確認
npm run test:coverage
```

## ドキュメント管理

### 1. コメント規約
- **JSDoc**: 公開API、複雑なロジック
- **インラインコメント**: 非自明な処理のみ

```typescript
/**
 * 電卓の計算結果を処理する
 * @param result - 計算結果の文字列
 * @param description - 項目の説明（オプション）
 */
const handleCalculatorResult = (result: string, description?: string) => {
  // 実装
};
```

### 2. README更新
- 新機能追加時は必ずREADMEを更新
- 使用方法、設定方法を明記
- スクリーンショットや動画で動作を説明

### 3. 型定義ドキュメント
- 複雑な型定義にはコメントを追加
- 使用例を含める

```typescript
/**
 * 支払い情報の型定義
 * @example
 * ```typescript
 * const payment: PaymentData = {
 *   amount: 1000,
 *   description: 'ランチ代'
 * };
 * ```
 */
interface PaymentData {
  /** 支払い金額（円） */
  amount: number;
  /** 支払い項目の説明 */
  description: string;
}
```

## 開発ツール

### 1. ESLint設定
- TypeScript対応のESLintを使用
- 自動修正可能なルールは自動修正

```bash
# リント実行
npm run lint

# 自動修正
npm run lint:fix
```

### 2. Prettier設定
- コードフォーマットを統一
- コミット前に自動フォーマット

```bash
# フォーマット実行
npm run format

# フォーマットチェック
npm run format:check
```

### 3. TypeScript設定
- 厳密な型チェックを有効化
- 未使用変数・インポートの警告

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## パフォーマンス最適化

### 1. メモ化
- 重い計算は `useMemo` でメモ化
- コールバック関数は `useCallback` でメモ化

```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  handleAction();
}, []);
```

### 2. 遅延読み込み
- 大きなコンポーネントは遅延読み込み
- ルートベースのコード分割

```typescript
const LazyComponent = lazy(() => import('./LazyComponent'));
```

### 3. バンドルサイズ最適化
- 未使用の依存関係を削除
- ツリシェイキングを活用
- 動的インポートでコード分割 