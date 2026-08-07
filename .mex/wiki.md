# 🎨 charaMaker - Codebase Knowledge Graph & Wiki (.mex)

## 1. Architecture Overview (アーキテクチャ全体像)
- **Core App (`src/App.tsx`)**: charaMaker のメインルートビュー。ナラティブエディタを排除し、Chara Chat (`chara-chat`), Matrix Studio (`matrix-studio`), History (`history`), Gallery (`gallery`), Mex Knowledge (`mex-knowledge`), Settings (`settings`) のビューおよびスレッド・カード状態を一括管理。
- **Chara Chat (`src/components/CharaChatApp.tsx`)**: 年齢スライダー (1.0〜6.0歳) とモチーフ固有名詞調整バーを備えた特化型 AI 対話チャット。メッセージ送信時にリアルタイムでマトリクス計算を実行し、設定シート・メインプロンプト・3面図プロンプトをチャットカード形式で描画。
- **Chara History (`src/components/CharaHistoryView.tsx`)**: 過去のチャットセッション、作成されたキャラクター、プロンプト生成過程をスレッドタイムライン形式で閲覧・再開。
- **Character Gallery (`src/components/CharacterGallery.tsx`)**: 生成キャラクターカード（年齢モードバッジ `1-2yo`, `3-4yo`, `5-6yo`、固有名詞タグ、メインプロンプト、3面図プロンプト、JSON出力）の閲覧・検索・コピー。
- **Matrix Engine (`src/utils/matrixEngine.ts`)**: ターゲット年齢から X軸ウェイト ($X\_weight$) を算出し、6大ベクトルパラメーター・ネーミング・メイン＆3面図プロンプトを合成するコアユーティリティ。

## 2. Agent & Knowledge Integration
- **z8b ComfyUI & API Wrapper**: RTX 5090 実機上の FastAPI Wrapper サーバー連携。認証トークン `z8b_token.txt` (`Qv6abBo5Ng1Q7HK...`) を使用。
  - テキストエンコーダー: `Qwen3-VL-8B-Instruct-abliterated-v1.Q4_K_M.gguf`（年齢語の誤ブロック回避版）
  - 生成モデル: `flux1-dev.safetensors` / `Ideogram4PromptBuilderKJ` / `ComfyUI-PuLID-Flux`（キャラクター一貫性保持）
  - インフラ: `comfyui_self_healing_daemon` による自動復旧デーモン常駐
- **Mex Agent Bridge**: `.mex/graph.json` および `.mex/wiki.md` を常時追跡し、AI コード生成・最適化時の構造化コンテキストとして利用。
- **Telemetry Configuration**: `MEX_TELEMETRY=0` セキュリティポリシーを維持。
