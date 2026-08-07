export const INITIAL_CHAT_THREADS: ChatThreadHistory[] = [];

export const INITIAL_SAVED_CHARACTERS: SavedCharacterCard[] = [];

export const INITIAL_MEX_GRAPH: MexGraphData = {
  project: "charaMaker",
  version: "2.0.0",
  nodes: [
    { id: "App", path: "src/App.tsx", type: "component", description: "メインルーティング・Chara Chat & 履歴・ギャラリー統合管理" },
    { id: "CharaChatApp", path: "src/components/CharaChatApp.tsx", type: "component", description: "年齢・固有名詞調整バー付き特化型 AI チャットインタフェース" },
    { id: "CharaHistoryView", path: "src/components/CharaHistoryView.tsx", type: "component", description: "スレッド形式の生成・対話タイムライン履歴ビュー" },
    { id: "MatrixEngine", path: "src/utils/matrixEngine.ts", type: "utility", description: "ターゲット年齢×固有名詞 ➔ 6大ベクトル変換・プロンプト自動構築ロジック" },
    { id: "MatrixStudio", path: "src/components/MatrixStudio.tsx", type: "component", description: "年齢スライダー＆固有名詞入力・6大ベクトルマトリクス可視化エディタ" },
    { id: "CharacterGallery", path: "src/components/CharacterGallery.tsx", type: "component", description: "年齢モード別キャラクターカード＆プロンプト・3面図ギャラリー" },
    { id: "MexKnowledgeView", path: "src/components/MexKnowledgeView.tsx", type: "component", description: "Mex Agent コードベースナレッジグラフビューアー" },
    { id: "Sidebar", path: "src/components/Sidebar.tsx", type: "component", description: "Glassmorphism ナビゲーションサイドバー" },
    { id: "Types", path: "src/types.ts", type: "type-definition", "description": "年齢ウェイト・チャットスレッド・マトリクスステータス型定義" },
    { id: "DesignSystem", path: "src/index.css", type: "tokens", description: "アンビエントオーブ＆ガラスモルフィズム CSS トークン" }
  ]
};
