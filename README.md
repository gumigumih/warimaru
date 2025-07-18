# わりまる

簡単・正確な割り勘計算アプリ

![わりまる](https://warimaru.meggumi.com/ogp.png)

## 📖 概要

わりまるは、飲み会やイベントでの割り勘計算を簡単に行える Web アプリケーションです。

- ✅ 人物数制限なし
- ✅ 支払いをしていない人も含めた正確な計算
- ✅ 詳細モード・シンプルモード対応
- ✅ 高品質な画像保存
- ✅ レスポンシブデザイン

## 🚀 デモ

[https://warimaru.meggumi.com](https://warimaru.meggumi.com)

## ✨ 主な機能

### 人物管理

- 支払いをした人を自由に登録・削除
- 人物数制限なし（A〜Z、AA〜ZZ... のように自動命名）

### 参加者管理

- 支払いをしていない人数を別途設定
- 総参加者数での正確な割り勘計算

### 支払い入力

- **詳細モード**: 項目別に入力（金額 + 説明）
- **シンプルモード**: 合計金額のみ入力

### 精算表示

- 最適な送金方法を自動算出
- 支払いをしていない人も含めて表示
- 見やすいグループ化表示

### 画像保存

- 高解像度での画像保存
- タイムスタンプ付きファイル名
- わりまるロゴ付き

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **状態管理**: Redux Toolkit
- **スタイリング**: Tailwind CSS
- **アイコン**: FontAwesome
- **数値入力**: Cleave.js
- **画像保存**: html2canvas
- **ビルドツール**: Vite

## 📦 インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/warimaru.git
cd warimaru

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## 🚀 ビルド

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## 📱 対応ブラウザ

- Chrome (推奨)
- Firefox
- Safari
- Edge

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📋 リリースノート

最新の更新内容や機能追加については [CHANGELOG.md](CHANGELOG.md) をご覧ください。

### 更新履歴

#### v1.2.0 (2024-12-01)

- ミニマムクリーンアーキテクチャの採用
- UIとロジックの分離（domain/usecases）
- 外部依存の分離（infrastructure）
- 型定義の整理（domain/entities）
- 開発ルールの整備（.cursor/rules/）
- レビュープロセスの改善（ビルドチェック追加）
- 保守性・拡張性の大幅向上

#### v1.1.0 (2024-12-01)

- 人物数制限の撤廃（6 人 → 無制限）
- 参加者管理機能の追加
- 精算表示の大幅改善
- UI/UX の改善
- 画像保存機能の強化
- 計算ロジックの最適化
- プライバシーポリシーモーダルの追加
- MIT ライセンスファイルの追加
- 法的対応の完了

#### v1.0.0 (2024-12-01)

- 初回リリース
- 基本機能の実装
- 6 人までの人物管理
- 基本的な精算機能

## 🔗 リンク

- **Web サイト**: [https://warimaru.meggumi.com](https://warimaru.meggumi.com)
- **リリースノート**: [CHANGELOG.md](CHANGELOG.md)

---

**わりまる** - 簡単・正確な割り勘計算アプリ
