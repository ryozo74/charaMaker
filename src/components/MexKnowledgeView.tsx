import React, { useState } from 'react';
import { MexGraphData, MexGraphNode } from '../types';
import { INITIAL_MEX_GRAPH } from '../mockData';
import { Network, FileText, Code, CheckCircle, Database, Server, Layers } from 'lucide-react';

export const MexKnowledgeView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MexGraphNode | null>(INITIAL_MEX_GRAPH.nodes[0]);

  const getNodeIcon = (type: MexGraphNode['type']) => {
    switch (type) {
      case 'component': return <Code size={16} color="var(--accent-cyan)" />;
      case 'data': return <Database size={16} color="var(--accent-amber)" />;
      case 'type-definition': return <FileText size={16} color="#c084fc" />;
      case 'server': return <Server size={16} color="var(--accent-emerald)" />;
      case 'tokens': return <Layers size={16} color="var(--accent-pink)" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', height: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
              Mex Agent Codebase Knowledge Graph
            </h1>
            <span className="badge badge-cyan">.mex / v1.0.0</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            charaMaker のコード構造・コンポーネント依存関係グラフと自動抽出ナレッジドキュメントを可視化します
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column: Interactive Node Graph & Wiki Doc */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Visual Node Grid */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>コードグラフノード ({INITIAL_MEX_GRAPH.nodes.length} nodes)</h3>
              </div>
              <span className="badge badge-emerald">INDEXED</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {INITIAL_MEX_GRAPH.nodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="glass-panel"
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    background: selectedNode?.id === node.id ? 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(127,0,255,0.2))' : 'rgba(255,255,255,0.04)',
                    borderColor: selectedNode?.id === node.id ? 'var(--accent-cyan)' : 'var(--glass-border)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {getNodeIcon(node.type)}
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{node.id}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {node.path}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Wiki Document Display */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FileText size={18} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Wiki ドキュメント (.mex/wiki.md)</h3>
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--text-main)'
              }}
            >
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '12px', fontSize: '1.1rem' }}>
                # 🎨 charaMaker - Codebase Knowledge Graph (.mex)
              </h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                charaMaker は、AI を活用した特化型キャラクターデザイン・プロンプト構築・アセット管理を行う Glassmorphism Web アプリケーションです。
              </p>

              <h5 style={{ color: '#c084fc', marginBottom: '8px', fontSize: '0.95rem' }}>## 1. コンポーネント構成</h5>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <li><strong>App (`src/App.tsx`)</strong>: グローバルルーティングと状態保持マネージャー。</li>
                <li><strong>CharacterStudio (`src/components/CharacterStudio.tsx`)</strong>: 属性リアルタイム組み合わせ＆プロンプト自動構築エンジン。</li>
                <li><strong>CharacterGallery (`src/components/CharacterGallery.tsx`)</strong>: タグソート＆フリーワード検索付きカードギャラリー。</li>
                <li><strong>Sidebar (`src/components/Sidebar.tsx`)</strong>: Glassmorphism ナビゲーションメニュー。</li>
              </ul>

              <h5 style={{ color: 'var(--accent-emerald)', marginBottom: '8px', fontSize: '0.95rem' }}>## 2. Mex Agent 連携</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                `mex-agent` により `.mex/graph.json` と `.mex/wiki.md` が常時同期され、AI コンテキストとしてプロジェクト構造を即時参照可能です。
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Node Detail Inspector */}
        <div>
          {selectedNode ? (
            <div className="glass-panel" style={{ padding: '20px', position: 'sticky', top: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="badge badge-purple">{selectedNode.type}</span>
                <CheckCircle size={16} color="var(--accent-emerald)" />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {selectedNode.id}
              </h3>

              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '16px'
                }}
              >
                {selectedNode.path}
              </div>

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>ノード概要・役割</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedNode.description}
              </p>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MEX INDEX STATUS: VALID</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              ノードを選択して詳細情報を表示します
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
