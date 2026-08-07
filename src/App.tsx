import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CharaChatApp } from './components/CharaChatApp';
import { CharaHistoryView } from './components/CharaHistoryView';
import { MatrixStudio } from './components/MatrixStudio';
import { CharacterGallery } from './components/CharacterGallery';
import { MexKnowledgeView } from './components/MexKnowledgeView';
import { DebugLogDrawer } from './components/DebugLogDrawer';
import { SavedCharacterCard, ChatThreadHistory, ChatMessage, ViewMode, RenderStyle, EngineProvider } from './types';
import { INITIAL_SAVED_CHARACTERS, INITIAL_CHAT_THREADS } from './mockData';
import { generateMatrixCharacter } from './utils/matrixEngine';
import { getHiggsfieldToken, setHiggsfieldToken } from './utils/mcpClient';
import { Zap, Key } from 'lucide-react';

const STORAGE_KEY_CHARACTERS = 'charaMaker_saved_cards_v3';
const STORAGE_KEY_THREADS = 'charaMaker_chat_threads_v3';
const STORAGE_KEY_ENGINE_PROVIDER = 'charaMaker_engine_provider_v3';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('chara-chat');
  const [tokenInput, setTokenInput] = useState<string>(getHiggsfieldToken());
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  
  const [engineProvider, setEngineProvider] = useState<EngineProvider>(() => {
    const localData = localStorage.getItem(STORAGE_KEY_ENGINE_PROVIDER);
    if (localData === 'higgsfield' || localData === 'z8b_comfyui') {
      return localData;
    }
    return 'higgsfield';
  });

  const [threads, setThreads] = useState<ChatThreadHistory[]>(() => {
    const localData = localStorage.getItem(STORAGE_KEY_THREADS);
    if (localData) {
      try { return JSON.parse(localData); } catch (e) {}
    }
    return INITIAL_CHAT_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0]?.id || INITIAL_CHAT_THREADS[0].id);

  const [characters, setCharacters] = useState<SavedCharacterCard[]>(() => {
    const localData = localStorage.getItem(STORAGE_KEY_CHARACTERS);
    if (localData) {
      try { return JSON.parse(localData); } catch (e) {}
    }
    return INITIAL_SAVED_CHARACTERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THREADS, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENGINE_PROVIDER, engineProvider);
  }, [engineProvider]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || INITIAL_CHAT_THREADS[0];

  const handleSendMessage = (text: string, targetAge: number, properNoun: string, renderStyle: RenderStyle, customAssistantId?: string) => {
    const timeStr = new Date().toTimeString().slice(0, 5);
    const result = generateMatrixCharacter(targetAge, properNoun, renderStyle);
    const assistantId = customAssistantId || `msg-${Date.now()}-assistant`;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      timestamp: timeStr,
      text,
      targetAge,
      properNoun
    };

    const assistantMsg: ChatMessage = {
      id: assistantId,
      sender: 'assistant',
      timestamp: timeStr,
      result
    };

    setThreads(prevThreads => {
      return prevThreads.map(thread => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            updatedAt: 'たった今',
            messages: [...thread.messages, userMsg, assistantMsg]
          };
        }
        return thread;
      });
    });
  };

  const handleUpdateMessageImage = (messageId: string, imageUrl: string) => {
    setThreads(prevThreads => {
      return prevThreads.map(thread => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            messages: thread.messages.map(m => m.id === messageId ? { ...m, imageUrl } : m)
          };
        }
        return thread;
      });
    });
  };

  const handleSaveToGallery = (card: SavedCharacterCard) => {
    setCharacters(prev => [ { ...card, engineProvider }, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveToken = () => {
    setHiggsfieldToken(tokenInput);
    setShowTokenModal(false);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: '#090c15', color: '#f0f4fc' }}>
      {/* Sidebar Component */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        characterCount={characters.length}
        historyThreadCount={threads.length}
      />

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#070912' }}>
        {/* Unified Top Header Bar */}
        <header style={{ height: '60px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 20, 35, 0.9)', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>
              CM
            </div>
            <div>
              <h1 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                charaMaker
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  Matrix Engine v2.0
                </span>
              </h1>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>1〜6歳児向け 固有名詞連携マトリクス自動生成システム</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Engine Switcher Button Group */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                type="button"
                onClick={() => setEngineProvider('z8b_comfyui')}
                style={{
                  background: engineProvider === 'z8b_comfyui' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                  color: engineProvider === 'z8b_comfyui' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Zap size={13} />
                z8b ComfyUI
              </button>
              <button
                type="button"
                onClick={() => setEngineProvider('higgsfield')}
                style={{
                  background: engineProvider === 'higgsfield' ? 'linear-gradient(135deg, #eab308, #d97706)' : 'transparent',
                  color: engineProvider === 'higgsfield' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>🍌 Higgsfield (nano_banana_flash)</span>
              </button>
            </div>

            <div style={{ height: '16px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span>Engine Ready</span>
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <main style={{ flex: 1, height: 'calc(100vh - 60px)', overflow: 'hidden', position: 'relative' }}>
          {currentView === 'chara-chat' && (
            <CharaChatApp
              currentThread={activeThread}
              engineProvider={engineProvider}
              onToggleEngineProvider={setEngineProvider}
              onSendMessage={handleSendMessage}
              onSaveToGallery={handleSaveToGallery}
              onUpdateMessageImage={handleUpdateMessageImage}
            />
          )}

          {currentView === 'matrix-studio' && (
            <MatrixStudio
              onSaveCharacter={handleSaveToGallery}
            />
          )}

          {currentView === 'history' && (
            <CharaHistoryView
              threads={threads}
              onSelectThread={(threadId: string) => {
                setActiveThreadId(threadId);
                setCurrentView('chara-chat');
              }}
              onSaveToGallery={handleSaveToGallery}
            />
          )}

          {currentView === 'gallery' && (
            <CharacterGallery
              characters={characters}
              onToggleFavorite={handleToggleFavorite}
              onDeleteCharacter={handleDeleteCharacter}
            />
          )}

          {currentView === 'mex-knowledge' && (
            <MexKnowledgeView />
          )}
        </main>
        
        {/* Live Debug Log Panel */}
        <DebugLogDrawer />
      </div>
    </div>
  );
};

export default App;
