import React, { useState } from 'react';
import { SavedCharacterCard } from '../types';
import { Search, Tag, Heart, Copy, Trash2, FileCode, Sparkles, Filter, Layers, Download, Check } from 'lucide-react';

interface CharacterGalleryProps {
  characters: SavedCharacterCard[];
  onToggleFavorite: (id: string) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  characters,
  onToggleFavorite,
  onDeleteCharacter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeJsonModal, setActiveJsonModal] = useState<SavedCharacterCard | null>(null);

  // Filtered Characters
  const filteredCharacters = characters.filter(card => {
    const { matrix_status, character_profile, ai_prompts } = card.result;

    const matchesSearch =
      character_profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character_profile.reading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character_profile.proper_noun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ai_prompts.main_visual.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = selectedMode ? matrix_status.design_mode === selectedMode : true;

    return matchesSearch && matchesMode;
  });

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAllJSON = () => {
    const exportData = filteredCharacters.map(c => c.result);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `charaMaker_all_characters_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadSingleJSON = (card: SavedCharacterCard) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(card.result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${card.result.character_profile.name}_prompts.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getModeBadgeClass = (mode: string) => {
    if (mode === '1-2yo') return 'badge-cyan';
    if (mode === '3-4yo') return 'badge-purple';
    return 'badge-emerald';
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: '100vh' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
            生成キャラクターギャラリー
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            年齢マトリクス別キャラクター設定・プロンプト・3面図シートの一括管理 ＆ JSONエクスポート
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleDownloadAllJSON}>
            <Download size={16} />
            全プロンプトJSON一括出力
          </button>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-glass"
              style={{ paddingLeft: '36px' }}
              placeholder="キャラ名、固有名詞、プロンプト検索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mode Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '8px' }}>
          <Filter size={14} />
          <span>年齢モード絞り込み:</span>
        </div>

        <button
          className={`chip ${selectedMode === null ? 'active' : ''}`}
          onClick={() => setSelectedMode(null)}
        >
          すべて ({characters.length})
        </button>

        <button
          className={`chip ${selectedMode === '1-2yo' ? 'active' : ''}`}
          onClick={() => setSelectedMode(selectedMode === '1-2yo' ? null : '1-2yo')}
        >
          1-2歳モード (乳幼児)
        </button>

        <button
          className={`chip ${selectedMode === '3-4yo' ? 'active' : ''}`}
          onClick={() => setSelectedMode(selectedMode === '3-4yo' ? null : '3-4yo')}
        >
          3-4歳モード (幼児)
        </button>

        <button
          className={`chip ${selectedMode === '5-6yo' ? 'active' : ''}`}
          onClick={() => setSelectedMode(selectedMode === '5-6yo' ? null : '5-6yo')}
        >
          5-6歳モード (キッズ)
        </button>
      </div>

      {/* Grid Display */}
      {filteredCharacters.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <Sparkles size={48} color="var(--accent-purple)" style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>該当するキャラクターが見つかりません</h3>
          <p style={{ fontSize: '0.9rem' }}>Chara Chat やマトリクススタジオから新しいキャラクターを作成してください。</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredCharacters.map(card => {
            const { matrix_status, character_profile, ai_prompts } = card.result;

            return (
              <div key={card.id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Image Preview Container */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={card.imageUrl || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80'}
                    alt={character_profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,12,21,0.95), transparent 60%)' }} />

                  {/* Top Action Buttons */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onToggleFavorite(card.id)}
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={16} color={card.isFavorite ? 'var(--accent-pink)' : '#ffffff'} fill={card.isFavorite ? 'var(--accent-pink)' : 'none'} />
                    </button>
                  </div>

                  {/* Bottom Overlay Title */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                      <span className={`badge ${getModeBadgeClass(matrix_status.design_mode)}`}>
                        {matrix_status.target_age}歳 ({matrix_status.design_mode})
                      </span>
                      <span className="badge badge-cyan">
                        モチーフ: {character_profile.proper_noun}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                      {character_profile.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      読み: {character_profile.reading}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.75rem', marginBottom: '2px' }}>世界観</div>
                    {character_profile.world_view}
                  </div>

                  {/* Main Visual Prompt Box */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '4px' }}>
                      ① メインプロンプト
                    </div>
                    <div
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 10px',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-main)',
                        lineHeight: 1.3,
                        maxHeight: '48px',
                        overflow: 'hidden'
                      }}
                    >
                      {ai_prompts.main_visual}
                    </div>
                  </div>

                  {/* 3面図 Turnaround Sheet Prompt Box */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '4px' }}>
                      ② 3面図シートプロンプト
                    </div>
                    <div
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 10px',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#c084fc',
                        lineHeight: 1.3,
                        maxHeight: '48px',
                        overflow: 'hidden'
                      }}
                    >
                      {ai_prompts.turnaround_sheet}
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{card.createdAt}</span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleDownloadSingleJSON(card)}
                        title="JSONダウンロード"
                      >
                        <Download size={14} />
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        onClick={() => setActiveJsonModal(card)}
                      >
                        <FileCode size={14} />
                        JSON
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        onClick={() => handleCopyPrompt(card.id, ai_prompts.main_visual)}
                      >
                        <Copy size={14} />
                        {copiedId === card.id ? 'コピー済' : 'メイン'}
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 8px', color: '#ff4d4d', borderColor: 'rgba(255,77,77,0.3)' }}
                        onClick={() => onDeleteCharacter(card.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JSON Viewer Modal */}
      {activeJsonModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setActiveJsonModal(null)}
        >
          <div
            className="glass-panel"
            style={{ width: '640px', maxHeight: '80vh', padding: '24px', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }} className="gradient-text">
                JSON データ出力 - {activeJsonModal.result.character_profile.name}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-primary"
                  style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                  onClick={() => handleDownloadSingleJSON(activeJsonModal)}
                >
                  <Download size={14} />
                  JSONダウンロード
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '4px 10px' }}
                  onClick={() => setActiveJsonModal(null)}
                >
                  閉じる
                </button>
              </div>
            </div>

            <pre
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--accent-cyan)',
                overflowX: 'auto'
              }}
            >
              {JSON.stringify(activeJsonModal.result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
