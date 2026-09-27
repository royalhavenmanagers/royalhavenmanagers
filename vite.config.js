import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleContactSubmission } from './server/apiHandler.js';
import portalSyncHandler from './api/portal-sync.js';

function wrapResponse(res) {
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      if (!this.getHeader('Content-Type')) {
        this.setHeader('Content-Type', 'application/json');
      }
      return this.end(JSON.stringify(data));
    };
  }
  return res;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    appType: 'spa',
    plugins: [
      react(),
      {
        name: 'royal-haven-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';

            // 1. Contact submission endpoint
            if (req.method === 'POST' && urlPath === '/api/contact') {
              let bodyStr = '';
              req.on('data', chunk => {
                bodyStr += chunk;
              });

              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyStr || '{}');
                  const result = await handleContactSubmission(body, { ...process.env, ...env });
                  res.statusCode = result.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result.body));
                } catch (err) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Invalid JSON request' }));
                }
              });
              return;
            }

            // 2. Real-time portal sync endpoint (GET & POST)
            if (urlPath === '/api/portal-sync') {
              wrapResponse(res);
              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', chunk => {
                  bodyStr += chunk;
                });
                req.on('end', async () => {
                  try {
                    req.body = JSON.parse(bodyStr || '{}');
                  } catch {
                    req.body = {};
                  }
                  try {
                    await portalSyncHandler(req, res);
                  } catch (err) {
                    res.status(500).json({ success: false, error: err.message });
                  }
                });
                return;
              }

              try {
                await portalSyncHandler(req, res);
              } catch (err) {
                res.status(500).json({ success: false, error: err.message });
              }
              return;
            }

            next();
          });
        }
      }
    ],
  };
});

