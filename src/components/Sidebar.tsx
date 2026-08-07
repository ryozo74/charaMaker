import React from 'react';
import { ViewMode } from '../types';
import { Sparkles, MessageSquare, Clock, LayoutGrid, Network, Settings, Sliders } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  characterCount: number;
  historyThreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  characterCount,
  historyThreadCount
}) => {
  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        height: '100%',
        margin: 0,
        borderRadius: 0,
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        padding: '20px 16px'
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(0, 242, 254, 0.4)'
          }}
        >
          <Sparkles size={22} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }} className="gradient-text">
            charaMaker
          </h2>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em' }}>
            AI CHARA STUDIO
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        className="btn-primary"
        style={{ width: '100%', marginBottom: '24px', justifyContent: 'center' }}
        onClick={() => onViewChange('chara-chat')}
      >
        <MessageSquare size={18} />
        Chara Chat を開始
      </button>

      {/* Navigation Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, padding: '0 8px 6px 8px', letterSpacing: '0.06em' }}>
          MAIN MENU
        </div>

        <button
          onClick={() => onViewChange('chara-chat')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'chara-chat' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'chara-chat' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'chara-chat' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'chara-chat' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <MessageSquare size={18} color={currentView === 'chara-chat' ? 'var(--accent-cyan)' : 'currentColor'} />
          <span>Chara Chat (チャット)</span>
        </button>

        <button
          onClick={() => onViewChange('matrix-studio')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'matrix-studio' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'matrix-studio' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'matrix-studio' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'matrix-studio' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <Sliders size={18} color={currentView === 'matrix-studio' ? 'var(--accent-cyan)' : 'currentColor'} />
          <span>マトリクススタジオ</span>
        </button>

        <button
          onClick={() => onViewChange('history')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'history' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'history' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'history' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'history' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <Clock size={18} color={currentView === 'history' ? 'var(--accent-cyan)' : 'currentColor'} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>対話・生成履歴</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
              {historyThreadCount}
            </span>
          </div>
        </button>

        <button
          onClick={() => onViewChange('gallery')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'gallery' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'gallery' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'gallery' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'gallery' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <LayoutGrid size={18} color={currentView === 'gallery' ? 'var(--accent-cyan)' : 'currentColor'} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>キャラギャラリー</span>
            <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
              {characterCount}
            </span>
          </div>
        </button>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, padding: '16px 8px 6px 8px', letterSpacing: '0.06em' }}>
          AGENT & SYSTEM
        </div>

        <button
          onClick={() => onViewChange('mex-knowledge')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'mex-knowledge' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'mex-knowledge' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'mex-knowledge' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'mex-knowledge' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <Network size={18} color={currentView === 'mex-knowledge' ? 'var(--accent-cyan)' : 'currentColor'} />
          <span>Mex Agent ナレッジ</span>
        </button>

        <button
          onClick={() => onViewChange('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: currentView === 'settings' ? 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(127,0,255,0.2))' : 'transparent',
            color: currentView === 'settings' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: currentView === 'settings' ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            outline: currentView === 'settings' ? '1px solid var(--glass-border-highlight)' : 'none'
          }}
        >
          <Settings size={18} color={currentView === 'settings' ? 'var(--accent-cyan)' : 'currentColor'} />
          <span>設定＆モデル</span>
        </button>
      </div>

      {/* Footer Info Box */}
      <div
        className="glass-panel"
        style={{
          padding: '12px',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Chara Chat Engine</span>
          <span className="badge badge-emerald" style={{ padding: '1px 6px', fontSize: '0.62rem' }}>READY</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Thread Auto-Save Active
        </span>
      </div>
    </aside>
  );
};
