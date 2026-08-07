import { SavedCharacterCard, ChatThreadHistory, MexGraphData } from './types';
import { generateMatrixCharacter } from './utils/matrixEngine';

export const INITIAL_CHAT_THREADS: ChatThreadHistory[] = [
  {
    id: 'thread-001',
    title: '3.5歳 × 車 (てちてちバス)',
    targetAge: 3.5,
    properNoun: '車',
    createdAt: '2026-08-06 14:20',
    mainResult: generateMatrixCharacter(3.5, '車', '2D_Flat'),
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        timestamp: '14:20',
        text: '3.5歳向けに「車」をテーマにした親しみやすいキャラクターを作成して！',
        targetAge: 3.5,
        properNoun: '車'
      },
      {
        id: 'msg-2',
        sender: 'assistant',
        timestamp: '14:20',
        text: 'かしこまりました！ターゲット年齢 3.5歳（X_weight = 50% / 3-4歳モード）とモチーフ「車」のマトリクスから、キャラクター設定シートおよびメイン・3面図プロンプトを構築しました。',
        result: generateMatrixCharacter(3.5, '車', '2D_Flat')
      }
    ]
  },
  {
    id: 'thread-002',
    title: '2.0歳 × パン (パンぽん)',
    targetAge: 2.0,
    properNoun: 'パン',
    createdAt: '2026-08-06 14:15',
    mainResult: generateMatrixCharacter(2.0, 'パン', '3D_Clay'),
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        timestamp: '14:15',
        text: '2歳児向けの「パン」のぽよりんキャラクターを作って',
        targetAge: 2.0,
        properNoun: 'パン'
      },
      {
        id: 'msg-4',
        sender: 'assistant',
        timestamp: '14:15',
        text: 'ターゲット年齢 2.0歳（X_weight = 20% / 1-2歳乳幼児モード）を適用しました。丸みのある1.2頭身と超太線・オノマトペ「パンぽん」を自動生成しました。',
        result: generateMatrixCharacter(2.0, 'パン', '3D_Clay')
      }
    ]
  }
];

export const INITIAL_SAVED_CHARACTERS: SavedCharacterCard[] = [
  {
    id: 'chara-001',
    result: generateMatrixCharacter(3.5, '車', '2D_Flat'),
    imageUrl: '/outputs/task_6adfe5670057.png',
    createdAt: '2026-08-06 14:20',
    isFavorite: true
  },
  {
    id: 'chara-002',
    result: generateMatrixCharacter(2.0, 'パン', '3D_Clay'),
    imageUrl: '/outputs/task_0d48b65db3a0.png',
    createdAt: '2026-08-06 14:15',
    isFavorite: true
  },
  {
    id: 'chara-003',
    result: generateMatrixCharacter(5.5, 'ドーナツ', '2D_Flat'),
    imageUrl: '/outputs/task_bece06d24a76.png',
    createdAt: '2026-08-06 14:10',
    isFavorite: false
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
