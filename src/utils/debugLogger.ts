export interface DebugLogEntry {
  id: string;
  timestamp: string;
  provider: 'higgsfield' | 'z8b_comfyui';
  level: 'info' | 'success' | 'warn' | 'error';
  endpoint: string;
  status?: number;
  statusText?: string;
  promptSnippet?: string;
  message: string;
  details?: any;
}

type LogListener = (logs: DebugLogEntry[]) => void;

let logEntries: DebugLogEntry[] = [];
const listeners: Set<LogListener> = new Set();

export function addDebugLog(entry: Omit<DebugLogEntry, 'id' | 'timestamp'>): void {
  const newLog: DebugLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toTimeString().slice(0, 8)
  };

  logEntries = [newLog, ...logEntries].slice(0, 50); // Keep last 50 logs
  console.log(`[charaMaker Log] [${newLog.level.toUpperCase()}] ${newLog.provider}: ${newLog.message}`, newLog.details || '');
  listeners.forEach(listener => listener([...logEntries]));
}

export function getDebugLogs(): DebugLogEntry[] {
  return logEntries;
}

export function clearDebugLogs(): void {
  logEntries = [];
  listeners.forEach(listener => listener([]));
}

export function subscribeDebugLogs(listener: LogListener): () => void {
  listeners.add(listener);
  listener([...logEntries]);
  return () => {
    listeners.delete(listener);
  };
}
