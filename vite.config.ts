import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'higgsfield-cli-bridge',
      configureServer(server) {
        server.middlewares.use('/api/higgsfield-cli-status', async (req, res) => {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const jobId = urlObj.searchParams.get('jobId');

          if (!jobId) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'jobId is required' }));
            return;
          }

          try {
            const { execSync } = await import('child_process');
            const statusStr = execSync(`npx higgsfield generate get ${jobId} --json`, { encoding: 'utf-8' });
            const statusJson = JSON.parse(statusStr);

            let imageUrl = statusJson.result_url || statusJson.min_result_url;
            if (!imageUrl && statusJson.status === 'completed') {
              try {
                const listStr = execSync('npx higgsfield generate list --size 5 --json', { encoding: 'utf-8' });
                const listJson = JSON.parse(listStr);
                const match = listJson.find((j: any) => j.id === jobId && j.result_url);
                if (match) imageUrl = match.result_url;
              } catch(e) {}
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              status: statusJson.status || 'in_progress',
              imageUrl: imageUrl || null
            }));
          } catch(err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });

        server.middlewares.use('/api/higgsfield-cli-generate', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method Not Allowed');
            return;
          }

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const prompt = body.prompt || 'A cute mascot character named 車ベア';
              const model = body.model || 'nano_banana_2';
              const { execSync } = await import('child_process');

              console.log(`[Vite CLI Bridge] Instant job creation (Prompt: ${prompt.substring(0, 30)}...)...`);

              try {
                execSync('npx higgsfield workspace set 404f1f58-ab76-4ee9-8969-06d878818423', { encoding: 'utf-8' });
              } catch(e) {}

              const cmd = `npx higgsfield generate create ${model} --prompt "${prompt.replace(/"/g, '\\"')}" --aspect-ratio 3:4`;
              const createOutput = execSync(cmd, { encoding: 'utf-8' });

              const jobIdMatch = createOutput.match(/([a-f0-9-]{36})/i);
              if (!jobIdMatch) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Failed to create CLI job' }));
                return;
              }

              const jobId = jobIdMatch[1];
              console.log(`[Vite CLI Bridge] Fast job created: ${jobId}`);

              // Instantly respond to browser in < 1 second!
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                jobId: jobId,
                status: 'queued',
                message: '🍌 Higgsfield クラウドへジョブ投入完了！非同期レンダリング中...'
              }));
            } catch(err: any) {
              console.error('[Vite CLI Bridge Error]', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        });
      }
    }
  ],
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api/z8b': {
        target: 'http://192.168.44.120:9000',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000,
        rewrite: (path) => path.replace(/^\/api\/z8b/, '')
      },
      '/outputs': {
        target: 'http://192.168.44.120:9000',
        changeOrigin: true,
        timeout: 600000,
        proxyTimeout: 600000
      },
      '/api/higgsfield-platform': {
        target: 'https://platform.higgsfield.ai',
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'https://higgsfield.ai',
          'Referer': 'https://higgsfield.ai/'
        },
        rewrite: (path) => path.replace(/^\/api\/higgsfield-platform/, '')
      },
      '/api/higgsfield-gw': {
        target: 'https://fnf-api-gw.higgsfield.ai',
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'https://higgsfield.ai',
          'Referer': 'https://higgsfield.ai/'
        },
        rewrite: (path) => path.replace(/^\/api\/higgsfield-gw/, '/fnf')
      },
      '/api/higgsfield-mcp': {
        target: 'https://mcp.higgsfield.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/higgsfield-mcp/, ''),
        headers: {
          'Accept': 'application/json, text/event-stream'
        }
      },
      '/api/ollama': {
        target: 'http://192.168.44.139:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, '')
      }
    }
  }
});
