import React, { useState, useEffect } from 'react';
import { subscribeDebugLogs, clearDebugLogs, DebugLogEntry } from '../utils/debugLogger';
import { Terminal, Trash2, ChevronUp, ChevronDown, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export const DebugLogDrawer: React.FC = () => {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeDebugLogs(setLogs);
    return () => unsubscribe();
  }, []);

  const getIcon = (level: DebugLogEntry['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle size={14} color="#10b981" />;
      case 'warn':
        return <AlertTriangle size={14} color="#f59e0b" />;
      case 'error':
        return <XCircle size={14} color="#ef4444" />;
      default:
        return <Info size={14} color="#3b82f6" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: '20px',
        width: '560px',
        maxHeight: isOpen ? '280px' : '36px',
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.5)',
        transition: 'max-height 0.25s ease'
      }}
    >
      {/* Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: '36px',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.05)',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd' }}>
          <Terminal size={14} />
          <span>リアルタイム裏ログ (Live Debug Logs)</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
            {logs.length} 件
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearDebugLogs();
            }}
            title="ログ消去"
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          >
            <Trash2 size={13} />
          </button>
          {isOpen ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronUp size={14} color="#94a3b8" />}
        </div>
      </div>

      {/* Log Body */}
      {isOpen && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 14px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.74rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
              ログ待ち受中... (API通信が発生するとここに詳細が表示されます)
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                style={{
                  background: log.level === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  borderLeft: `3px solid ${log.level === 'error' ? '#ef4444' : log.level === 'success' ? '#10b981' : log.level === 'warn' ? '#f59e0b' : '#3b82f6'}`,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getIcon(log.level)}
                    <span style={{ fontWeight: 700, color: log.provider === 'higgsfield' ? '#fef08a' : '#67e8f9' }}>
                      [{log.provider === 'higgsfield' ? 'Higgsfield' : 'z8b GPU'}]
                    </span>
                    <span style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>{log.message}</span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', flexShrink: 0 }}>{log.timestamp}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '0.68rem', paddingLeft: '20px' }}>
                  <span>URL: {log.endpoint}</span>
                  {log.status && <span style={{ color: log.status === 200 ? '#34d399' : '#f87171' }}>Status: {log.status} {log.statusText}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
