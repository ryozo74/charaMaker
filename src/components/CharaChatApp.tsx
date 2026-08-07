import React, { useState } from 'react';
import { ChatThreadHistory, SavedCharacterCard, RenderStyle, EngineProvider } from '../types';
import { Send, User, Bot, Sparkles, Copy, Save, Check, Download, Zap, RefreshCw, Eye, X } from 'lucide-react';
import { generateMatrixCharacter, parseNaturalLanguageInput } from '../utils/matrixEngine';
import { callMcpByProvider } from '../utils/mcpClient';

interface CharaChatAppProps {
  currentThread?: ChatThreadHistory;
  engineProvider: EngineProvider;
  onToggleEngineProvider: (provider: EngineProvider) => void;
  onSendMessage: (text: string, targetAge: number, properNoun: string, renderStyle: RenderStyle, customAssistantId?: string) => void;
  onSaveToGallery: (card: SavedCharacterCard) => void;
  onUpdateMessageImage?: (messageId: string, imageUrl: string) => void;
}

export const CharaChatApp: React.FC<CharaChatAppProps> = ({
  currentThread,
  engineProvider,
  onToggleEngineProvider,
  onSendMessage,
  onSaveToGallery,
  onUpdateMessageImage
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [generatingMsgId, setGeneratingMsgId] = useState<string | null>(null);
  const [mcpStatusMessage, setMcpStatusMessage] = useState<string | null>(null);
  const [autoAccept, setAutoAccept] = useState<boolean>(true);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const QUICK_PROMPTS = [
    '3.5歳向け 車',
    '3歳向け 猫',
    '2歳向け パン',
    '5歳向け 恐竜ヒーロー',
    '1歳向け もちもちおにぎり'
  ];

  const triggerMCPGen = async (msgId: string, result: any) => {
    setGeneratingMsgId(msgId);
    const providerLabel = engineProvider === 'higgsfield' ? '🍌 Higgsfield (nano_banana_flash)' : '⚡ z8b (192.168.44.120:9000)';
    setMcpStatusMessage(`${providerLabel} で自動レンダリング中...`);

    const res = await callMcpByProvider(engineProvider, {
      positivePrompt: result.ai_prompts.main_visual,
      turnaroundPrompt: result.ai_prompts.turnaround_sheet,
      negativePrompt: result.ai_prompts.negative_prompt,
      model: engineProvider === 'higgsfield' ? 'nano_banana_flash' : 'sd3.5_large_fp8_scaled.safetensors'
    });

    setGeneratingMsgId(null);
    setMcpStatusMessage(res.message || `${providerLabel} レンダリング完了`);
    setTimeout(() => setMcpStatusMessage(null), 5000);

    if (res.success && res.imageUrl) {
      if (onUpdateMessageImage) {
        onUpdateMessageImage(msgId, res.imageUrl);
      }
      
      const card: SavedCharacterCard = {
        id: `chara-${Date.now()}`,
        result,
        imageUrl: res.imageUrl,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isFavorite: false,
        engineProvider
      };
      onSaveToGallery(card);
      setSavedId(msgId);
      setTimeout(() => setSavedId(null), 2500);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim() || '3.5歳向け 車';

    const parsed = parseNaturalLanguageInput(textToSend);
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    onSendMessage(textToSend, parsed.age, parsed.noun, parsed.renderStyle, assistantMsgId);
    setInputText('');

    if (autoAccept) {
      const generatedResult = generateMatrixCharacter(parsed.age, parsed.noun, parsed.renderStyle);
      setTimeout(() => {
        triggerMCPGen(assistantMsgId, generatedResult);
      }, 300);
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    const parsed = parseNaturalLanguageInput(promptText);
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    onSendMessage(promptText, parsed.age, parsed.noun, parsed.renderStyle, assistantMsgId);

    if (autoAccept) {
      const generatedResult = generateMatrixCharacter(parsed.age, parsed.noun, parsed.renderStyle);
      setTimeout(() => {
        triggerMCPGen(assistantMsgId, generatedResult);
      }, 300);
    }
  };

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadJSON = (result: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${result.character_profile.name}_prompts.json`);
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Bar with Title & Auto Accept Toggle */}
      <div
        className="glass-panel"
        style={{
          margin: '12px 16px 0 16px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }} className="gradient-text">
            Chara Chat（対話型プロンプト＆マトリクス自動生成）
          </h2>
        </div>

        {/* Auto Accept Toggle Button */}
        <button
          type="button"
          onClick={() => setAutoAccept(!autoAccept)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            background: autoAccept ? 'rgba(0, 230, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: autoAccept ? '1px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
            color: autoAccept ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Zap size={13} color={autoAccept ? 'var(--accent-emerald)' : 'var(--text-secondary)'} />
          <span>⚡ 自動生成 ({autoAccept ? 'ON' : 'OFF'})</span>
        </button>
      </div>

      {/* Render Notification Status Bar */}
      {mcpStatusMessage && (
        <div style={{ margin: '8px 16px 0 16px', padding: '10px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 230, 153, 0.2)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <RefreshCw size={14} className="animate-spin" />
          <span>{mcpStatusMessage}</span>
        </div>
      )}

      {/* Chat Messages Timeline Area */}
      <div
        style={{
          flex: 1,
          padding: '20px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {(currentThread?.messages || []).map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '6px'
            }}
          >
            {/* Sender Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {msg.sender === 'user' ? (
                <>
                  <span>ユーザー</span>
                  <User size={13} />
                </>
              ) : (
                <>
                  <Bot size={13} color="var(--accent-cyan)" />
                  <span>charaMaker Engine</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            {msg.sender === 'user' ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 172, 254, 0.15))',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  padding: '12px 18px',
                  borderRadius: '18px 18px 2px 18px',
                  color: '#fff',
                  maxWidth: '75%',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}
              >
                {msg.text}
              </div>
            ) : msg.result ? (
              <div
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '92%',
                  width: '780px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Character Name & Status Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {msg.result.character_profile.name}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        ({msg.result.character_profile.reading})
                      </span>
                      <span className={`badge ${getModeBadgeClass(msg.result.matrix_status.design_mode)}`}>
                        {msg.result.matrix_status.design_mode} モード ({msg.result.matrix_status.target_age}歳 / X={msg.result.matrix_status.x_weight_percent}%)
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                      モチーフ: 「{msg.result.character_profile.proper_noun}」
                    </p>
                  </div>

                  {/* Trigger MCP Render & Save Button Group */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => triggerMCPGen(msg.id, msg.result)}
                      disabled={generatingMsgId === msg.id}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderColor: engineProvider === 'higgsfield' ? '#ffcc00' : 'var(--accent-cyan)',
                        color: engineProvider === 'higgsfield' ? '#ffcc00' : 'var(--accent-cyan)'
                      }}
                    >
                      <Zap size={14} className={generatingMsgId === msg.id ? 'animate-spin' : ''} />
                      <span>{generatingMsgId === msg.id ? '生成中...' : `${engineProvider === 'higgsfield' ? '🍌 Higgsfield' : '⚡ z8b MCP'} 画像生成`}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleDownloadJSON(msg.result)}
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Download size={14} />
                      <span>JSON保存</span>
                    </button>
                  </div>
                </div>

                {/* Generated Image Display Area */}
                {msg.imageUrl && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🎨 生成済みイラスト結果 ({engineProvider === 'higgsfield' ? '🍌 Higgsfield nano-banana-pro' : '⚡ z8b ComfyUI'})
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl(msg.imageUrl || null)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}
                      >
                        <Eye size={14} /> 拡大表示
                      </button>
                    </div>
                    
                    <img
                      src={msg.imageUrl}
                      alt={msg.result.character_profile.name}
                      onClick={() => setPreviewImageUrl(msg.imageUrl || null)}
                      style={{
                        width: '320px',
                        height: '320px',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-sm)',
                        background: '#fff',
                        border: '2px solid var(--border-glass)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      className="hover:scale-105"
                    />
                  </div>
                )}

                {/* Worldview & Story Role */}
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>📖 世界観＆ストーリー役割</div>
                  <p style={{ color: 'var(--text-main)', marginBottom: '4px' }}>{msg.result.character_profile.world_view}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{msg.result.character_profile.story_role}</p>
                </div>

                {/* AI Prompts Output Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Main Visual Prompt */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>🖼️ メイン生成プロンプト (Main Visual)</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(`${msg.id}-main`, msg.result?.ai_prompts.main_visual || '')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                      >
                        {copiedId === `${msg.id}-main` ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                        <span>{copiedId === `${msg.id}-main` ? 'コピー完了' : 'コピー'}</span>
                      </button>
                    </div>
                    <code style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'block', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                      {msg.result?.ai_prompts.main_visual}
                    </code>
                  </div>

                  {/* 3-Turnaround Sheet Prompt */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)' }}>📐 3面図プロンプト (Turnaround Sheet)</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(`${msg.id}-turnaround`, msg.result?.ai_prompts.turnaround_sheet || '')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                      >
                        {copiedId === `${msg.id}-turnaround` ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                        <span>{copiedId === `${msg.id}-turnaround` ? 'コピー完了' : 'コピー'}</span>
                      </button>
                    </div>
                    <code style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'block', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                      {msg.result?.ai_prompts.turnaround_sheet}
                    </code>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              onClick={() => setPreviewImageUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={28} />
            </button>
            <img
              src={previewImageUrl}
              alt="Generated Character Preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                background: '#fff'
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Prompts Bar */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', whiteSpace: 'nowrap' }}>クイック入力:</span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            className="chip chip-hover"
            onClick={() => handleQuickPromptClick(qp)}
            style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)' }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Bar Form */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '16px',
          background: 'rgba(15, 17, 23, 0.95)',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          gap: '12px'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="例: 「3歳向け 猫」または「車ベア」と入力して送信..."
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Send size={16} />
          <span>送信</span>
        </button>
      </form>
    </div>
  );
};
