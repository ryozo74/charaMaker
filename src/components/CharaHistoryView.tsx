import React, { useState } from 'react';
import { ChatThreadHistory, SavedCharacterCard } from '../types';
import { MessageSquare, Clock, Copy, Save, Check, ExternalLink, Sparkles, Filter, ChevronRight, User, Bot } from 'lucide-react';

interface CharaHistoryViewProps {
  threads: ChatThreadHistory[];
  onSelectThread: (threadId: string) => void;
  onSaveToGallery: (card: SavedCharacterCard) => void;
}

export const CharaHistoryView: React.FC<CharaHistoryViewProps> = ({
  threads,
  onSelectThread,
  onSaveToGallery
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const selectedThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCard = (msgId: string, result: any) => {
    const card: SavedCharacterCard = {
      id: `chara-${Date.now()}`,
      result,
      imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isFavorite: false
    };
    onSaveToGallery(card);
    setSavedId(msgId);
    setTimeout(() => setSavedId(null), 2500);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
            対話・生成スレッド履歴
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            過去の Chara Chat セッション、ターゲット年齢、固有名詞変換ログをタイムライン形式で管理
          </p>
        </div>
      </div>

      {/* Grid Layout: Left Threads List, Right Active Thread Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        {/* Left Column: Threads Archive List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {threads.map(thread => (
            <div
              key={thread.id}
              onClick={() => setSelectedThreadId(thread.id)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '16px',
                cursor: 'pointer',
                background: selectedThreadId === thread.id ? 'linear-gradient(135deg, rgba(0,242,254,0.18), rgba(127,0,255,0.18))' : 'rgba(22,28,48,0.5)',
                borderColor: selectedThreadId === thread.id ? 'var(--accent-cyan)' : 'var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                  {thread.targetAge}歳 ({thread.properNoun})
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {thread.createdAt}
                </span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                {thread.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{thread.messages.length} メッセージ</span>
                <ChevronRight size={16} color="var(--accent-cyan)" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Selected Thread Conversation Inspector */}
        <div>
          {selectedThread ? (
            <div className="glass-panel" style={{ padding: '24px' }}>
              {/* Thread Header Inspector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                    <span className="badge badge-purple">スレッドID: {selectedThread.id}</span>
                    <span className="badge badge-cyan">ターゲット: {selectedThread.targetAge}歳</span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedThread.title}
                  </h2>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => onSelectThread(selectedThread.id)}
                >
                  <MessageSquare size={16} />
                  このスレッドでチャット再開
                </button>
              </div>

              {/* Timeline Messages Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedThread.messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {msg.sender === 'user' ? <User size={16} color="#ffffff" /> : <Bot size={16} color="#ffffff" />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: msg.sender === 'user' ? 'var(--accent-purple)' : 'var(--accent-cyan)' }}>
                          {msg.sender === 'user' ? 'ユーザー' : 'Chara Chat アシスタント'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {msg.text}
                      </p>

                      {msg.result && (
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                              {msg.result.character_profile.name}
                            </h4>
                            <button
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleSaveCard(msg.id, msg.result)}
                            >
                              {savedId === msg.id ? 'ギャラリー保存済' : 'ギャラリーへ保存'}
                            </button>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', marginBottom: '6px' }}>
                            メイン: {msg.result.ai_prompts.main_visual}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#c084fc', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                            3面図: {msg.result.ai_prompts.turnaround_sheet}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              スレッドを選択して対話履歴を表示します
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
