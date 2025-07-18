# アーキテクチャルール

## ミニマムクリーンアーキテクチャ

### ディレクトリ構成
```
src/
├── domain/          # 計算や集計など、UIに依存しない純粋なロジック
├── infrastructure/  # API通信やlocalStorageなど
├── store/          # ReduxやContextなど
└── components/     # UI部品
```

### 粒度の目安

#### domain/
- エンティティ（Person, Dish, Paymentなど）
- 計算処理（calculatePayments, calculateTransfersなど）
- ビジネスロジック
- UIに依存しない純粋な関数

#### infrastructure/
- API通信
- localStorage操作
- 外部ライブラリとの連携
- ファイル操作

#### store/
- Redux store
- Context API
- 状態管理ロジック
- アクションとリデューサー

#### components/
- Reactコンポーネント
- UI部品
- プレゼンテーション層

### 実装方針

1. **UIとロジックの分離を最優先**
   - 計算処理はdomain/に配置
   - コンポーネントは表示に専念

2. **段階的な導入**
   - 最初は「UIとロジックの分離」だけ意識
   - usecase、repositoryは規模が大きくなってから導入

3. **依存関係の方向**
   - domain/ → infrastructure/ (依存しない)
   - components/ → domain/ (依存する)
   - store/ → domain/ (依存する)

### 命名規則

- domain/: `calculatePayments.ts`, `Person.ts`, `Payment.ts`
- infrastructure/: `apiClient.ts`, `localStorage.ts`
- store/: `peopleSlice.ts`, `paymentSlice.ts`
- components/: 既存のAtomic Designに従う

### 移行計画

1. 計算ロジックをdomain/に移動
2. 型定義をdomain/に整理
3. 状態管理をstore/に整理
4. 必要に応じてinfrastructure/を追加 