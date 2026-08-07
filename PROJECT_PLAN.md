# 🎨 charaMaker - AI キャラクターデザイン＆マトリクス管理スタジオ 開発計画書

## 1. プロジェクト概要 (Overview)
**charaMaker** は、ターゲット年齢（1.0〜6.0歳）とモチーフ固有名詞を入力パラメーターとし、未就学児向けデザイン理論（6大ベクトル×マトリクス）に基づいてキャラクター設定・世界観・AI生成プロンプト（メイン画像 / 3面図）を自動構築する次世代特化型 AI アプリケーションです。
ナラティブエディタを廃止し、**Chara Chat (対話チャット)**、**対話・生成履歴 (History)**、**キャラクターギャラリー (Gallery)**、および **マトリクススタジオ (Matrix Studio)** に特化した構成としています。

---

## 2. コア機能 (Core Features)
- **Chara Chat (`CharaChatApp.tsx`)**:
  - ターゲット年齢スライダー & 固有名詞クイック設定バーを搭載した特化型 AI 対話チャット。
  - メッセージ送信時にリアルタイムでマトリクス計算 ($X\_weight$, 6大ベクトル) を実行し、キャラクター設定シート、メインプロンプト、3面図プロンプトを会話ログ内にレンダリング。
  - 送信時のメッセージ＆生成物のスレッド自動履歴化。
- **対話・生成履歴 (`CharaHistoryView.tsx`)**:
  - 過去のチャットセッション、ターゲット年齢設定、生成されたキャラクタープロファイル・プロンプトをスレッドタイムライン形式で閲覧・再開。
- **キャラギャラリー (`CharacterGallery.tsx`)**:
  - 保存されたキャラクターカード（1-2yo, 3-4yo, 5-6yo 年齢バッジ、固有名詞タグ、メインプロンプト、3面図プロンプト、JSON出力）のタグソート・フリーワード検索。
- **マトリクススタジオ (`MatrixStudio.tsx`)**:
  - 年齢スライダー & 固有名詞入力・6大ベクトル適用パラメーターの可視化＆直接調整エディタ。
- **Mex Agent コードベースナレッジ (`MexKnowledgeView.tsx`)**:
  - `.mex/graph.json` および `.mex/wiki.md` を可視化・更新するコード構造依存関係グラフ。

---

## 3. アーキテクチャ図 (Architecture)

```
[ Frontend: React + TS + Vite ]
   │  ├─ Chara Chat (対話型キャラクター作成 & 3面図プロンプト生成)
   │  ├─ Chara History (スレッドタイムライン形式の対話・生成履歴)
   │  ├─ Character Gallery (年齢モード別カード一覧 / プロンプト＆3面図コピー / JSON)
   │  ├─ Matrix Studio (年齢・固有名詞マトリクスパラメーター直接編集)
   │  └─ Mex Agent Knowledge Inspector (.mex 構造・Wiki 可視化)
   │
   ▼ (Context & Knowledge)
[ Mex Agent Knowledge Base (`.mex/wiki.md`, `.mex/graph.json`) ]
```

---

## 5. z8b ComfyUI & MCP 連携仕様 (z8b MCP Integration)
- **基盤環境**: NVIDIA RTX 5090 搭載機 (`z8b`)
- **通信アーキテクチャ (MCP 方式)**:
  - 9000番 REST 直叩きではなく、**MCP 経由（3大ツール: 1.生成投入 / 2.状態照会 / 3.取り消し）** で運用。
- **認証**: `z8b_token.txt` (`Qv6abBo5...` 作業用MCPトークン)
- **モデル**: `Qwen3-VL-8B-Instruct-abliterated-v1.Q4_K_M.gguf` (年齢語誤ブロック回避版) / `flux1-dev` / `Ideogram4PromptBuilderKJ` / `ComfyUI-PuLID-Flux`

---

## 6. ファイル構成 (Directory Map)
- `f:/charaMaker/src/App.tsx` - ルートビュー＆Chara Chat / History / Gallery 統合状態
- `f:/charaMaker/src/components/CharaChatApp.tsx` - 特化型 AI チャット
- `f:/charaMaker/src/components/CharaHistoryView.tsx` - スレッド対話履歴
- `f:/charaMaker/src/components/CharacterGallery.tsx` - ギャラリー
- `f:/charaMaker/src/components/MatrixStudio.tsx` - マトリクスエディタ
- `f:/charaMaker/src/components/MexKnowledgeView.tsx` - Mex Agent インスペクター
- `f:/charaMaker/src/utils/matrixEngine.ts` - コア計算ロジック
- `f:/charaMaker/.mex/wiki.md` - コードナレッジドキュメント
- `f:/charaMaker/.mex/graph.json` - 依存関係グラフ定義
