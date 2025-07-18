# 開発ワークフロー

## イシュー選択からブランチ作成

### 1. イシュー選択
```bash
# 現在のイシュー状況を確認
gh issue list --state open | cat

# マイルストーン別のイシュー確認
gh issue list --milestone "v1.2.0" | cat
```

### 2. ブランチ作成
```bash
# イシュー番号を含むブランチ名で作成
git checkout -b feature/issue-[番号]-[機能名]
# 例: git checkout -b feature/issue-12-calculator-modal
```

### 3. 作業開始
- イシューを「In Progress」に移動
- イシューコメントで作業開始を報告

## 開発・実装・レビュー・マージ

### 1. 開発中
- 定期的にイシューコメントで進捗を報告
- 問題が発生したら即座にイシューに記載
- AIアシスタントに「このルールに従って進めて」と指示

### 2. 実装完了
- 実装完了後は必ず実機確認を実施
- イシューコメントに実装内容を記録
- スクリーンショットや動画で動作確認を記録

### 3. プルリクエスト作成
```bash
# コミットとプッシュ
git add .
git commit -m "feat: 機能名 (Issue #[番号])"
git push origin [ブランチ名]

# プルリクエスト作成
gh pr create --title "feat: 機能名 (Issue #[番号])" --body "Closes #[番号]"
```

### 4. レビュー・マージ
- プルリクエストでレビューを実施
- 承認後、マージを実行
- マージ後、イシューが自動でクローズされることを確認

## 実機確認とイシュークローズ

### 1. 実機確認
- マージ後、本番環境での動作確認
- 全ての機能が正常に動作することを確認
- 問題があれば即座に新しいイシューを作成

### 2. イシュークローズ
- 実機確認完了後、イシューをクローズ
- 完了したイシューは「Done」ラベルを付与
- リリースノートに変更内容を記録

## ファイル構成ルール

### 1. コンポーネント配置
```
src/
├── components/
│   ├── input/          # 入力関連コンポーネント
│   ├── result/         # 結果表示関連コンポーネント
│   └── layout/         # レイアウト関連コンポーネント
├── store/              # Reduxストア
├── types.ts            # 型定義
└── main.tsx           # エントリーポイント
```

### 2. 命名規則
- コンポーネント: PascalCase（例: `Calculator.tsx`）
- ファイル: kebab-case（例: `person-payment-form.tsx`）
- フォルダ: kebab-case（例: `input/`）

## リリース管理

### 1. リリース準備
- マイルストーンの全イシューが完了していることを確認
- 実機確認で全機能が正常に動作することを確認
- リリースノートの更新

### 2. リリース実行
```bash
# タグ作成
git tag v1.2.0
git push origin v1.2.0

# GitHubリリース作成
gh release create v1.2.0 --title "v1.2.0" --notes "リリースノート内容"
```

### 3. リリース後
- マイルストーンをクローズ
- 次のバージョンのマイルストーンを作成
- 開発チームへの報告 