import React, { useState, useMemo } from 'react';
import { SavedCharacterCard, RenderStyle } from '../types';
import { generateMatrixCharacter } from '../utils/matrixEngine';
import { Sparkles, Copy, Save, Check, RefreshCw, Wand2, Sliders, Layers, FileCode, CheckCircle2, Info, Eye, Image as ImageIcon } from 'lucide-react';

interface MatrixStudioProps {
  onSaveCharacter: (card: SavedCharacterCard) => void;
}

export const MatrixStudio: React.FC<MatrixStudioProps> = ({ onSaveCharacter }) => {
  // Input Parameters
  const [targetAge, setTargetAge] = useState<number>(2.5);
  const [properNoun, setProperNoun] = useState<string>('ドーナツ');
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('2D_Flat');

  const [copiedJSON, setCopiedJSON] = useState(false);
  const [copiedMainPrompt, setCopiedMainPrompt] = useState(false);
  const [copiedTurnaroundPrompt, setCopiedTurnaroundPrompt] = useState(false);
  const [saved, setSaved] = useState(false);

  // Core Matrix Calculation Logic Output
  const generationResult = useMemo(() => {
    return generateMatrixCharacter(targetAge, properNoun, renderStyle);
  }, [targetAge, properNoun, renderStyle]);

  const { matrix_status, vector_parameters, character_profile, ai_prompts } = generationResult;

  // Preset Noun Quick Suggestions
  const PRESET_NOUNS = ['ドーナツ', 'パン', '車', '恐竜', 'おにぎり', 'ロケット', 'ねこ'];

  const handleCopyJSON = () => {
    const jsonOutput = {
      matrix_status,
      character_profile,
      ai_prompts
    };
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const handleCopyPrompt = (promptText: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const newCard: SavedCharacterCard = {
      id: `chara-${Date.now()}`,
      result: generationResult,
      imageUrl: '/outputs/task_6adfe5670057.png',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isFavorite: false
    };

    onSaveCharacter(newCard);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const getModeBadgeClass = (mode: string) => {
    if (mode === '1-2yo') return 'badge-cyan';
    if (mode === '3-4yo') return 'badge-purple';
    return 'badge-emerald';
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
              マトリクスキャラクター自動生成エンジン
            </h1>
            <span className={`badge ${getModeBadgeClass(matrix_status.design_mode)}`}>
              {matrix_status.design_mode} モード (X: {matrix_status.x_weight_percent}%)
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            ターゲット年齢 (1〜6歳) × 固有名詞マトリクス理論により、最適なデザイン構成・世界観・AIプロンプトをブレなく算出
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={handleCopyJSON}>
            {copiedJSON ? <Check size={16} color="var(--accent-emerald)" /> : <FileCode size={16} />}
            {copiedJSON ? 'JSON出力コピー完了' : 'JSONデータコピー'}
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'ギャラリー保存完了！' : 'キャラ保存'}
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '24px' }}>
        {/* Left Column: Input Parameters & Matrix Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Sliders size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>1. 入力パラメーター設定</h3>
            </div>

            {/* Target Age Slider */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  ターゲット年齢 (target_age)
                </label>
                <span className="badge badge-cyan" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                  {targetAge.toFixed(1)} 歳
                </span>
              </div>

              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={targetAge}
                onChange={e => setTargetAge(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  height: '6px',
                  borderRadius: '3px'
                }}
              />

              {/* X Weight Progress Indicator */}
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>1.0歳 (0%)</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>X_weight: {matrix_status.x_weight_percent}%</span>
                <span>6.0歳 (100%)</span>
              </div>
            </div>

            {/* Proper Noun Input */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                モチーフ固有名詞 (proper_noun)
              </label>
              <input
                className="input-glass"
                value={properNoun}
                onChange={e => setProperNoun(e.target.value)}
                placeholder="モチーフ単語 (例: ドーナツ, パン, 車)"
                style={{ fontSize: '1rem', fontWeight: 600 }}
              />

              {/* Quick Noun Presets */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {PRESET_NOUNS.map(n => (
                  <button
                    key={n}
                    className={`chip ${properNoun === n ? 'active' : ''}`}
                    onClick={() => setProperNoun(n)}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Style Toggle */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                描画スタイル (render_style / Z軸)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  className={`chip ${renderStyle === '2D_Flat' ? 'active' : ''}`}
                  onClick={() => setRenderStyle('2D_Flat')}
                  style={{ justifyContent: 'center', textAlign: 'center', padding: '10px' }}
                >
                  2D フラットイラスト
                </button>
                <button
                  className={`chip ${renderStyle === '3D_Clay' ? 'active' : ''}`}
                  onClick={() => setRenderStyle('3D_Clay')}
                  style={{ justifyContent: 'center', textAlign: 'center', padding: '10px' }}
                >
                  3D クレイアニメ風
                </button>
              </div>
            </div>
          </div>

          {/* 6-Vector Parameters Matrix Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Layers size={18} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>2. 6大ベクトル適用パラメーター</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>1. 幾何学・頭身</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.proportions}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-blue)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 700 }}>2. 色彩・輪郭線</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.colorsAndOutlines}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #c084fc' }}>
                <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700 }}>3. 顔構造・パーツ配置</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.faceStructure}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-emerald)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>4. モチーフ抽象度</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.abstraction}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-amber)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700 }}>5. ネーミング・描画ステップ</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.namingConvention}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-pink)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-pink)', fontWeight: 700 }}>6. 動き・ポーズ特性</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{vector_parameters.poseAndMovement}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Character Sheet & AI Prompts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Character Profile Output Sheet */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className={`badge ${getModeBadgeClass(matrix_status.design_mode)}`}>
                自動生成キャラクター設定シート
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>対象: {targetAge}歳 ({matrix_status.design_mode})</span>
            </div>

            {/* Character Header Info */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{character_profile.reading}</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '2px 0 6px 0' }}>
                {character_profile.name}
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-purple">モチーフ: {character_profile.proper_noun}</span>
                <span className="badge badge-cyan">スタイル: {renderStyle}</span>
              </div>
            </div>

            {/* Worldview & Story Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>【世界観の説明】</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {character_profile.world_view}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>【キャラクターの役割】</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {character_profile.story_role}
                </p>
              </div>
            </div>
          </div>

          {/* AI Prompts Box (Main Visual & 3面図 Sheet) */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wand2 size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI 画像生成用プロンプトセット</h3>
              </div>
            </div>

            {/* Main Visual Prompt */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  ① メインビジュアル生成プロンプト (Main Visual)
                </label>
                <button
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => handleCopyPrompt(ai_prompts.main_visual, setCopiedMainPrompt)}
                >
                  <Copy size={12} />
                  {copiedMainPrompt ? 'コピー済' : 'コピー'}
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#ffffff',
                  wordBreak: 'break-all',
                  lineHeight: 1.5
                }}
              >
                {ai_prompts.main_visual}
              </div>
            </div>

            {/* Turnaround Sheet Prompt (3面図) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                  ② 3面図（正面・側面・背面）生成プロンプト (Turnaround Sheet)
                </label>
                <button
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => handleCopyPrompt(ai_prompts.turnaround_sheet, setCopiedTurnaroundPrompt)}
                >
                  <Copy size={12} />
                  {copiedTurnaroundPrompt ? 'コピー済' : 'コピー'}
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: '#c084fc',
                  wordBreak: 'break-all',
                  lineHeight: 1.5
                }}
              >
                {ai_prompts.turnaround_sheet}
              </div>
            </div>

            {/* Negative Prompt */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                ③ ネガティブプロンプト (Negative Prompt)
              </label>
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                  wordBreak: 'break-all'
                }}
              >
                {ai_prompts.negative_prompt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
