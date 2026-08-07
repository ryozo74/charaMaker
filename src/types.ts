export type ViewMode = 
  | 'chara-chat' 
  | 'matrix-studio' 
  | 'history' 
  | 'gallery' 
  | 'mex-knowledge' 
  | 'settings';

export type DesignMode = '1-2yo' | '3-4yo' | '5-6yo';

export type RenderStyle = '2D_Flat' | '3D_Clay';

export type EngineProvider = 'z8b_comfyui' | 'higgsfield';

export interface MatrixStatus {
  target_age: number;
  x_weight_percent: number;
  design_mode: DesignMode;
  render_style: RenderStyle;
}

export interface VectorParameters {
  proportions: string;          // 1. 幾何学・頭身
  colorsAndOutlines: string;    // 2. 色彩・輪郭
  faceStructure: string;        // 3. 顔構造
  abstraction: string;          // 4. モチーフ抽象度
  namingConvention: string;     // 5. ネーミング・描画
  poseAndMovement: string;      // 6. 動き・ポーズ
}

export interface CharacterProfileOutput {
  name: string;
  reading: string;
  proper_noun: string;
  world_view: string;
  story_role: string;
}

export interface AiPrompts {
  main_visual: string;
  turnaround_sheet: string;
  negative_prompt: string;
}

export interface GenerationResult {
  matrix_status: MatrixStatus;
  vector_parameters: VectorParameters;
  character_profile: CharacterProfileOutput;
  ai_prompts: AiPrompts;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text?: string;
  result?: GenerationResult;
  targetAge?: number;
  properNoun?: string;
  imageUrl?: string;
}

export interface ChatThreadHistory {
  id: string;
  title: string;
  updatedAt?: string;
  messages: ChatMessage[];
  targetAge?: number;
  properNoun?: string;
  createdAt?: string;
  mainResult?: GenerationResult;
}

export interface SavedCharacterCard {
  id: string;
  result: GenerationResult;
  imageUrl: string;
  turnaroundImageUrl?: string;
  createdAt: string;
  isFavorite: boolean;
  engineProvider?: EngineProvider;
}

export interface MexGraphNode {
  id: string;
  label?: string;
  type?: 'component' | 'data' | 'type-definition' | 'server' | 'tokens' | string;
  category?: string;
  path?: string;
  docPath?: string;
  summary?: string;
  description?: string;
  dependencies?: string[];
  details?: string;
}

export interface MexGraphData {
  project?: string;
  version?: string;
  nodes: MexGraphNode[];
  edges?: { source: string; target: string; relation: string }[];
}
