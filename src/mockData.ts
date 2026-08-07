import { SavedCharacterCard, ChatThreadHistory, MexGraphData } from './types';
import { generateMatrixCharacter } from './utils/matrixEngine';

export const INITIAL_CHAT_THREADS: ChatThreadHistory[] = [
  {
    id: 'thread-shark-001',
    title: '4.0歳 × サメ (サメぽん)',
    targetAge: 4.0,
    properNoun: 'サメ',
    createdAt: '2026-08-07 22:50',
    mainResult: generateMatrixCharacter(4.0, 'サメ', '2D_Flat'),
    messages: [
      {
        id: 'msg-shark-1',
        sender: 'user',
        timestamp: '22:50',
        text: '4歳向けに「サメ」をテーマにした親しみやすいマスコットキャラクターを作成して！',
        targetAge: 4.0,
        properNoun: 'サメ'
      },
      {
        id: 'msg-shark-2',
        sender: 'assistant',
        timestamp: '22:50',
        text: 'ターゲット「4.0歳 × サメ」から、2K高画質の可愛いマスコット「サメぽん」を生成しました。',
        result: generateMatrixCharacter(4.0, 'サメ', '2D_Flat'),
        imageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FnkCNpYwkVwIsfR6VJe9XctKRi/hf_20260807_134434_344f9ca5-bf60-4ffc-82ee-c4d5fff471e5.png'
      }
    ]
  }
];

export const INITIAL_SAVED_CHARACTERS: SavedCharacterCard[] = [
  {
    id: 'chara-shark-001',
    result: generateMatrixCharacter(4.0, 'サメ', '2D_Flat'),
    imageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_3FnkCNpYwkVwIsfR6VJe9XctKRi/hf_20260807_134434_344f9ca5-bf60-4ffc-82ee-c4d5fff471e5.png',
    createdAt: '2026-08-07 22:50',
    isFavorite: true
  }
];

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
