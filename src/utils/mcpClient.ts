// Higgsfield MCP & CLI Client helper for charaMaker
import { addDebugLog } from './debugLogger';

export interface MCPGenerationRequest {
  positivePrompt: string;
  turnaroundPrompt?: string;
  negativePrompt?: string;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  authHeader?: string;
}

export interface MCPGenerationResponse {
  success: boolean;
  imageUrl?: string;
  turnaroundUrl?: string;
  message?: string;
  rawJson?: any;
  rawResponse?: string;
  error?: string;
}

const STORAGE_KEY_TOKEN = 'charaMaker_higgsfield_token';
let currentHiggsfieldToken = typeof localStorage !== 'undefined'
  ? localStorage.getItem(STORAGE_KEY_TOKEN) || ''
  : '';

export function getHiggsfieldToken(): string {
  return currentHiggsfieldToken;
}

export function setHiggsfieldToken(token: string): void {
  currentHiggsfieldToken = token.trim();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_TOKEN, currentHiggsfieldToken);
  }
}

export async function callHiggsfieldMCP(req: MCPGenerationRequest): Promise<MCPGenerationResponse> {
  addDebugLog({
    provider: 'higgsfield',
    level: 'info',
    endpoint: '/api/higgsfield-cli-generate',
    promptSnippet: req.positivePrompt.slice(0, 60) + '...',
    message: '🍌 Higgsfield CLI (2240.9 クレジット Ultra) ジョブ投入中...'
  });

  const prompt = req.positivePrompt;
  const model = 'nano_banana_2';

  // 1. Instant Job Creation
  try {
    const response = await fetch('/api/higgsfield-cli-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt, model: model })
    });

    const data = await response.json();

    if (data.success && data.jobId) {
      const jobId = data.jobId;
      addDebugLog({
        provider: 'higgsfield',
        level: 'info',
        endpoint: '/api/higgsfield-cli-generate',
        status: 200,
        message: `🚀 クラウド投入成功 (ID: ${jobId})。非同期レンダリング完了を待機中...`
      });

      // Fast Async Polling Loop (120 seconds total)
      for (let poll = 1; poll <= 60; poll++) {
        await new Promise(r => setTimeout(r, 2000));
        try {
          const statusRes = await fetch(`/api/higgsfield-cli-status?jobId=${jobId}`);
          const statusData = await statusRes.json();

          addDebugLog({
            provider: 'higgsfield',
            level: 'info',
            endpoint: '/api/higgsfield-cli-status',
            message: `⏳ レンダリング進行中 (${poll * 2}秒経過, ステータス: ${statusData.status || 'in_progress'})...`
          });

          if (statusData.success && statusData.imageUrl) {
            addDebugLog({
              provider: 'higgsfield',
              level: 'success',
              endpoint: '/api/higgsfield-cli-status',
              status: 200,
              message: `🎉 レンダリング完了! URL: ${statusData.imageUrl}`
            });

            return {
              success: true,
              imageUrl: statusData.imageUrl,
              rawResponse: JSON.stringify(statusData),
              message: '🎉 Higgsfield (2240.9 クレジット Ultra) 画像生成完了！'
            };
          }
        } catch (pollErr) {}
      }
    }
  } catch (e: any) {
    addDebugLog({
      provider: 'higgsfield',
      level: 'warn',
      endpoint: '/api/higgsfield-cli-generate',
      message: `⚠️ CLI Bridge 通信ノート: ${e.message}`
    });
  }

  // 2. High Quality z8b Fallback
  try {
    const isBrowser = typeof window !== 'undefined';
    const z8bEndpoint = isBrowser ? '/api/z8b/api/v1/generate-image' : 'http://192.168.44.120:9000/api/v1/generate-image';

    addDebugLog({
      provider: 'z8b_comfyui',
      level: 'info',
      endpoint: z8bEndpoint,
      message: '⚡ ローカル GPU (z8b SD 3.5 Large) パイプラインを駆動中...'
    });

    const z8bRes = await fetch(z8bEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': 'audio2mov_secret_key_2026' },
      body: JSON.stringify({
        scene_id: 'web_app_' + Date.now(),
        prompt: req.positivePrompt,
        negative_prompt: req.negativePrompt || 'blurry',
        model: 'sd3.5_large_fp8_scaled.safetensors',
        width: req.width || 896,
        height: req.height || 1200,
        steps: req.steps || 35
      })
    });

    const z8bData = await z8bRes.json();
    if (z8bData.image_url) {
      const fullUrl = z8bData.image_url.startsWith('http') ? z8bData.image_url : 'http://192.168.44.120:9000' + z8bData.image_url;

      addDebugLog({
        provider: 'z8b_comfyui',
        level: 'success',
        endpoint: z8bEndpoint,
        status: 200,
        message: `✨ 高画質イラストレンダリング成功! URL: ${fullUrl}`
      });

      return {
        success: true,
        imageUrl: fullUrl,
        rawResponse: JSON.stringify(z8bData),
        message: '✨ 高画質イラストレンダリング完了！'
      };
    }
  } catch (err: any) {
    addDebugLog({
      provider: 'z8b_comfyui',
      level: 'error',
      endpoint: '/api/z8b/api/v1/generate-image',
      message: `❌ GPU 接続エラー: ${err.message}`
    });
  }

  addDebugLog({
    provider: 'higgsfield',
    level: 'error',
    endpoint: 'Generation Pipeline',
    message: '❌ 画像生成を実行できませんでした。ネットワーク接続またはサーバー状態をご確認ください。'
  });

  return {
    success: false,
    message: '画像生成を実行できませんでした。接続設定をご確認ください。'
  };
}

export async function callZ8bComfyUIMCP(req: MCPGenerationRequest): Promise<MCPGenerationResponse> {
  return callHiggsfieldMCP(req);
}

export async function callMcpByProvider(
  provider: 'higgsfield' | 'z8b_comfyui',
  req: MCPGenerationRequest
): Promise<MCPGenerationResponse> {
  return callHiggsfieldMCP(req);
}
